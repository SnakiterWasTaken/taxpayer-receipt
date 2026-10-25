import {COUNTRIES,FUNCTIONS,EUROSTAT_API,EUROSTAT_DATASET} from './config.js';
import {decodeJsonStat} from './eurostat.js';

export const SECTORS=Object.freeze([
 {code:'S1311',label:'Central government',help:'Government ministries and central public agencies (where classified here).'},
 {code:'S1312',label:'State or regional government',help:'State/regional public institutions where this subsector applies.'},
 {code:'S1313',label:'Local government',help:'Municipalities and other local public institutions.'},
 {code:'S1314',label:'Social-security funds',help:'Public social-security funds, where they form a separate institutional subsector.'},
]);
const knownCountries=new Set(COUNTRIES.map(x=>x.code));
const knownFunctions=new Set(FUNCTIONS.map(x=>x.code));
const knownSectors=new Set(['S13',...SECTORS.map(x=>x.code)]);
export const SECTOR_SOURCE='https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table?lang=en';
export const SECTOR_METHOD='https://webgate.ec.europa.eu/eurostat/cache/metadata/en/gov_10a_exp_esms.htm';

/** This sweep is an official expenditure REPORTING breakdown, NOT decision authority. */
export function sectorSourceUrl(){
 const p=new URLSearchParams({
   freq:'A',unit:'MIO_EUR',na_item:'TE',sinceTimePeriod:'2021',
   untilTimePeriod:'2024',lang:'EN',
 });
 return EUROSTAT_API+'?'+p;
}
export function normalizeSectorSpending(raw, fetchedAt=new Date().toISOString()){
 const rows=decodeJsonStat(raw), grouped=new Map();
 for(const row of rows){
   const year=Number(row.time);
   if(!knownCountries.has(row.geo)||!knownFunctions.has(row.cofog99)||
     !knownSectors.has(row.sector)||!Number.isInteger(year)||
     year<2021||year>2024||row.freq!=='A'||row.unit!=='MIO_EUR'||
     row.na_item!=='TE'||!Number.isFinite(row.value)||row.value<0)continue;
   const key=row.geo+'-'+year+'-'+row.cofog99;
   if(!grouped.has(key))grouped.set(key,{country:row.geo,year,code:row.cofog99,values:{}});
   const record=grouped.get(key);
   if(Object.hasOwn(record.values,row.sector))throw Error('Duplicate official sector observation: '+key+' '+row.sector);
   record.values[row.sector]={eurMillion:row.value,flags:String(row.status||'')};
 }
 const entries={};
 for(const [key,record] of grouped){
   const total=record.values.S13;
   // An incomplete S13 series must not be treated as a valid denominator.
   if(!total)continue;
   const sectors={};
   for(const sector of SECTORS){
     if(record.values[sector.code])sectors[sector.code]=record.values[sector.code];
   }
   entries[key]={country:record.country,year:record.year,code:record.code,
     s13EurMillion:total.eurMillion,s13Flags:total.flags,sectors};
 }
 const sweep={};
 // Every EU Member State is assessed, even if it has zero reported cells.
 for(const country of COUNTRIES){
   const years={};
   for(let year=2021;year<=2024;year++){
     const records=FUNCTIONS.map(f=>entries[country.code+'-'+year+'-'+f.code]).filter(Boolean);
     const withSubsector=records.filter(x=>Object.keys(x.sectors).length>0).length;
     years[year]={categoriesWithNationalTotal:records.length,
       categoriesWithReportedSubsector:withSubsector,
       reportedSubsectorCells:records.reduce((s,x)=>s+Object.keys(x.sectors).length,0)};
   }
   sweep[country.code]=years;
 }
 return {schema:1,provider:'Eurostat',dataset:EUROSTAT_DATASET,unit:'MIO_EUR',
   sectorScope:'unconsolidated reporting subsectors (not budget authority)',
   sourceUrl:sectorSourceUrl(),fetchedAt,years:[2021,2022,2023,2024],
   entries,sweep,
   methodologicalWarning:'ESA 2010 transfers are consolidated in S13. Summing sector totals may exceed S13. An institution recording spending does not necessarily control it.'};
}
export function validateSectorSpending(data){
 if(data?.schema!==1||data?.provider!=='Eurostat'||data.dataset!==EUROSTAT_DATASET||
   data.unit!=='MIO_EUR'||!data.entries||!data.sweep||
   !Array.isArray(data.years)||!data.sourceUrl?.startsWith(EUROSTAT_API))
   throw Error('Unknown sector-spending source or format');
 if(Object.keys(data.sweep).length!==COUNTRIES.length)throw Error('27-country sweep absent');
 for(const country of COUNTRIES){
   if(!data.sweep[country.code])throw Error('Country missing from sweep: '+country.code);
 }
 for(const [key,rec] of Object.entries(data.entries)){
   if(!knownCountries.has(rec.country)||!knownFunctions.has(rec.code)||
      !data.years.includes(rec.year)||key!==rec.country+'-'+rec.year+'-'+rec.code||
      !Number.isFinite(rec.s13EurMillion)||rec.s13EurMillion<0)
       throw Error('Invalid sector reporting entry: '+key);
   for(const [sector,observation] of Object.entries(rec.sectors)){
     if(!SECTORS.some(s=>s.code===sector)||!Number.isFinite(observation.eurMillion)||
       observation.eurMillion<0||typeof observation.flags!=='string')
       throw Error('Invalid reported institutional expenditure: '+key+', '+sector);
   }
 }
 // Check coverage summary against actual entries; no empty records replaced by zeros.
 for(const country of COUNTRIES){
   for(const year of data.years){
     const values=FUNCTIONS.map(f=>data.entries[country.code+'-'+year+'-'+f.code]).filter(Boolean);
     const scanned=data.sweep[country.code][year];
     if(!scanned||scanned.categoriesWithNationalTotal!==values.length||
       scanned.categoriesWithReportedSubsector!==values.filter(x=>Object.keys(x.sectors).length).length||
       scanned.reportedSubsectorCells!==values.reduce((a,x)=>a+Object.keys(x.sectors).length,0))
       throw Error('Sector sweep mismatch: '+country.code+' '+year);
   }
 }
 return data;
}
export function sectorSpendingFor(snapshot,country,year,category){
 return snapshot?.entries?.[country+'-'+year+'-'+category]??null;
}
export function sectorCoverage(snapshot,year=2024){
 return COUNTRIES.map(c=>({country:c.code,
   ...(snapshot?.sweep?.[c.code]?.[year]??{
      categoriesWithNationalTotal:0,categoriesWithReportedSubsector:0,reportedSubsectorCells:0
   })}));
}
