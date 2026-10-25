/**
 * Czech Ministry of Finance: Government Finance Statistics, 2024,
 * "TABULKA 5 – Výdaje podle funkcí vládních institucí", published
 * 2025-06-30, updated 2025-07-31, amounts in MILLIONS OF CZK.
 *
 * https://mf.gov.cz/cs/rozpoctova-politika/makroekonomika/statistika-vladniho-sektoru/2024/vladni-financni-statistika-2024-60237
 *
 * Government Finance Statistics (GFS) PUBLIC BUDGETS CASH accounting
 * is not the same methodology or denominator as Eurostat ESA2010 S13.
 * Column order is deliberately fixed to source Table 5:
 * [central budget accounts, extrabudgetary funds, social security funds,
 *  within-central elimination, net central, local budgets,
 *  central↔local elimination, consolidated public-budget function total].
 * Positive values and negative consolidation entries come from MF tables,
 * NOT user-calculated shares or inferred discretionary authority.
 * Source precision: integer MILLIONS; up to 2 million discrepancy is normal
 * due to separately rounded components.
 */
export const CZ_2024_CASH_SOURCE=Object.freeze({
 year:2024,unit:'million CZK',sourceDate:'2025-07-31',
 title:'Czech Ministry of Finance · Government Finance Statistics 2024 · Table 5',
 url:'https://mf.gov.cz/cs/rozpoctova-politika/makroekonomika/statistika-vladniho-sektoru/2024/vladni-financni-statistika-2024-60237',
 methodology:'Public budgets cash accounting (GFS), NOT Eurostat ESA 2010 S13',
});
export const CZ_2024_CASH_FUNCTIONS=Object.freeze({
  "GF01": [
    231712,
    620,
    0,
    0,
    232333,
    103754,
    -16648,
    319438
  ],
  "GF02": [
    146436,
    0,
    0,
    -27,
    146409,
    2315,
    -5,
    148719
  ],
  "GF03": [
    115835,
    0,
    0,
    0,
    115835,
    15900,
    -934,
    130801
  ],
  "GF04": [
    266708,
    225870,
    0,
    -133255,
    359323,
    157781,
    -19824,
    497280
  ],
  "GF05": [
    24285,
    5199,
    0,
    -5562,
    23923,
    52234,
    -7493,
    68664
  ],
  "GF06": [
    31690,
    1817,
    0,
    -502,
    33006,
    66461,
    -16298,
    83168
  ],
  "GF07": [
    162195,
    0,
    512031,
    -154024,
    520202,
    19413,
    -146,
    539469
  ],
  "GF08": [
    27453,
    1954,
    0,
    -1422,
    27985,
    57374,
    -2540,
    82818
  ],
  "GF09": [
    271339,
    0,
    0,
    0,
    271339,
    264321,
    -204763,
    330897
  ],
  "GF10": [
    969101,
    729,
    0,
    0,
    969830,
    47841,
    -31257,
    986414
  ]
});
export const CZ_2024_CASH_TOTALS=Object.freeze({
 beforeSaleAdjustmentMillionCzk:3187668,
 salesOfNonfinancialAssetsAdjustmentMillionCzk:-29741,
 reportedPublicBudgetsTotalMillionCzk:3157927
});
const REQUIRED_CODES=Object.freeze(['GF01','GF02','GF03','GF04','GF05','GF06','GF07','GF08','GF09','GF10']);
/** The income from non-financial asset sales is a separate (-29,741m CZK)
 * final total adjustment. Never silently treat the ten function sums as net totals. */
export function validateCzCashFunctions(records=CZ_2024_CASH_FUNCTIONS){
 if(!records||typeof records!=='object'||Object.keys(records).length!==10)
   throw Error('Expected exactly ten GFS cash expenditure functions');
 let sumFinal=0;
 for(const code of REQUIRED_CODES){
   const c=records[code];
   if(!Array.isArray(c)||c.length!==8||c.some(v=>!Number.isSafeInteger(v)))
     throw Error('Invalid reported finance statistics row: '+code);
   const [budget,extra,social,centralElimination,netCentral,local,crossElimination,netTotal]=c;
   if([budget,extra,social,netCentral,local,netTotal].some(n=>n<0)||
      centralElimination>0||crossElimination>0)
     throw Error('Invalid sign or negative amount: '+code);
   if(Math.abs(budget+extra+social+centralElimination-netCentral)>2||
      Math.abs(netCentral+local+crossElimination-netTotal)>2)
     throw Error('GFS cash-flow consolidation does not reconcile: '+code);
   sumFinal+=netTotal;
 }
 if(sumFinal!==CZ_2024_CASH_TOTALS.beforeSaleAdjustmentMillionCzk||
   sumFinal+CZ_2024_CASH_TOTALS.salesOfNonfinancialAssetsAdjustmentMillionCzk!==
      CZ_2024_CASH_TOTALS.reportedPublicBudgetsTotalMillionCzk)
     throw Error('Czech published public-budget total does not reconcile');
 return records;
}
export function czCashFunctionFor(country,year,code){
 return country==='CZ'&&year===2024&&Object.hasOwn(CZ_2024_CASH_FUNCTIONS,code)
  ?CZ_2024_CASH_FUNCTIONS[code]:null;
}
/** These are accounting columns; no function returns a largest manager. */
export function czCashReconciliation(country,year,code){
 const row=czCashFunctionFor(country,year,code);
 if(!row)return null;
 validateCzCashFunctions();
 return Object.freeze({
   stateBudgetAccountsMillionCzk:row[0],
   extraBudgetaryFundsMillionCzk:row[1],
   socialSecurityFundsMillionCzk:row[2],
   withinCentralTransfersMillionCzk:row[3],
   centralNetMillionCzk:row[4],
   localGrossMillionCzk:row[5],
   centralLocalTransfersMillionCzk:row[6],
   publicBudgetsFunctionMillionCzk:row[7],
   source:CZ_2024_CASH_SOURCE,
 });
}
