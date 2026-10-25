import {decodeJsonStat} from './eurostat.js';
import {COUNTRIES} from './config.js';
const EU=new Set(COUNTRIES.map(c=>c.code));
export const NO_NATIONAL_MINIMUM_WAGE=Object.freeze(['AT','DK','FI','IT','SE']);
export const ECONOMIC_SOURCES=Object.freeze({
 inflation:{dataset:'prc_hicp_ainr',url:'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_ainr?freq=A&unit=RCH_A_AVG&coicop18=TOTAL&sinceTimePeriod=2021&lang=EN',page:'https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_ainr/default/table?lang=en',description:'Annual-average HICP all-items inflation, % change versus previous calendar year'},
 minimumWage:{dataset:'earn_mw_cur',url:'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/earn_mw_cur?freq=S&currency=NAC&sinceTimePeriod=2021&lang=EN',page:'https://ec.europa.eu/eurostat/databrowser/view/earn_mw_cur/default/table?lang=en',description:'Gross statutory national monthly minimum wage, national-currency series, 1 January'},
 disposableIncome:{dataset:'tepsr_wc310',url:'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tepsr_wc310?sinceTimePeriod=2021&lang=EN',page:'https://ec.europa.eu/eurostat/databrowser/view/tepsr_wc310/default/table?lang=en',description:'Real household gross disposable income per capita, index 2008=100'},
});
function validYear(y){return Number.isInteger(y)&&y>=2021&&y<=2100}
function asYear(raw){const y=Number(raw);return validYear(y)?y:null}
function put(series,geo,year,key,value,status){
 if(!EU.has(geo)||!validYear(year)||!Number.isFinite(value))return false;
 const byYear=series[geo]??={};const record=byYear[year]??={};
 if(Object.hasOwn(record,key))throw Error('Duplicate economic observation: '+geo+' '+year+' '+key);
 record[key]=value;
 if(status)(record.flags??={})[key]=String(status);
 return true;
}
export function normalizeEconomicContext(raw,fetchedAt=new Date().toISOString()){
 if(!raw||typeof raw!=='object')throw Error('Missing economic data response');
 const series={},counts={inflation:0,minimumWage:0,disposableIncome:0};
 if(raw.inflation)for(const r of decodeJsonStat(raw.inflation)){
   const y=asYear(r.time);
   if(y===null||r.freq!=='A'||r.unit!=='RCH_A_AVG'||r.coicop18!=='TOTAL'||r.value < -50||r.value>100)continue;
   if(put(series,r.geo,y,'inflation',r.value,r.status))counts.inflation++;
 }
 if(raw.minimumWage)for(const r of decodeJsonStat(raw.minimumWage)){
   const match=/^(\d{4})-S1$/.exec(String(r.time));
   const y=match?asYear(match[1]):null;
   if(y===null||r.freq!=='S'||r.currency!=='NAC'||r.value<=0)continue;
   if(put(series,r.geo,y,'minimumWage',r.value,r.status))counts.minimumWage++;
 }
 if(raw.disposableIncome)for(const r of decodeJsonStat(raw.disposableIncome)){
   const y=asYear(r.time);
   if(y===null||r.freq!=='A'||r.value<=0)continue;
   if(put(series,r.geo,y,'disposableIncomeIndex',r.value,r.status))counts.disposableIncome++;
 }
 return {schema:1,provider:'Eurostat',fetchedAt,
   sources:Object.fromEntries(Object.entries(ECONOMIC_SOURCES).map(([k,v])=>[k,{dataset:v.dataset,url:v.url,page:v.page,description:v.description}])),
   series,counts};
}
export function validateEconomicContext(snapshot){
 if(snapshot?.schema!==1||snapshot.provider!=='Eurostat'||!snapshot.series||typeof snapshot.series!=='object'||!snapshot.sources)throw Error('Invalid economic snapshot');
 for(const [geo,years] of Object.entries(snapshot.series)){
   if(!EU.has(geo)||!years||typeof years!=='object')throw Error('Invalid country in economic data');
   for(const [y,r] of Object.entries(years)){
     if(!validYear(Number(y))||!r||typeof r!=='object')throw Error('Invalid economic year');
     for(const k of ['inflation','minimumWage','disposableIncomeIndex'])
       if(r[k]!==undefined&&(!Number.isFinite(r[k])||(k==='inflation'?(r[k]<-50||r[k]>100):r[k]<=0)))
         throw Error('Invalid economic value: '+geo+' '+y+' '+k);
   }
 }
 return snapshot;
}
export function economicForYear(snapshot,geo,year){return snapshot?.series?.[geo]?.[year]??null}
export function economicGrowth(current,prior){
 return Number.isFinite(current)&&Number.isFinite(prior)&&prior>0?(current/prior-1)*100:null;
}
export function cumulativeInflation(snapshot,geo,fromYear,toYear){
 if(toYear<=fromYear)return 0;
 let multiplier=1;
 for(let y=fromYear+1;y<=toYear;y++){
   const pct=economicForYear(snapshot,geo,y)?.inflation;
   if(!Number.isFinite(pct))return null;
   multiplier*=1+pct/100;
 }
 return (multiplier-1)*100;
}
