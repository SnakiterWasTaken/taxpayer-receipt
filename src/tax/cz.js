/**
 * Czechia (CZ): standard salaried employment, 12 equal-pay months, 2024–2026.
 *
 * This is an indicative full-year payroll + annual income-tax reconciliation.
 * Pure functions; no DOM, network, or personal data persistence.
 *
 * Official methodology and source URLs: docs/methodology.md.
 * Not covered: independent work (OSVČ), DPP/DPČ, additional relief/bonuses,
 * non-taxable allowances, concurrent employers, minimum-health-base exceptions,
 * special employer insurance rates, or unusual employment arrangements.
 */
export const CZ_RULES = Object.freeze({
  2024: Object.freeze({averageWage:43967, monthlyHigherRate:131901, annualHigherRate:1582812, maxSocialBase:2110416, monthlyMinimumWage:18900}),
  2025: Object.freeze({averageWage:46557, monthlyHigherRate:139671, annualHigherRate:1676052, maxSocialBase:2234736, monthlyMinimumWage:20800}),
  2026: Object.freeze({averageWage:48967, monthlyHigherRate:146901, annualHigherRate:1762812, maxSocialBase:2350416, monthlyMinimumWage:22400}),
});
const BASIC_CREDIT_MONTHLY=2570;
const BASIC_CREDIT_ANNUAL=30840;
const EMPLOYEE_SOCIAL_RATE=.071;
const EMPLOYER_SOCIAL_RATE=.248;
const COMBINED_HEALTH_RATE=.135;

/** Tax bands are calculated on the tax base already rounded as appropriate. */
export function progressiveIncomeTax(base, threshold) {
  if(!Number.isFinite(base)||base<0||!Number.isFinite(threshold)||threshold<=0) throw new RangeError('Invalid income tax base or threshold');
  return .15*Math.min(base,threshold)+.23*Math.max(0,base-threshold);
}
/** Matches the Tax Administration's 2024 worked example before personal relief. */
export function monthlyAdvanceBeforeCredit(monthlyGross,year) {
  const rules=CZ_RULES[year];
  if(!rules) throw new RangeError(`Unsupported Czech tax year: ${year}`);
  if(!Number.isFinite(monthlyGross)||monthlyGross<0) throw new RangeError('Invalid monthly gross salary');
  const taxBase=monthlyGross<=100?Math.ceil(monthlyGross):Math.ceil(monthlyGross/100)*100;
  return Math.ceil(progressiveIncomeTax(taxBase,rules.monthlyHigherRate)-1e-9);
}

/**
 * Returns annual settlement estimate and total payroll deductions for a
 * full-year, standard single-employer employee with regular gross salary.
 * The only applied tax relief is the universal basic taxpayer credit.
 */
export function calculateCzechEmployee({grossAnnual,year}) {
  const rules=CZ_RULES[year];
  if(!rules) throw new RangeError(`Unsupported Czech tax year: ${year}`);
  if(!Number.isSafeInteger(grossAnnual)||grossAnnual<=0) throw new RangeError('Enter a positive whole-CZK annual salary.');
  const minimum=rules.monthlyMinimumWage*12;
  if(grossAnnual<minimum) throw new RangeError(`This simplified full-time model requires at least ${minimum.toLocaleString('en-GB')} CZK annually for ${year}. Part-time work and minimum-health contribution exceptions are not modelled.`);
  // Evenly distribute the entered annual amount across 12 whole-CZK pay slips.
  const each=Math.floor(grossAnnual/12);
  const extra=grossAnnual%12;
  let employeeSocial=0,employeeHealth=0,employerSocial=0,employerHealth=0;
  let monthlyIncomeTaxAdvances=0,priorSocialBase=0;
  for(let m=0;m<12;m++) {
    const gross=each+(m<extra?1:0);
    const socialBase=Math.min(gross,Math.max(0,rules.maxSocialBase-priorSocialBase));
    priorSocialBase+=socialBase;
    employeeSocial+=Math.ceil(socialBase*EMPLOYEE_SOCIAL_RATE-1e-9);
    employerSocial+=Math.ceil(socialBase*EMPLOYER_SOCIAL_RATE-1e-9);
    // VZP: 13.5% combined, rounded UP to a whole koruna; one third employee.
    const totalHealth=Math.ceil(gross*COMBINED_HEALTH_RATE-1e-9);
    const healthEmployee=Math.ceil(totalHealth/3);
    employeeHealth+=healthEmployee;
    employerHealth+=totalHealth-healthEmployee;
    monthlyIncomeTaxAdvances+=Math.max(0,monthlyAdvanceBeforeCredit(gross,year)-BASIC_CREDIT_MONTHLY);
  }
  // Annual income tax assessment uses CZK 100 rounding DOWN and the 36x band.
  const annualTaxBase=Math.floor(grossAnnual/100)*100;
  const annualTaxBeforeCredit=Math.ceil(progressiveIncomeTax(annualTaxBase,rules.annualHigherRate)-1e-9);
  const incomeTax=Math.max(0,annualTaxBeforeCredit-BASIC_CREDIT_ANNUAL);
  const totalEmployee=incomeTax+employeeSocial+employeeHealth;
  const totalEmployer=employerSocial+employerHealth;
  return {
    country:'CZ',year,grossAnnual,annualTaxBase,
    incomeTax,annualTaxBeforeCredit,basicTaxCredit:Math.min(annualTaxBeforeCredit,BASIC_CREDIT_ANNUAL),
    monthlyIncomeTaxAdvances,annualSettlementAdjustment:incomeTax-monthlyIncomeTaxAdvances,
    employeeSocial,employeeHealth,employerSocial,employerHealth,
    totalEmployee,netAnnual:grossAnnual-totalEmployee,
    netMonthlyAverage:(grossAnnual-totalEmployee)/12,
    estimatedEmployerCost:grossAnnual+totalEmployer,
    effectiveEmployeeRate:totalEmployee/grossAnnual,
    annualHigherRate:rules.annualHigherRate,
    maxSocialBase:rules.maxSocialBase,
    assumptions:['12 monthly pay periods with even salary','one standard employer','full-year basic taxpayer credit','no special credits, deductions, child benefits or nonstandard health-insurance conditions'],
  };
}
