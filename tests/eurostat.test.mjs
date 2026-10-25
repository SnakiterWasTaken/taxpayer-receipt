import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeJsonStat,normalizeEurostat,validateSnapshot,allocate,availableYears} from '../src/eurostat.js';
import {COUNTRIES,FUNCTIONS,countryFlag,sourceUrl} from '../src/config.js';

/** Synthetic fixture: values are deliberately invented solely for UNIT TESTING;
 * they must never be rendered as real government data or shipped as a snapshot.
 */
function fixture({drop=null,discrepancy=0,flags=false}={}) {
  const codes=['TOTAL',...FUNCTIONS.map(x=>x.code)];
  const values={};const status={};
  const fValue=Array(10).fill(10);
  // id order intentionally unconventional to test correct JSON-stat decoding.
  for(let g=0;g<2;g++) for(let y=0;y<2;y++) for(let c=0;c<11;c++){
    const key=(g*2+y)*11+c;
    if(drop===codes[c]&&g===0&&y===1)continue;
    values[key]=c===0?100+discrepancy:fValue[c-1];
    if(flags&&g===0&&y===1&&c===1)status[key]='p';
  }
  return {id:['geo','time','cofog99','freq','unit','sector','na_item'],size:[2,2,11,1,1,1,1],value:values,status,dimension:{
    geo:{category:{index:{CZ:0,FR:1}}},time:{category:{index:{'2023':0,'2024':1}}},
    cofog99:{category:{index:Object.fromEntries(codes.map((code,i)=>[code,i]))}},
    freq:{category:{index:{A:0}}},unit:{category:{index:{MIO_EUR:0}}},sector:{category:{index:{S13:0}}},na_item:{category:{index:{TE:0}}}
  }};
}

test('EU member list is exactly 27 unique identifiers',()=>{
 assert.equal(COUNTRIES.length,27);assert.equal(new Set(COUNTRIES.map(c=>c.code)).size,27);
 assert.equal(countryFlag('EL'),'🇬🇷');
});
test('Eurostat API query uses general government, spending, millions EUR',()=>{
 const u=new URL(sourceUrl());assert.equal(u.searchParams.get('sector'),'S13');assert.equal(u.searchParams.get('na_item'),'TE');assert.equal(u.searchParams.get('unit'),'MIO_EUR');
});
test('JSON-stat parser respects arbitrary dimension order',()=>{
 const r=decodeJsonStat(fixture());
 assert.equal(r.length,44);
 assert.deepEqual(r.find(x=>x.geo==='FR'&&x.time==='2024'&&x.cofog99==='GF07')?.value,10);
});
test('Normalizer reconciles valid years and percentages',()=>{
 const x=validateSnapshot(normalizeEurostat(fixture(),'2026-10-25T00:00:00Z'));
 assert.equal(Object.keys(x.entries).length,4);
 assert.equal(x.entries['CZ-2024'].categories.length,10);
 assert.equal(x.entries['FR-2024'].eurMillion,100);
 assert.equal(availableYears(x,'CZ')[0],2024);
 assert.equal(allocate(x,'CZ',2024,1000).reduce((a,c)=>a+c.allocated,0),1000);
});
test('Do not silently convert missing category into zero',()=>{
 const x=normalizeEurostat(fixture({drop:'GF07'}));
 assert.equal(x.entries['CZ-2024'],undefined);
 assert.match(x.skipped[0].reason,/GF07/);
});
test('Do not accept mismatched reported total',()=>{
 const x=normalizeEurostat(fixture({discrepancy:20}));
 assert.equal(Object.keys(x.entries).length,0);
 assert.throws(()=>validateSnapshot(x),/no complete/i);
});
test('Preserve provisional flags',()=>{
 const x=normalizeEurostat(fixture({flags:true}));
 assert.deepEqual(x.entries['CZ-2024'].flags,['p']);
});
test('Reject invalid input, not negative or nonfinite tax amounts',()=>{
 const x=normalizeEurostat(fixture());
 assert.throws(()=>allocate(x,'CZ',2024,-1),/nonnegative/);
 assert.throws(()=>allocate(x,'CZ',2024,NaN),/nonnegative/);
 assert.throws(()=>allocate(x,'CZ',2025,100),/No complete/);
});
