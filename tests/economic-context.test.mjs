import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeEconomicContext,validateEconomicContext,economicGrowth,cumulativeInflation,economicForYear,NO_NATIONAL_MINIMUM_WAGE,ECONOMIC_SOURCES} from '../src/economic-context.js';
function cube(dim,values){
 const id=Object.keys(dim),size=id.map(k=>dim[k].length);
 return {id,size,value:Object.fromEntries(Object.entries(values)),
 dimension:Object.fromEntries(id.map(k=>[k,{category:{index:Object.fromEntries(dim[k].map((x,i)=>[x,i]))}}]))};
}
function fixture(){
 return {
  inflation:cube({geo:['CZ','FR'],time:['2023','2024'],freq:['A'],unit:['RCH_A_AVG'],coicop18:['TOTAL']},{0:12,1:3,2:4,3:2}),
  minimumWage:cube({geo:['CZ','FR'],time:['2023-S1','2024-S1'],freq:['S'],currency:['NAC']},{0:17300,1:18900,2:1709,3:1766}),
  disposableIncome:cube({geo:['CZ','FR'],time:['2023','2024'],freq:['A'],unit:['CP_MNAC']},{0:111,1:113,2:115,3:116}),
 };
}
test('Official source URLs and years are documented',()=>{
 for(const s of Object.values(ECONOMIC_SOURCES)){const u=new URL(s.url);assert.match(u.hostname,/eurostat/);assert.equal(u.searchParams.get('sinceTimePeriod'),'2021');}
});
test('Distinct measurement units are not mixed',()=>{
 const x=validateEconomicContext(normalizeEconomicContext(fixture()));
 assert.equal(x.series.CZ[2024].inflation,3);assert.equal(x.series.CZ[2024].minimumWage,18900);
 assert.equal(x.series.FR[2024].disposableIncomeIndex,116);assert.equal(x.counts.inflation,4);
});
test('Nominal growth and cumulative inflation are not summed',()=>{
 const x=normalizeEconomicContext(fixture());
 assert.ok(Math.abs(economicGrowth(18900,17300)-9.248554913294805)<.001);
 assert.equal(economicGrowth(12,0),null);
 assert.ok(Math.abs(cumulativeInflation(x,'CZ',2023,2024)-3)<1e-12);
 assert.equal(cumulativeInflation(x,'CZ',2022,2024),null);
});
test('Missing minimum wages never become zero',()=>{
 const raw=fixture();delete raw.minimumWage;const x=normalizeEconomicContext(raw);
 assert.equal(economicForYear(x,'CZ',2024).minimumWage,undefined);
 assert.deepEqual(NO_NATIONAL_MINIMUM_WAGE,['AT','DK','FI','IT','SE']);
});
test('Corrupted economic numbers fail closed',()=>{
 const x=normalizeEconomicContext(fixture());x.series.CZ[2024].inflation=NaN;
 assert.throws(()=>validateEconomicContext(x),/Invalid economic value/);
});
test('No manufactured country or year rows',()=>{
 const x=normalizeEconomicContext(fixture());
 assert.equal(x.series.DE,undefined);assert.equal(x.series.CZ[2025],undefined);
});
