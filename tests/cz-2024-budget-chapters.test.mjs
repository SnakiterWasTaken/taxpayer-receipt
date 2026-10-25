import test from 'node:test';
import assert from 'node:assert/strict';
import {CZ_2024_CHAPTERS,CZ_2024_STATE_ACCOUNT_SOURCE,
 CZ_2024_CHAPTER_TOTAL_THOUSAND_CZK,validateCzechChapters,
 czechChapterData,czechChaptersSorted} from '../src/cz-2024-budget-chapters.js';

test('2024 state-account chapter ledger contains every 48 official chapter and balances to the published state-budget total',()=>{
 const data=validateCzechChapters();
 assert.equal(data.length,48);
 assert.equal(CZ_2024_CHAPTER_TOTAL_THOUSAND_CZK,2236790777.48);
 assert.equal(data.reduce((s,c)=>s+Math.round(c.actualThousandCzk*100),0),223679077748);
 assert.equal(new Set(data.map(x=>x.id)).size,48);
});
test('Amounts are actual 2024 expenditures in thousands of CZK and carry a direct Ministry of Finance Table 7 page reference',()=>{
 assert.match(CZ_2024_STATE_ACCOUNT_SOURCE.url,/mf\.gov\.cz.*G-Tabulkova-cast\.pdf/);
 assert.equal(CZ_2024_STATE_ACCOUNT_SOURCE.amountUnit,'thousand CZK');
 assert.equal(CZ_2024_STATE_ACCOUNT_SOURCE.sourcePage,32);
 assert.equal(CZ_2024_STATE_ACCOUNT_SOURCE.year,2024);
 assert.equal(CZ_2024_CHAPTERS.find(x=>x.id===313).actualThousandCzk,949524930.50);
 assert.equal(CZ_2024_CHAPTERS.find(x=>x.id===333).actualThousandCzk,275368953.35);
 assert.equal(CZ_2024_CHAPTERS.find(x=>x.id===307).actualThousandCzk,158959365.71);
});
test('Chapter amounts are not a COFOG crosswalk, S13 consolidated total or largest discretionary manager determination',()=>{
 const json=JSON.stringify(CZ_2024_CHAPTERS);
 assert.doesNotMatch(json,/cofog|managerShare|controls|categoryShare/);
 assert.equal(czechChapterData('FR',2024),null);
 assert.equal(czechChapterData('CZ',2023),null);
 assert.equal(czechChapterData('CZ',2024).length,48);
});
test('Missing, negative, duplicated and out-of-reconciliation chapter data fail closed',()=>{
 const x=CZ_2024_CHAPTERS.map(o=>({...o}));
 x[0].actualThousandCzk=-1;
 assert.throws(()=>validateCzechChapters(x),/Invalid/);
 const y=CZ_2024_CHAPTERS.map(o=>({...o}));
 y[0].actualThousandCzk+=1;
 assert.throws(()=>validateCzechChapters(y),/do not match/);
 const z=CZ_2024_CHAPTERS.map(o=>({...o}));
 z[1].id=z[0].id;
 assert.throws(()=>validateCzechChapters(z),/Invalid/);
});
test('Sorting changes no chapter value and reveals large allocations including non-ministry treasury and state-debt chapters',()=>{
 const sorted=czechChaptersSorted();
 assert.equal(sorted[0].id,313);
 assert.ok(sorted.some(x=>x.id===398));
 assert.ok(sorted.some(x=>x.id===396));
 assert.deepEqual(sorted.map(x=>x.id).sort((a,b)=>a-b),CZ_2024_CHAPTERS.map(x=>x.id).sort((a,b)=>a-b));
});
