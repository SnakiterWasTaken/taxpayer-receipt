import {writeFile,readFile,mkdir} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalizeSectorSpending,validateSectorSpending,sectorSourceUrl,sectorCoverage} from '../src/sector-spending.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
let lastError;
for(let attempt=1;attempt<=4;attempt++){
 try{
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),120000);
   let response;
   try{response=await fetch(sectorSourceUrl(),{signal:controller.signal,headers:{accept:'application/json'}})}
   finally{clearTimeout(timeout)}
   if(!response.ok)throw Error('Eurostat official sector HTTP '+response.status+': '+(await response.text()).slice(0,240));
   const result=validateSectorSpending(normalizeSectorSpending(await response.json()));
   const national=JSON.parse(await readFile(join(root,'data','eu-spending.json'),'utf8'));
   let crossChecked=0;
   for(const [key,record] of Object.entries(result.entries)){
     const corresponding=national.entries[record.country+'-'+record.year]?.categories
       .find(c=>c.code===record.code);
     if(!corresponding)continue;
     const diff=Math.abs(corresponding.eurMillion-record.s13EurMillion);
     if(diff>Math.max(0.15,Math.abs(corresponding.eurMillion)*0.005))
       throw Error('Published S13 and sector-source totals disagree for '+key+': '+diff+' million EUR');
     crossChecked++;
   }
   const coverage=sectorCoverage(result,2024);
   const totals=coverage.filter(x=>x.categoriesWithNationalTotal===10).length;
   const sectorCoverageCountries=coverage.filter(x=>x.categoriesWithReportedSubsector>0).length;
   // Every country is scanned, even when no reported subsector data exists.
   if(totals<25)throw Error('Only '+totals+'/27 countries had the ten official 2024 categories; fail-closed');
   const target=join(root,'data','institutional-spending.json');
   await mkdir(dirname(target),{recursive:true});
   await writeFile(target,JSON.stringify(result,null,2)+'\n');
   console.log('EU27 institutional reporting sweep: '+coverage.length+' countries checked for 2024.');
   console.log('Official 2024 national COFOG full-category coverage: '+totals+'/27.');
   console.log('Countries with any published subsector expenditure: '+sectorCoverageCountries+'/27.');
   console.log('Source-comparable S13 cells cross-checked: '+crossChecked+'.');
   console.log('Country | S13 of 10 | functions with subsectors | reported subsector cells');
   for(const row of coverage)console.log(row.country+' | '+row.categoriesWithNationalTotal+
     '/10 | '+row.categoriesWithReportedSubsector+'/10 | '+row.reportedSubsectorCells);
   console.log('Saved source-backed institutional reporting: '+target);
   process.exit(0);
 }catch(e){
   lastError=e;
   console.error('Official sector sweep attempt '+attempt+' failed: '+e.message);
   if(attempt<4)await new Promise(resolve=>setTimeout(resolve,attempt*2500));
 }
}
console.error('Institutional sector refresh blocked, refusing to publish invented values:',lastError?.stack);
process.exit(1);
