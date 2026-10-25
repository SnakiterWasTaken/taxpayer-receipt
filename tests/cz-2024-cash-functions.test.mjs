import test from 'node:test';
import assert from 'node:assert/strict';
import {CZ_2024_CASH_FUNCTIONS,CZ_2024_CASH_SOURCE,CZ_2024_CASH_TOTALS,validateCzCashFunctions,czCashReconciliation} from '../src/cz-2024-cash-functions.js';
import {FUNCTIONS,COUNTRIES} from '../src/config.js';

test('Ministry 2024 functional public-budget table has exactly ten official COFOG divisions',()=>{
 const data=validateCzCashFunctions();
 assert.deepEqual(Object.keys(data).sort(),FUNCTIONS.map(x=>x.code).sort());
 assert.equal(Object.keys(data).length,10);
 assert.equal(CZ_2024_CASH_SOURCE.unit,'million CZK');
 assert.equal(CZ_2024_CASH_SOURCE.year,2024);
 assert.match(CZ_2024_CASH_SOURCE.url,/mf\.gov\.cz/);
});
test('Two levels of published transfers eliminate double counting before totals',()=>{
 const x=czCashReconciliation('CZ',2024,'GF09');
 assert.equal(x.centralNetMillionCzk,271339);
 assert.equal(x.localGrossMillionCzk,264321);
 assert.equal(x.centralLocalTransfersMillionCzk,-204763);
 assert.equal(x.publicBudgetsFunctionMillionCzk,330897);
 const health=czCashReconciliation('CZ',2024,'GF07');
 assert.equal(health.socialSecurityFundsMillionCzk,512031);
 assert.equal(health.withinCentralTransfersMillionCzk,-154024);
 assert.equal(health.publicBudgetsFunctionMillionCzk,539469);
});
test('Ten gross function totals differ from net public-budget total due to explicit asset-sale adjustment',()=>{
 const sum=Object.values(CZ_2024_CASH_FUNCTIONS).reduce((s,x)=>s+x[7],0);
 assert.equal(sum,3187668);
 assert.equal(CZ_2024_CASH_TOTALS.salesOfNonfinancialAssetsAdjustmentMillionCzk,-29741);
 assert.equal(sum+CZ_2024_CASH_TOTALS.salesOfNonfinancialAssetsAdjustmentMillionCzk,3157927);
});
test('The government accounts use integer millions and tolerate <=2m independent column rounding',()=>{
 assert.doesNotThrow(()=>validateCzCashFunctions());
 const bad=structuredClone(CZ_2024_CASH_FUNCTIONS);bad.GF04[6]=-1;
 assert.throws(()=>validateCzCashFunctions(bad),/does not reconcile/);
 const missing=structuredClone(CZ_2024_CASH_FUNCTIONS);delete missing.GF10;
 assert.throws(()=>validateCzCashFunctions(missing),/ten/);
});
test('A government-sector cash-flow reconciliation cannot be presented as named ministerial spending discretion',()=>{
 assert.equal(czCashReconciliation('CZ',2023,'GF04'),null);
 assert.equal(czCashReconciliation('FR',2024,'GF04'),null);
 assert.equal(czCashReconciliation('CZ',2024,'GFZZ'),null);
 assert.match(CZ_2024_CASH_SOURCE.methodology,/NOT Eurostat/);
 for(const c of COUNTRIES){
  if(c.code!=='CZ')assert.equal(czCashReconciliation(c.code,2024,'GF04'),null);
 }
 assert.doesNotMatch(JSON.stringify(CZ_2024_CASH_FUNCTIONS),/largestManager|managerShare|municipalCouncil/);
});
