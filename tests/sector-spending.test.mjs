import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES} from '../src/config.js';
import {normalizeSectorSpending,validateSectorSpending,sectorCoverage,sectorSpendingFor,SECTORS,sectorSourceUrl} from '../src/sector-spending.js';
function fixture(){
  // Deliberately scrambled dimension order to catch hard-coded indexing errors.
  const id=['time','sector','cofog99','geo','na_item','freq','unit'];
  const labels={time:['2024'],sector:['S1313','S13','S1311'],
    cofog99:['GF04','GF09'],geo:['CZ','FR'],na_item:['TE'],freq:['A'],unit:['MIO_EUR']};
  const size=id.map(x=>labels[x].length), value={};
  function put({country,code,sector,amount}){
    const dims={time:'2024',sector,cofog99:code,geo:country,na_item:'TE',freq:'A',unit:'MIO_EUR'};
    const index=id.reduce((pos,name,i)=>pos*size[i]+labels[name].indexOf(dims[name]),0);
    value[index]=amount;
  }
  put({country:'CZ',code:'GF04',sector:'S13',amount:100});
  put({country:'CZ',code:'GF04',sector:'S1313',amount:40});
  put({country:'CZ',code:'GF04',sector:'S1311',amount:80}); // sum 120 > consolidated 100: valid.
  put({country:'CZ',code:'GF09',sector:'S13',amount:70});
  put({country:'FR',code:'GF09',sector:'S13',amount:91}); // no sector values reported
  return {id,size,value,dimension:Object.fromEntries(id.map(name=>[name,{category:{index:
    Object.fromEntries(labels[name].map((x,i)=>[x,i]))}}]))};
}
test('Eurostat official institutional sector URL fixes transaction, unit, period and source',()=>{
 const u=new URL(sectorSourceUrl());
 assert.match(u.host,/eurostat/);
 assert.equal(u.searchParams.get('na_item'),'TE');
 assert.equal(u.searchParams.get('unit'),'MIO_EUR');
 assert.equal(u.searchParams.get('sinceTimePeriod'),'2021');
 assert.equal(u.searchParams.get('untilTimePeriod'),'2024');
});
test('A complete 27-country × 4-year scan records missing values but never invents them',()=>{
 const d=validateSectorSpending(normalizeSectorSpending(fixture(),'2026-10-25T00:00:00.000Z'));
 assert.equal(Object.keys(d.sweep).length,27);
 assert.deepEqual(d.years,[2021,2022,2023,2024]);
 assert.equal(sectorCoverage(d,2024).length,COUNTRIES.length);
 assert.equal(d.sweep.AT[2024].categoriesWithReportedSubsector,0);
 assert.equal(sectorSpendingFor(d,'AT',2024,'GF04'),null);
 assert.equal(sectorSpendingFor(d,'CZ',2023,'GF04'),null);
});
test('No false consolidation: sector amounts may exceed S13 and no control share is inferred',()=>{
 const d=validateSectorSpending(normalizeSectorSpending(fixture()));
 const c=sectorSpendingFor(d,'CZ',2024,'GF04');
 assert.equal(c.s13EurMillion,100);
 assert.equal(c.sectors.S1313.eurMillion,40);
 assert.equal(c.sectors.S1311.eurMillion,80);
 assert.equal(c.sectors.S1312,undefined);
 assert.ok(c.sectors.S1311.eurMillion+c.sectors.S1313.eurMillion>c.s13EurMillion);
 assert.doesNotMatch(JSON.stringify(c),/manager|controls|dominant/);
});
test('Missing subsector is not zero and zero explicitly reported by Eurostat remains zero',()=>{
 const raw=fixture(),dim=raw.dimension;
 const d=normalizeSectorSpending(raw);
 assert.deepEqual(sectorSpendingFor(d,'CZ',2024,'GF09').sectors,{});
 assert.equal(d.sweep.CZ[2024].categoriesWithReportedSubsector,1);
 assert.equal(SECTORS.length,4);
});
test('Tampered coverage and fake country categories are rejected',()=>{
 const d=normalizeSectorSpending(fixture());
 d.sweep.CZ[2024].reportedSubsectorCells=9;
 assert.throws(()=>validateSectorSpending(d),/mismatch/);
 const d2=normalizeSectorSpending(fixture());
 d2.entries['CZ-2024-GF04'].sectors.S1311.eurMillion=-8;
 assert.throws(()=>validateSectorSpending(d2),/Invalid reported/);
});
