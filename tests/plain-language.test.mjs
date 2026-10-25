import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {explainIncomeIndex} from '../src/plain-language.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const glossary=readFileSync(new URL('../docs/glossary.html',import.meta.url),'utf8');

test('An index of 120 means 20 percent more real income than own 2008 baseline, not euros',()=>{
 assert.match(explainIncomeIndex(120),/20\.0% higher.*2008/);
 assert.match(explainIncomeIndex(95),/5\.0% lower.*2008/);
 assert.doesNotMatch(explainIncomeIndex(120),/€|EUR|PPS/);
});
test('Index 100 means the baseline and missing observations are not silently interpreted as zero',()=>{
 assert.match(explainIncomeIndex(100),/same.*2008/);
 assert.match(explainIncomeIndex(null),/Not available/);
 assert.match(explainIncomeIndex(Number.NaN),/Not available/);
});
test('Every technical metric panel gives a nearby short explanation and a glossary link',()=>{
 assert.match(html,/id="income-index-explainer"/);
 assert.match(html,/2008 is set to 100/);
 assert.match(html,/href="\.\/docs\/glossary\.html#household-income-index"/);
 assert.match(html,/href="\.\/docs\/glossary\.html#inflation"/);
 assert.match(html,/href="\.\/docs\/glossary\.html#minimum-wage"/);
});
test('Income index and PPS, real and nominal terminology are defined in the shared glossary',()=>{
 for(const id of ['household-income-index','real-vs-nominal','inflation','minimum-wage','cofog',
 'general-government','pensions','gross-net','fiscal-year','flags','pps','evidence']){
   assert.match(glossary,new RegExp('id="'+id+'"'));
 }
 assert.match(glossary,/not the median household/);
 assert.match(glossary,/not euros or monthly salaries/);
 assert.match(glossary,/not.*PPS/);
});
