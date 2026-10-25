import {writeFile,mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ECONOMIC_SOURCES,normalizeEconomicContext,validateEconomicContext} from '../src/economic-context.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
async function fetchWithRetry(url,label){
 let error;
 for(let n=0;n<3;n++){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),60000);
  try{
   const res=await fetch(url,{signal:controller.signal,headers:{accept:'application/json'}});
   if(!res.ok)throw Error('HTTP '+res.status+': '+(await res.text()).slice(0,160));
   return await res.json();
  }catch(e){error=e;console.error(label+' attempt '+(n+1)+': '+e.message);}
  finally{clearTimeout(timer)}
  if(n<2)await new Promise(r=>setTimeout(r,2500*(n+1)));
 }
 throw Error(label+' unavailable: '+error.message);
}
const raw={};
for(const [name,source] of Object.entries(ECONOMIC_SOURCES))raw[name]=await fetchWithRetry(source.url,name);
const snapshot=validateEconomicContext(normalizeEconomicContext(raw));
for(const [key,min] of Object.entries({inflation:24,minimumWage:18,disposableIncomeIndex:18})){
 const count=Object.values(snapshot.series).filter(years=>Number.isFinite(years?.[2024]?.[key])).length;
 console.log('Verified '+key+' in 2024: '+count+' EU countries');
 if(count<min)throw Error('Insufficient official '+key+' coverage: '+count+' of at least '+min);
}
const target=join(root,'data','economic-context.json');
await mkdir(dirname(target),{recursive:true});
await writeFile(target,JSON.stringify(snapshot,null,2)+'\n');
console.log('Saved verified historical data: '+target);
