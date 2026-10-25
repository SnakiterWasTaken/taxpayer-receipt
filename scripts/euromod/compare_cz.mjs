#!/usr/bin/env node
/** Compare pre-reviewed, explicitly mapped EUROMOD results against CZ calculator.
 *
 * The official EUROMOD connector runs separately. No arbitrary variable mapping,
 * no synthetic 'EUROMOD' data, and no mismatched time units are accepted.
 */
import fs from 'node:fs';
import path from 'node:path';
import {calculateCzechEmployee} from '../../src/tax/cz.js';

export function compareCases(dataset,{allowFixture=false}={}) {
  const {provenance,cases:rows}=dataset || {};
  if (!provenance || !Array.isArray(rows) || rows.length===0) throw Error('Missing provenance or comparison cases');
  if (provenance.syntheticFixture && !allowFixture) throw Error('Synthetic fixtures cannot be presented as EUROMOD evidence');
  if (!provenance.syntheticFixture && (provenance.provider!=='EUROMOD' || provenance.reviewed!==true ||
      !/^J[0-9]+\.[0-9]+\+$/.test(provenance.modelVersion) ||
      !provenance.inputDataset || !provenance.outputMapping || !provenance.modelSha256)) {
    throw Error('Real EUROMOD comparisons need reviewed=true, model version/hash, input dataset, and explicit output mapping');
  }
  if(provenance.units!=='CZK/year') throw Error('Map monthly EUROMOD results to CZK per year BEFORE comparison');
  const output=[];
  const ids=new Set();
  for(const row of rows) {
    if(!row.id || ids.has(row.id))throw Error('Every case needs a unique id');
    ids.add(row.id);
    if(!Number.isInteger(row.year)||!Number.isInteger(row.grossAnnual))throw Error('Invalid case year or gross annual CZK');
    const r=calculateCzechEmployee({grossAnnual:row.grossAnnual,year:row.year,household:row.household||{}});
    const checks=[
      ['income_tax', r.incomeTax, row.observed?.incomeTaxAnnual],
      ['employee_contributions', r.employeeSocial+r.employeeHealth, row.observed?.employeeContributionsAnnual],
    ];
    // Only compare child bonuses when explicitly mapped to the correct EUROMOD component.
    if(Object.hasOwn(row.observed||{},'childTaxBonusAnnual'))checks.push(['child_tax_bonus',r.childTaxBonus,row.observed.childTaxBonusAnnual]);
    const results=checks.map(([key,ours,reference])=>{
      if(typeof reference!=='number'||!Number.isFinite(reference)||reference<0) throw Error(`Missing numeric observed ${key} for ${row.id}`);
      const delta=Math.round((ours-reference)*100)/100;
      const tolerance=row.toleranceCZK??24;
      if(!Number.isFinite(tolerance)||tolerance<0||tolerance>10000)throw Error('Invalid tolerance');
      return {metric:key,ourValue:ours,modelValue:reference,differenceCZK:delta,toleranceCZK:tolerance,pass:Math.abs(delta)<=tolerance};
    });
    output.push({id:row.id,year:row.year,grossAnnual:row.grossAnnual,results,pass:results.every(x=>x.pass)});
  }
  return {status:'comparison_complete_not_certification',provider:provenance.syntheticFixture?'SYNTHETIC_TEST_FIXTURE':'EUROMOD',
    provenance,caseCount:output.length,pass:output.every(x=>x.pass),comparisons:output,
    note:'Model/estimator may differ in eligibility, time units, premiums, and tax treatment. Investigate deviations before approving country rules.'};
}

function cli() {
  const args=process.argv.slice(2); const value=(flag)=>args[args.indexOf(flag)+1];
  if(!args.includes('--input'))throw Error('Usage: node scripts/euromod/compare_cz.mjs --input mapped-euromod-cases.json [--output report.json]');
  const result=compareCases(JSON.parse(fs.readFileSync(value('--input'),'utf8')),{allowFixture:args.includes('--allow-fixture')});
  const output=JSON.stringify(result,null,2)+'\n';
  if(args.includes('--output')){
    const target=value('--output'); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,output);
  } else process.stdout.write(output);
  if(!result.pass)process.exitCode=1;
}
if(process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))){
  try{cli()}catch(e){console.error(`Comparison rejected: ${e.message}`);process.exitCode=2;}
}
