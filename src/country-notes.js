/** Reviewed, jurisdiction-scoped context: never used to change COFOG totals.
 * Stable IDs permit future localisation independently of selected country.
 */
export const COUNTRY_NOTES=Object.freeze({
 CZ:Object.freeze([Object.freeze({
  "id": "cz-employee-tax-2024-2026",
  "country": "CZ",
  "topic": "employee-tax-model",
  "sourceYears": [
    2024,
    2025,
    2026
  ],
  "sourcePeriod": "Czech employee tax years 2024–2026",
  "status": "Employee salary and household tax estimator (2024–2026)",
  "title": "Employee tax rules, household reliefs and payroll assumptions",
  "summary": "The full-year Czech employee calculator uses 15%/23% income-tax bands and a basic annual taxpayer credit of CZK 30,840. Employee social insurance is 7.1%, and employee health insurance is approximately 4.5%. Employer contributions are presented separately. The estimator assumes one employer and 12 evenly distributed monthly wages.",
  "details": [
    {
      "title": "Income tax and statutory contributions",
      "body": "The annual taxable base is rounded down to a multiple of CZK 100, whereas monthly tax advances have different rounding. Standard employer social insurance is 24.8%, and employer health insurance approximately 9%. The annual 23% bracket threshold, social-insurance cap and tax bonus eligibility threshold are specific to each tax year and are shown below."
    },
    {
      "title": "Dependent children",
      "body": "Annual tax reliefs are CZK 15,204 for the first child, CZK 22,320 for the second and CZK 27,840 for each third or later child. A qualifying ZTP/P card doubles that child’s relief. Parents cannot claim the same child for the same period."
    },
    {
      "title": "Spouse and disability eligibility",
      "body": "Eligible spouse/registered partner relief is CZK 24,840 per year (CZK 49,680 with spouse ZTP/P), requiring cohabitation with a dependent child under three and the spouse’s own annual income no greater than CZK 68,000. Disability grades I/II and III allow CZK 2,520 and CZK 5,040 annual credits; eligible taxpayer ZTP/P adds CZK 16,140."
    },
    {
      "title": "Refundable child bonus",
      "body": "Unused child credit may become a refundable annual bonus when qualifying income reaches six times the applicable monthly minimum wage and the annual bonus is at least CZK 100. Other tax credits are nonrefundable. The child bonus increases net take-home pay and is not counted as a positive tax contribution."
    },
    {
      "title": "Model limitations",
      "body": "Claims and eligibility are assumed to last all 12 months. Partial-year births or other changes, split child claims, part-time employment, multiple employers, OSVČ, DPP/DPČ, exceptional income, special health insurance conditions, itemised deductions and special nonresident circumstances are not modelled. Results are estimates, not tax advice."
    }
  ],
  "caveat": "Tax-year and Eurostat expenditure-year selections are independent; their rules and expenditure figures must not be conflated. The user self-declares household eligibility.",
  "sources": [
    {
      "label": "Czech Financial Administration — employment income tax",
      "url": "https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/zamestnanci-zamestnavatele/obecne-informace"
    },
    {
      "label": "Czech Social Security Administration — assessment cap",
      "url": "https://www.cssz.gov.cz/maximalni-vymerovaci-zaklad"
    },
    {
      "label": "VZP — employee health contributions",
      "url": "https://www.vzp.cz/platci/informace/zamestnavatel/vymerovaci-zaklad-a-vypocet-pojistneho"
    }
  ]
})]),
 FR:Object.freeze([Object.freeze({
   id:'fr-cas-pensions-plf-2027',
   country:'FR',
   topic:'pension-financing',
   sourceYear:2027,
   sourcePeriod:'Draft 2027 state budget (PLF 2027)',
   status:'Planned budget — not final expenditure',
   title:'Civil-service pension financing inside ministry budgets',
   summary:'The French draft 2027 pensions annex assigns €28.5 billion (32%) of the Education Ministry’s planned credits to the CAS Pensions account: €25.1 billion of employer contributions and €3.4 billion of employee contributions. These are pension-financing flows in a ministry budget, not additional sums to add to Eurostat pension spending.',
   caveat:'The Institut des politiques publiques disputes aspects of this accounting convention. These 2027 ministry-budget figures are not comparable directly with a different selected Eurostat COFOG expenditure year, nor are they a share of all French public spending.',
   detailPage:'./docs/countries/fr-pensions.html',
   sources:Object.freeze([
     Object.freeze({label:'French government: PLF 2027 pensions annex',url:'https://www.budget.gouv.fr/documentation/file-download/34465'}),
     Object.freeze({label:'IPP: independent 2025 analysis',url:'https://www.ipp.eu/publication/retraites-des-fonctionnaires-detat-faut-il-changer-la-convention-comptable/'}),
   ]),
 })]),
});
export function countryNotesFor(country){return COUNTRY_NOTES[country]??[]}
export function notePeriodDescription(note,selectedYear,selectedTaxYear=null){
 const source='Source period: '+note.sourcePeriod;
 if(Array.isArray(note.sourceYears))return source+'; selected tax year: '+
   (note.sourceYears.includes(selectedTaxYear)?selectedTaxYear:'not selected')+
   '; Eurostat spending year: '+selectedYear+' — independently selected years';
 return Number.isInteger(selectedYear)&&note.sourceYear!==selectedYear
  ?source+'; selected expenditure year: '+selectedYear+' — not the same reporting year'
  :source+' — ministry budget financing, not Eurostat COFOG';
}
