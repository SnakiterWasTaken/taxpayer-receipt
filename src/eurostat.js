import { COUNTRIES, FUNCTIONS, EUROSTAT_DATASET, sourceUrl } from './config.js';

const validCountries=new Set(COUNTRIES.map(x=>x.code));
const validFunctions=new Set(FUNCTIONS.map(x=>x.code));

/** Convert JSON-stat 2.0 sparse value indexes into usable typed observations.
 * Do not rely on dimension order: Eurostat can change it without notice.
 */
export function decodeJsonStat(dataset) {
  if (!Array.isArray(dataset?.id) || !Array.isArray(dataset?.size) || !dataset.dimension || !dataset.value) {
    throw new Error('Eurostat response is not a JSON-stat data cube.');
  }
  const {id,size}=dataset;
  if (id.length !== size.length || id.some(dim=>!dataset.dimension[dim]?.category?.index)) {
    throw new Error('Eurostat response has incomplete dimension metadata.');
  }
  const labels=id.map((dim,i)=>{
    const index=dataset.dimension[dim].category.index;
    if(Array.isArray(index)) return index;
    const inverted=[];
    for(const [key,pos] of Object.entries(index)) inverted[pos]=key;
    if(inverted.length!==size[i] || inverted.some(x=>x==null)) {
      throw new Error(`Invalid dimension index: ${dim}`);
    }
    return inverted;
  });
  const dimensionKeys=id.map(x=>x.toLowerCase());
  const rows=[];
  for(const [linearRaw,value] of Object.entries(dataset.value)) {
    const linear=Number(linearRaw);
    if(!Number.isSafeInteger(linear) || !Number.isFinite(value)) continue;
    let n=linear;
    const row={};
    for(let i=size.length-1;i>=0;i--) {
      const p=n%size[i];
      row[dimensionKeys[i]]=labels[i][p];
      n=Math.floor(n/size[i]);
    }
    if(n!==0) throw new Error('Eurostat cell index out of range.');
    row.value=value;
    row.status=dataset.status?.[linearRaw] ?? '';
    rows.push(row);
  }
  return rows;
}

/** Strictly validate each published set. Never turn missing categories into zeroes. */
export function normalizeEurostat(raw, fetchedAt=new Date().toISOString()) {
  const rows=decodeJsonStat(raw);
  const grouped=new Map();
  for(const row of rows) {
    const code=row.geo;
    const cofog=row.cofog99;
    const year=Number(row.time);
    if(!validCountries.has(code) || !Number.isInteger(year) || year<2021 ||
       row.freq!=='A' || row.unit!=='MIO_EUR' || row.sector!=='S13' || row.na_item!=='TE' ||
       !(validFunctions.has(cofog)||cofog==='TOTAL') || !Number.isFinite(row.value) || row.value<0) continue;
    const key=`${code}|${year}`;
    if(!grouped.has(key)) grouped.set(key,{country:code,year,records:{}});
    const rec=grouped.get(key).records;
    if(rec[cofog]) throw new Error(`Duplicate Eurostat record: ${key}, ${cofog}`);
    rec[cofog]={value:row.value,flags:String(row.status||'')};
  }
  const entries={};const skipped=[];
  for(const [,group] of grouped) {
    const missing=FUNCTIONS.filter(f=>!group.records[f.code]).map(f=>f.code);
    const reported=group.records.TOTAL?.value;
    const sum=FUNCTIONS.reduce((s,f)=>s+(group.records[f.code]?.value||0),0);
    if(missing.length || !(reported>0) || !(sum>0)) {
      skipped.push({country:group.country,year:group.year,reason:missing.length?`Missing ${missing.join(', ')}`:'Missing valid TOTAL or category sum'});
      continue;
    }
    const discrepancy=Math.abs(sum-reported)/reported;
    if(discrepancy>0.005) {
      skipped.push({country:group.country,year:group.year,reason:`COFOG categories differ from reported total by ${(100*discrepancy).toFixed(2)}%`});
      continue;
    }
    const categories=FUNCTIONS.map(f=>({code:f.code,eurMillion:group.records[f.code].value,share:group.records[f.code].value/sum,flags:group.records[f.code].flags}));
    const allFlags=[...Object.values(group.records).map(r=>r.flags)].filter(Boolean);
    entries[`${group.country}-${group.year}`]={
      country:group.country,year:group.year,eurMillion:reported,categories,
      flags:[...new Set(allFlags.flatMap(s=>s.split(' ').filter(Boolean)))],
      reconciledShare:sum/reported,
    };
  }
  return {
    schema:1,provider:'Eurostat',dataset:EUROSTAT_DATASET,license:'Eurostat free reuse with attribution',
    fetchedAt,sourceUrl:sourceUrl(),unit:'MIO_EUR',sector:'S13',naItem:'TE',
    description:'General-government expenditure shares, not individual tax receipts; country totals in million EUR.',
    entries,skipped,
  };
}

export function validateSnapshot(data) {
  if(data?.schema!==1||data?.dataset!==EUROSTAT_DATASET||!data.entries||typeof data.entries!=='object') {
    throw new Error('Unexpected spending snapshot format');
  }
  if(Object.keys(data.entries).length===0) throw new Error('Spending snapshot has no complete country-years');
  for(const [key,entry] of Object.entries(data.entries)) {
    const sum=entry.categories?.reduce((n,c)=>n+c.share,0);
    if(!entry.country || !validCountries.has(entry.country) ||
       key!==`${entry.country}-${entry.year}` ||
       entry.categories?.length!==10 ||
       entry.categories.some((c,i)=>c.code!==FUNCTIONS[i].code || c.share<0 || c.share>1) ||
       !Number.isFinite(sum) || Math.abs(sum-1)>0.00001 || !Number.isFinite(entry.eurMillion) || entry.eurMillion<=0) {
      throw new Error(`Invalid spending data: ${key}`);
    }
  }
  return data;
}

export function availableYears(snapshot, country) {
  return Object.values(snapshot.entries).filter(x=>x.country===country).map(x=>x.year).sort((a,b)=>b-a);
}
export function allocate(snapshot,country,year,amount) {
  const record=snapshot.entries[`${country}-${year}`];
  if(!record) throw new Error(`No complete spending data for ${country}, ${year}`);
  if(!Number.isFinite(amount)||amount<0) throw new Error('Amount must be a nonnegative, finite number');
  return record.categories.map((c,i)=>({...FUNCTIONS[i],share:c.share,eurMillion:c.eurMillion,flags:c.flags,allocated:amount*c.share}));
}
