/**
 * Human-facing explanation of the inflation-adjusted household income INDEX.
 * Do not mistake this for euros, median income, or PPS country comparisons.
 */
export function explainIncomeIndex(value){
 if(!Number.isFinite(value)||value<0)return 'Not available — no official value was reported for this country and year.';
 const difference=value-100;
 if(Math.abs(difference)<0.05)return 'About the same as this country’s 2008 inflation-adjusted average income per person.';
 return Math.abs(difference).toFixed(1)+'% '+(difference>0?'higher':'lower')+
   ' than this country’s 2008 level, after adjusting for prices.';
}
