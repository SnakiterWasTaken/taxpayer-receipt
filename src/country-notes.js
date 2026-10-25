/** Reviewed, jurisdiction-scoped context: never used to change COFOG totals.
 * Stable IDs permit future localisation independently of selected country.
 */
export const COUNTRY_NOTES=Object.freeze({
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
export function notePeriodDescription(note,selectedYear){
 const source='Source period: '+note.sourcePeriod;
 return Number.isInteger(selectedYear)&&note.sourceYear!==selectedYear
  ?source+'; selected expenditure year: '+selectedYear+' — not the same reporting year'
  :source+' — ministry budget financing, not Eurostat COFOG';
}
