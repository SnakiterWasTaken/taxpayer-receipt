import test from 'node:test';
import assert from 'node:assert/strict';
import {spendingLeaders,observationsForCountry} from '../src/glance.js';
import {FUNCTIONS} from '../src/config.js';
import {readFileSync} from 'node:fs';

const entry={
 country:'FR',year:2024,
 categories:FUNCTIONS.map((f,i)=>({code:f.code,share:[.04,.07,.03,.08,.05,.15,.14,.07,.07,.3][i]})),
 pensionDetail:{publicShare:.24},
};
test('Plain-English leading spend categories remain sourced, sorted and rounded only for display',()=>{
 const data=spendingLeaders(entry);
 assert.deepEqual(data.map(x=>x.code),['GF10','GF06','GF07']);
 assert.equal(data[0].perHundred,30);
});
test('Top-spending categories do not invent missing observations',()=>{
 assert.deepEqual(spendingLeaders(null),[]);
 assert.deepEqual(spendingLeaders({categories:[]}),[]);
 assert.equal(spendingLeaders(entry,2).length,2);
});
test('Pension observations are never highlighted solely because detailed data are available',()=>{
 const out=observationsForCountry(entry,null,null,[]);
 assert.deepEqual(out,[], 'absence of a reviewed local debate means no topical spotlight');
 const contextual=observationsForCountry(entry,{inflation:2.3},null,[]);
 assert.ok(contextual.some(item=>item.id==='annual-inflation'));
 assert.ok(!contextual.some(item=>item.id==='old-age-share'));
});
test('Independent price and household indicators are matched by selected year and not causal',()=>{
 const out=observationsForCountry(entry,{inflation:2.3,disposableIncomeIndex:105},{disposableIncomeIndex:110},[]);
 const indicator=out.find(x=>x.id==='real-income-trend');
 assert.equal(indicator.type,'attention');
 assert.match(indicator.text,/fell 4\.5% from 2023 to 2024/);
 assert.match(indicator.text,/rose 2\.3%/);
 assert.match(indicator.qualifier,/do not describe every household or establish which policies/);
});
test('Missing economic indicators do not become reassuring ratings or zeroes',()=>{
 const x={...entry,pensionDetail:null};
 assert.deepEqual(observationsForCountry(x,null,null,[]),[]);
});
test('Country notes cite their OWN reporting year and cannot be mistaken for selected expenditure',()=>{
 const note={country:'FR',sourcePeriod:'Draft 2027 budget',sourceYear:2027};
 const out=observationsForCountry(entry,null,null,[note]);
 const v=out.find(x=>x.id==='national-accounting-note');
 assert.match(v.text,/2027/);assert.equal(v.year,2027);
});
test('General method page and national note storage remain separate',()=>{
 const method=readFileSync(new URL('../docs/methodology.html',import.meta.url),'utf8');
 assert.doesNotMatch(method,/(?:CAS Pensions|Czech employment calculator|CZK 30,840)/);
});
