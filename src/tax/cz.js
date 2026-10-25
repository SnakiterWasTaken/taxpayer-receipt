/**
 * Czechia (CZ): standard salaried employment, 12 equal-pay months, 2024–2026.
 *
 * This is an indicative full-year payroll + annual income-tax reconciliation.
 * Pure functions; no DOM, network, or personal data persistence.
 *
 * Official methodology and source URLs: docs/methodology.md.
 * Includes optional full-year household credits and annual child tax bonus.
 * Not covered: independent work (OSVČ), DPP/DPČ, partial-year reliefs,
 * non-taxable allowances, concurrent employers, minimum-health-base exceptions,
 * special employer insurance rates, or unusual employment arrangements.
 */
export const CZ_RULES = Object.freeze({
  2024: Object.freeze({averageWage:43967, monthlyHigherRate:131901, annualHigherRate:1582812, maxSocialBase:2110416, monthlyMinimumWage:18900, minimumAnnualBonusIncome:113400}),
  2025: Object.freeze({averageWage:46557, monthlyHigherRate:139671, annualHigherRate:1676052, maxSocialBase:2234736, monthlyMinimumWage:20800, minimumAnnualBonusIncome:124800}),
  2026: Object.freeze({averageWage:48967, monthlyHigherRate:146901, annualHigherRate:1762812, maxSocialBase:2350416, monthlyMinimumWage:22400, minimumAnnualBonusIncome:134400}),
});
const BASIC_CREDIT_MONTHLY=2570;
const BASIC_CREDIT_ANNUAL=30840;
const EMPLOYEE_SOCIAL_RATE=.071;
const EMPLOYER_SOCIAL_RATE=.248;
const COMBINED_HEALTH_RATE=.135;
const CHILD_CREDIT_BY_ORDER=[15204,22320,27840];
const SPOUSE_CREDIT=24840;
const DISABILITY_CREDITS={none:0,grade12:2520,grade3:5040};
const OWN_ZTP_CREDIT=16140;

/** Only full-calendar-year claims are supported. Eligibility is explicitly self-declared. */
export function normalizeCzechHousehold(household={}) {
  if(household===null||typeof household!=='object'||Array.isArray(household)) throw new RangeError('Invalid household information');
  const children=household.children??0;
  if(!Number.isInteger(children)||children<0||children>6) throw new RangeError('Choose 0–6 qualifying children claimed for all twelve months.');
  const childZtp=household.childZtp??Array(children).fill(false);
  if(!Array.isArray(childZtp)||childZtp.length!==children||childZtp.some(v=>typeof v!=='boolean')) throw new RangeError('Provide a ZTP/P selection for each claimed child.');
  const spouse=household.spouse??'none';
  if(!['none','eligible','eligible-ztp'].includes(spouse)) throw new RangeError('Invalid spouse eligibility selection.');
  const disability=household.disability??'none';
  if(!Object.hasOwn(DISABILITY_CREDITS,disability)) throw new RangeError('Invalid disability selection.');
  const ownZtp=household.ownZtp??false;
  if(typeof ownZtp!=='boolean') throw new RangeError('Invalid taxpayer ZTP/P selection.');
  return {children,childZtp:[...childZtp],spouse,disability,ownZtp};
}

/** Annual tax reconciliation: ordinary credits are nonrefundable; eligible child bonus is refundable. */
export function calculateAnnualHouseholdRelief({annualTaxBeforeCredit,grossAnnual,year,household={}}) {
  const rules=CZ_RULES[year];
  if(!rules) throw new RangeError(`Unsupported Czech tax year: ${year}`);
  if(!Number.isFinite(annualTaxBeforeCredit)||annualTaxBeforeCredit<0||!Number.isFinite(grossAnnual)||grossAnnual<0)
    throw new RangeError('Invalid annual tax or salary.');
  const selected=normalizeCzechHousehold(household);
  const childCredit=selected.childZtp.reduce((total,isZtp,index)=>total+CHILD_CREDIT_BY_ORDER[Math.min(index,2)]*(isZtp?2:1),0);
  const spouseCredit=selected.spouse==='eligible'?SPOUSE_CREDIT:selected.spouse==='eligible-ztp'?2*SPOUSE_CREDIT:0;
  const disabilityCredit=DISABILITY_CREDITS[selected.disability];
  const ztpCredit=selected.ownZtp?OWN_ZTP_CREDIT:0;
  let remaining=annualTaxBeforeCredit;
  const apply=(requested)=>{const used=Math.min(remaining,requested);remaining-=used;return used;};
  const basicTaxCredit=apply(BASIC_CREDIT_ANNUAL);
  const spouseCreditApplied=apply(spouseCredit);
  const disabilityCreditApplied=apply(disabilityCredit);
  const ztpCreditApplied=apply(ztpCredit);
  const childCreditApplied=apply(childCredit);
  const unusedChildCredit=childCredit-childCreditApplied;
  const qualifiesForAnnualBonus=grossAnnual>=rules.minimumAnnualBonusIncome;
  // CZ annual tax bonus must be at least CZK 100 (non-refundable credits cannot be paid out).
  const childTaxBonus=qualifiesForAnnualBonus&&unusedChildCredit>=100?unusedChildCredit:0;
  return {
    household:selected,incomeTax:remaining,childTaxBonus,
    basicTaxCredit,spouseCreditApplied,disabilityCreditApplied,ztpCreditApplied,childCreditApplied,
    claimedCredits:{basic:BASIC_CREDIT_ANNUAL,spouse:spouseCredit,disability:disabilityCredit,ztp:ztpCredit,children:childCredit},
    qualifiesForAnnualBonus,minimumAnnualBonusIncome:rules.minimumAnnualBonusIncome,
  };
}


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
 * Household claims apply full-year credits and a possible annual child bonus.
 */
export function calculateCzechEmployee({grossAnnual,year,household={}}) {
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
  const relief=calculateAnnualHouseholdRelief({annualTaxBeforeCredit,grossAnnual,year,household});
  const incomeTax=relief.incomeTax;
  const totalEmployee=incomeTax+employeeSocial+employeeHealth;
  const totalEmployer=employerSocial+employerHealth;
  return {
    country:'CZ',year,grossAnnual,annualTaxBase,
    incomeTax,annualTaxBeforeCredit,basicTaxCredit:relief.basicTaxCredit,
    household:relief.household,householdCreditsApplied:{
      spouse:relief.spouseCreditApplied,disability:relief.disabilityCreditApplied,
      ztp:relief.ztpCreditApplied,children:relief.childCreditApplied,
    },claimedCredits:relief.claimedCredits,childTaxBonus:relief.childTaxBonus,
    qualifiesForAnnualBonus:relief.qualifiesForAnnualBonus,
    monthlyIncomeTaxAdvances,
    // Assumes no household relief was already taken on monthly payslips.
    annualSettlementAdjustment:incomeTax-relief.childTaxBonus-monthlyIncomeTaxAdvances,
    employeeSocial,employeeHealth,employerSocial,employerHealth,
    totalEmployee,netAnnual:grossAnnual-totalEmployee+relief.childTaxBonus,
    netMonthlyAverage:(grossAnnual-totalEmployee+relief.childTaxBonus)/12,
    estimatedEmployerCost:grossAnnual+totalEmployer,
    effectiveEmployeeRate:totalEmployee/grossAnnual,
    annualHigherRate:rules.annualHigherRate,
    maxSocialBase:rules.maxSocialBase,
    assumptions:['12 monthly pay periods with even salary','one standard employer','full-year household eligibility for selected credits','annual settlement estimate; monthly advance assumes basic taxpayer credit only','no partial-year credits, deductions or nonstandard health-insurance conditions'],
  };
}
