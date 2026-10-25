import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCzechEmployee, calculateAnnualHouseholdRelief, normalizeCzechHousehold, CZ_RULES } from '../src/tax/cz.js';

const tax=(year, household={},grossAnnual=900000)=>calculateCzechEmployee({year,grossAnnual,household});

test('all three supported tax years retain statutory child and household credit amounts',()=>{
  for(const year of [2024,2025,2026]){
    const base=tax(year);
    assert.equal(base.incomeTax,104160);
    assert.equal(tax(year,{children:1}).incomeTax,88956);
    assert.equal(tax(year,{children:2}).incomeTax,66636);
    assert.equal(tax(year,{children:3}).incomeTax,38796);
    assert.equal(tax(year,{children:4}).incomeTax,10956);
    assert.equal(tax(year,{spouse:'eligible'}).incomeTax,79320);
    assert.equal(tax(year,{spouse:'eligible-ztp'}).incomeTax,54480);
    assert.equal(tax(year,{disability:'grade12'}).incomeTax,101640);
    assert.equal(tax(year,{disability:'grade3'}).incomeTax,99120);
    assert.equal(tax(year,{ownZtp:true}).incomeTax,88020);
  }
});

test('child with ZTP/P doubles the appropriate ordered child amount',()=>{
  assert.equal(tax(2024,{children:2,childZtp:[true,false]}).claimedCredits.children,30408+22320);
  assert.equal(tax(2024,{children:2,childZtp:[false,true]}).claimedCredits.children,15204+44640);
  assert.equal(tax(2024,{children:4,childZtp:[false,false,true,false]}).claimedCredits.children,15204+22320+55680+27840);
});

test('nonrefundable spouse and disability credits cannot turn income tax negative',()=>{
  const r=tax(2024,{spouse:'eligible-ztp',disability:'grade3',ownZtp:true},226800);
  assert.equal(r.incomeTax,0);
  assert.equal(r.childTaxBonus,0);
  assert.equal(r.householdCreditsApplied.spouse,3180); // basic taxpayer credit leaves only 3,180
  assert.equal(r.householdCreditsApplied.disability,0);
  assert.equal(r.householdCreditsApplied.ztp,0);
});

test('annual child bonus is refundable and increases take-home pay without reducing social or health insurance',()=>{
  const baseline=tax(2024,{},226800);
  const child=tax(2024,{children:1},226800);
  assert.equal(baseline.incomeTax,3180);
  assert.equal(child.incomeTax,0);
  assert.equal(child.childTaxBonus,12024);
  assert.equal(child.householdCreditsApplied.children,3180);
  assert.equal(child.netAnnual,226800-child.employeeSocial-child.employeeHealth+12024);
  assert.equal(child.employeeSocial,baseline.employeeSocial);
  assert.equal(child.employeeHealth,baseline.employeeHealth);
  assert.equal(child.totalEmployee,child.employeeSocial+child.employeeHealth);
});

test('multiple children may create child bonus despite high salary; bonus is not a negative income tax',()=>{
  const r=tax(2024,{children:5});
  assert.equal(r.incomeTax,0);
  assert.equal(r.childTaxBonus,16884);
  assert.equal(r.claimedCredits.children,121044);
  assert.equal(r.householdCreditsApplied.children,104160);
  assert.equal(r.totalEmployee,r.employeeSocial+r.employeeHealth);
});

test('full-year annual child bonus threshold is distinct from income tax credit eligibility',()=>{
  for(const [year, threshold] of [[2024,113400],[2025,124800],[2026,134400]]){
    assert.equal(CZ_RULES[year].minimumAnnualBonusIncome,threshold);
    let r=calculateAnnualHouseholdRelief({annualTaxBeforeCredit:0,grossAnnual:threshold-1,year,household:{children:1}});
    assert.equal(r.incomeTax,0);assert.equal(r.childTaxBonus,0);
    r=calculateAnnualHouseholdRelief({annualTaxBeforeCredit:0,grossAnnual:threshold,year,household:{children:1}});
    assert.equal(r.childTaxBonus,15204);
  }
});

test('annual refundable child bonus below 100 CZK is not paid',()=>{
  const r=calculateAnnualHouseholdRelief({annualTaxBeforeCredit:30840+15204-99,grossAnnual:600000,year:2025,household:{children:1}});
  assert.equal(r.childTaxBonus,0);
  assert.equal(r.incomeTax,0);
});

test('spouse and child claims remain independent (other parent may claim child tax relief)',()=>{
  const r=tax(2024,{spouse:'eligible',children:0});
  assert.equal(r.householdCreditsApplied.spouse,24840);
  assert.equal(r.claimedCredits.children,0);
});

test('invalid household data rejected rather than silently substituted',()=>{
  for(const household of [
    {children:-1},{children:7},{children:1.5},{children:1,childZtp:[true,true]},
    {children:2,childZtp:[false,1]},{spouse:'married'},
    {disability:'unknown'},{ownZtp:'yes'},null,
  ])assert.throws(()=>tax(2024,household),/Invalid|Choose|ZTP\/P/);
  assert.deepEqual(normalizeCzechHousehold({children:2}).childZtp,[false,false]);
});

test('household objects are not mutated, and default result retains original single-worker figures',()=>{
  const h={children:2,childZtp:[true,false],spouse:'eligible'};
  const before=JSON.stringify(h);tax(2025,h);assert.equal(JSON.stringify(h),before);
  const r=tax(2024);assert.equal(r.incomeTax,104160);assert.equal(r.totalEmployee,208560);
  assert.equal(r.childTaxBonus,0);assert.equal(r.netAnnual,691440);
});
