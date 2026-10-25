/**
 * Official NATIONAL budget source starting points, verified individually.
 * These are not mappings from a COFOG category to the controlling ministry.
 * Absence = source not verified by this project (not proof of non-publication).
 */
export const NATIONAL_BUDGET_PORTALS=Object.freeze({
 AT:Object.freeze({label:'Federal Ministry of Finance — budget and spending downloads',url:'https://www.bmf.gv.at/services/startseite-budget.html',
   scope:'Federal budget, monthly execution and downloadable aggregates; not all general government'}),
 CZ:Object.freeze({label:'Ministry of Finance — MONITOR state and local finance',url:'https://monitor.statnipokladna.gov.cz/',
   scope:'State budget chapters and local finance; not a reconciled COFOG decision-maker table'}),
 DE:Object.freeze({label:'Federal Ministry of Finance — digital federal budget',url:'https://www.bundeshaushalt.de/DE/Bundeshaushalt-digital/bundeshaushalt-digital.htm',
   scope:'Federal spending by budget chapter; state and local budgets not included'}),
 EE:Object.freeze({label:'Ministry of Finance — State Budget and Economy',url:'https://fin.ee/en/public-finances-and-taxes/state-budget-and-economy',
   scope:'National state-budget documentation, not a general-government COFOG authority attribution'}),
 HR:Object.freeze({label:'Ministry of Finance — 2024 state budget and outturn',url:'https://mfin.gov.hr/proracun-86/drzavni-proracun-2024-godina/3504',
   scope:'Official 2024 central state budget and outturn; separate institutions may sit outside it'}),
 HU:Object.freeze({label:'National Legal Gazette — 2024 central-budget law',url:'https://njt.jog.gov.hu/jogszabaly/2023-55-00-00',
   scope:'Official central government budget law, not execution and not local government'}),
 IE:Object.freeze({label:'Government of Ireland — Where Your Money Goes (2024)',url:'https://www.whereyourmoneygoes.gov.ie/en/2024/',
   scope:'Departmental public expenditure, not a reconciled COFOG institutional crosswalk'}),
});
export function budgetPortalFor(country){return NATIONAL_BUDGET_PORTALS[country]??null;}
