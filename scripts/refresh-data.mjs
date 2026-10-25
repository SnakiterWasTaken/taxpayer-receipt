import {writeFile,mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalizeEurostat,validateSnapshot} from '../src/eurostat.js';
import {sourceUrl} from '../src/config.js';

const __dirname=dirname(fileURLToPath(import.meta.url));
const root=join(__dirname,'..');
const url=sourceUrl();
let lastError;
for(let attempt=0;attempt<4;attempt++) {
  try {
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),90000);
    let response;
    try {response=await fetch(url,{signal:controller.signal,headers:{accept:'application/json'}});}
    finally{clearTimeout(timer);}
    if(!response.ok)throw new Error(`Eurostat HTTP ${response.status}: ${(await response.text()).slice(0,250)}`);
    const raw=await response.json();
    const snapshot=validateSnapshot(normalizeEurostat(raw));
    // Prevent accidentally publishing partial extracts as full EU coverage.
    const completeCountries=new Set(Object.values(snapshot.entries).filter(x=>x.year===2024).map(x=>x.country));
    if(completeCountries.size<25) throw new Error(`Only ${completeCountries.size}/27 countries have complete COFOG 2024 data; aborting refresh.`);
    const target=join(root,'data','eu-spending.json');
    await mkdir(dirname(target),{recursive:true});
    await writeFile(target,JSON.stringify(snapshot,null,2)+'\n');
    console.log(`Wrote ${Object.keys(snapshot.entries).length} complete country-year records to ${target}; ${snapshot.skipped.length} incomplete excluded.`);
    process.exit(0);
  }catch(e){lastError=e;console.error(`Attempt ${attempt+1}: ${e.message}`);if(attempt<3)await new Promise(r=>setTimeout(r,2500*(attempt+1)));}
}
console.error('Eurostat data refresh failed:',lastError?.stack||lastError);
process.exit(1);
