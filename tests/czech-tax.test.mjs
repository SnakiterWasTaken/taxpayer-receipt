import test from 'node:test';
import assert from 'node:assert/strict';
import {CZ_RULES,monthlyAdvanceBeforeCredit,calculateCzechEmployee,progressiveIncomeTax} from '../src/tax/cz.js';

const calc=(grossAnnual,year=2024)=>calculateCzechEmployee({grossAnnual,year});

test('2024 Financial Administration worked example: 165,615 Kč monthly -> 27,559 Kč advance before credit',()=>{
  assert.equal(monthlyAdvanceBeforeCredit(165615,2024),27559);
});
test('all tax bands and caps equal official year-specific constants',()=>{
  assert.deepEqual(Object.values(CZ_RULES).map(r=>r.annualHigherRate),[1582812,1676052,1762812]);
  assert.deepEqual(Object.values(CZ_RULES).map(r=>r.maxSocialBase),[2110416,2234736,2350416]);
  for(const r of Object.values(CZ_RULES)) {
    assert.equal(r.monthlyHigherRate,r.averageWage*3);
    assert.equal(r.annualHigherRate,r.averageWage*36);
    assert.equal(r.maxSocialBase,r.averageWage*48);
  }
});
test('CZ 2024 salary 75,000/month: annual income tax, employee deductions, employer side all reconcile',()=>{
  const x=calc(900000);
  assert.equal(x.incomeTax,104160);
  assert.equal(x.employeeSocial,63900);
  assert.equal(x.employeeHealth,40500);
  assert.equal(x.totalEmployee,208560);
  assert.equal(x.netAnnual,691440);
  assert.equal(x.estimatedEmployerCost,1204200);
});
test('2025 and 2026 remain under 23% bracket for 900,000 CZK',()=>{
  for(const y of [2025,2026]) assert.equal(calc(900000,y).incomeTax,104160);
});
test('annual high-rate tax applies only to income above each tax-year threshold',()=>{
  for(const [year,r] of Object.entries(CZ_RULES)) {
    const gross=r.annualHigherRate+50000;
    const x=calc(gross,Number(year));
    const rounded=Math.floor(gross/100)*100;
    const expected=Math.ceil(r.annualHigherRate*.15+(rounded-r.annualHigherRate)*.23-1e-9)-30840;
    assert.equal(x.incomeTax,expected);
  }
});
test('Social insurance contributions stop at their yearly maximum base, health insurance does not',()=>{
  const x=calc(3600000,2026);
  const smaller=calc(2400000,2026);
  assert.equal(x.employeeSocial,smaller.employeeSocial);
  assert.ok(x.employeeHealth>smaller.employeeHealth);
  assert.equal(x.incomeTax>smaller.incomeTax,true);
});
test('basic taxpayer credit cannot reduce tax below zero',()=>{
  for(const y of [2024,2025,2026]) {
    const x=calc(CZ_RULES[y].monthlyMinimumWage*12,y);
    assert.ok(x.incomeTax>=0);
    assert.equal(x.annualTaxBeforeCredit-x.basicTaxCredit,x.incomeTax);
  }
});
test('monthly advances differ from annually reconciled income tax; reconciliation remains explicit',()=>{
  const x=calc(165615*12,2024);
  assert.equal(x.monthlyIncomeTaxAdvances,12*(27559-2570));
  assert.equal(x.monthlyIncomeTaxAdvances+x.annualSettlementAdjustment,x.incomeTax);
});
test('rounding and distribution preserve annual gross with non-divisible-by-12 wages',()=>{
  const x=calc(900001);
  assert.equal(x.netAnnual+x.totalEmployee,x.grossAnnual);
  assert.equal(x.estimatedEmployerCost-x.grossAnnual,x.employerHealth+x.employerSocial);
});
test('tax model refuses unsupported low-income, partial-year and invalid scenarios rather than silently omitting health minima',()=>{
  assert.throws(()=>calc(180000,2026),/full-time model/);
  assert.throws(()=>calc(-1),/positive whole/);
  assert.throws(()=>calc(12.5),/positive whole/);
  assert.throws(()=>calc(Number.POSITIVE_INFINITY),/positive whole/);
  assert.throws(()=>calc(900000,2023),/Unsupported/);
  assert.throws(()=>monthlyAdvanceBeforeCredit(-3,2024),/Invalid/);
  assert.throws(()=>progressiveIncomeTax(-1,120),/Invalid/);
});
