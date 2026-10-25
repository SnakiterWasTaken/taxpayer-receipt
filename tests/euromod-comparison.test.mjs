import test from 'node:test';
import assert from 'node:assert/strict';
import {compareCases} from '../scripts/euromod/compare_cz.mjs';
const example={provenance:{syntheticFixture:true,units:'CZK/year'},cases:[
  {id:'fixture-single',year:2024,grossAnnual:900000,observed:{incomeTaxAnnual:104160,employeeContributionsAnnual:104400}}]};
test('comparison rejects synthetic reference data by default',()=>{
  assert.throws(()=>compareCases(example),/Synthetic fixtures/);
});
test('unit-tested arithmetic comparison — synthetic, not actual EUROMOD',()=>{
  const r=compareCases(example,{allowFixture:true});assert.equal(r.pass,true);
  assert.equal(r.provider,'SYNTHETIC_TEST_FIXTURE');
});
test('detects known discrepancy',()=>{
  const mismatched=structuredClone(example);mismatched.cases[0].observed.incomeTaxAnnual=104260;
  const r=compareCases(mismatched,{allowFixture:true});assert.equal(r.pass,false);
});
test('does not accept unreviewed pretend EUROMOD data',()=>{
  const bad=structuredClone(example);bad.provenance={provider:'EUROMOD',modelVersion:'J2.54+',units:'CZK/year',reviewed:false};
  assert.throws(()=>compareCases(bad),/reviewed=true/);
});
test('monthly unit is not annual',()=>{
  const bad=structuredClone(example);bad.provenance.units='CZK/month';
  assert.throws(()=>compareCases(bad,{allowFixture:true}),/CZK per year/);
});
