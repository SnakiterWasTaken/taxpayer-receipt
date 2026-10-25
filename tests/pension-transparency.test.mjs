import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeEurostat,validateSnapshot} from '../src/eurostat.js';
import {pensionTransparency} from '../src/pensions.js';
import {FUNCTIONS} from '../src/config.js';
const base=[100,60,40,100,60,50,100,50,100,340];
function fixture({oldAge=250,survivors=30}={}){
  const codes=['TOTAL',...FUNCTIONS.map(x=>x.code),'GF1002','GF1003'];
  const value={};codes.forEach((x,i)=>{if(x==='GF1002'&&oldAge===null)return;if(x==='GF1003'&&survivors===null)return;
    value[i]=x==='TOTAL'?1000:x==='GF1002'?oldAge:x==='GF1003'?survivors:base[i-1];});
  return {id:['geo','time','cofog99','freq','unit','sector','na_item'],size:[1,1,codes.length,1,1,1,1],
    dimension:{geo:{category:{index:{FR:0}}},time:{category:{index:{'2024':0}}},
      cofog99:{category:{index:Object.fromEntries(codes.map((c,i)=>[c,i]))}},
      freq:{category:{index:{A:0}}},unit:{category:{index:{MIO_EUR:0}}},
      sector:{category:{index:{S13:0}}},na_item:{category:{index:{TE:0}}}},value};
}
test('COFOG GF1002 and GF1003 are children of GF10, not added to the government total',()=>{
 const snap=validateSnapshot(normalizeEurostat(fixture()));
 const e=snap.entries['FR-2024']; assert.equal(e.eurMillion,1000);assert.equal(e.categories.length,10);
 const p=pensionTransparency(e,10000);
 assert.equal(p.combinedEurMillion,280);assert.equal(p.publicShare,.28);
 assert.ok(Math.abs(p.socialShare-280/340)<1e-9);assert.ok(Math.abs(p.totalAllocated-2800)<1e-8);
 assert.equal(p.oldAgeAllocated,2500);assert.equal(p.survivorsAllocated,300);
 assert.ok(Math.abs(e.categories.reduce((s,x)=>s+x.share,0)-1)<1e-12);
});
test('Missing subgroup is not silently set to zero or approximated',()=>{
 const e=validateSnapshot(normalizeEurostat(fixture({survivors:null}))).entries['FR-2024'];
 assert.equal(e.pensionDetail,undefined);assert.equal(pensionTransparency(e,1000),null);
});
test('Invalid subgroup sum is excluded while valid top-level data survives',()=>{
 const e=validateSnapshot(normalizeEurostat(fixture({oldAge:370,survivors:30}))).entries['FR-2024'];
 assert.equal(e.pensionDetail,undefined);
});
test('Strict snapshot validation rejects injected pension values and inflated shares',()=>{
 const snap=normalizeEurostat(fixture());
 snap.entries['FR-2024'].pensionDetail.combinedEurMillion=300;
 assert.throws(()=>validateSnapshot(snap),/Invalid pension subcategories/);
});
test('Rejects invalid contribution values',()=>{
 const e=validateSnapshot(normalizeEurostat(fixture())).entries['FR-2024'];
 assert.throws(()=>pensionTransparency(e,-10),/nonnegative/);
});
