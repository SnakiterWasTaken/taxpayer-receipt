import {FUNCTIONS} from './config.js';
import {economicGrowth} from './economic-context.js';

const byCode=new Map(FUNCTIONS.map(f=>[f.code,f]));

/**
 * Source-bound, value-neutral facts for selected country and selected COFOG year.
 * No political scores, unsupported thresholds, synthetic numbers or inference of causation.
 */
export function spendingLeaders(entry,limit=3){
  if(!entry||!Array.isArray(entry.categories)||!Number.isInteger(limit)||limit<1)return [];
  return entry.categories
    .filter(x=>byCode.has(x.code)&&Number.isFinite(x.share)&&x.share>=0&&x.share<=1)
    .sort((a,b)=>b.share-a.share)
    .slice(0,limit)
    .map(x=>({code:x.code,label:byCode.get(x.code).label,share:x.share,perHundred:100*x.share}));
}

export function observationsForCountry(entry,economic,previousEconomic,notes=[]){
  if(!entry)return [];
  const observations=[];
  const growth=economicGrowth(economic?.disposableIncomeIndex,previousEconomic?.disposableIncomeIndex);
  const inflation=economic?.inflation;
  if(Number.isFinite(growth)){
    const positive=growth>=0;
    const change=Math.abs(growth).toFixed(1);
    const fact=(positive?'Real household income per person rose ':'Real household income per person fell ')+
        change+'% from '+(entry.year-1)+' to '+entry.year+'.';
    const prices=Number.isFinite(inflation)
      ?' Annual-average consumer prices '+(inflation>=0?'rose ':'fell ')+Math.abs(inflation).toFixed(1)+'%.'
      :'';
    observations.push({
      id:'real-income-trend',type:positive?'context':'attention',
      title:positive?'Household income after inflation increased':'Household income after inflation declined',
      text:fact+prices,year:entry.year,
      qualifier:'National household-income averages do not describe every household or establish which policies caused the change.',
      source:'Eurostat · real household income index and HICP',
    });
  } else if(Number.isFinite(inflation)){
    observations.push({
      id:'annual-inflation',type:'context',title:'Consumer prices',
      text:'Annual-average consumer prices '+(inflation>=0?'rose ':'fell ')+Math.abs(inflation).toFixed(1)+
        '% in '+entry.year+'.',
      qualifier:'An annual-average price change is not the same as an individual household’s inflation.',
      year:entry.year,source:'Eurostat · HICP annual average',
    });
  }
  if(notes.length){
    // The note source year is NOT silently represented as the selected spending year.
    const first=notes[0];
    observations.push({
      id:'national-accounting-note',type:'question',title:'National rules worth examining',
      text:'A documented '+first.country+' accounting or tax-methodology note is available below ('+
        first.sourcePeriod+').',
      year:first.sourceYear??null,
      qualifier:'This note may concern a different year and is not part of the international expenditure totals.',
      source:'National official sources and reviewed analyses',
    });
  }
  // Limit at-a-glance observations to avoid overwhelming readers.
  return observations.slice(0,3);
}
