export const COUNTRIES = [
  {code:'AT',name:'Austria',currency:'EUR'},
  {code:'BE',name:'Belgium',currency:'EUR'},
  {code:'BG',name:'Bulgaria',currency:'EUR'},
  {code:'HR',name:'Croatia',currency:'EUR'},
  {code:'CY',name:'Cyprus',currency:'EUR'},
  {code:'CZ',name:'Czechia',currency:'CZK'},
  {code:'DK',name:'Denmark',currency:'DKK'},
  {code:'EE',name:'Estonia',currency:'EUR'},
  {code:'FI',name:'Finland',currency:'EUR'},
  {code:'FR',name:'France',currency:'EUR'},
  {code:'DE',name:'Germany',currency:'EUR'},
  {code:'EL',name:'Greece',currency:'EUR'},
  {code:'HU',name:'Hungary',currency:'HUF'},
  {code:'IE',name:'Ireland',currency:'EUR'},
  {code:'IT',name:'Italy',currency:'EUR'},
  {code:'LV',name:'Latvia',currency:'EUR'},
  {code:'LT',name:'Lithuania',currency:'EUR'},
  {code:'LU',name:'Luxembourg',currency:'EUR'},
  {code:'MT',name:'Malta',currency:'EUR'},
  {code:'NL',name:'Netherlands',currency:'EUR'},
  {code:'PL',name:'Poland',currency:'PLN'},
  {code:'PT',name:'Portugal',currency:'EUR'},
  {code:'RO',name:'Romania',currency:'RON'},
  {code:'SK',name:'Slovakia',currency:'EUR'},
  {code:'SI',name:'Slovenia',currency:'EUR'},
  {code:'ES',name:'Spain',currency:'EUR'},
  {code:'SE',name:'Sweden',currency:'SEK'},
].sort((a,b)=>a.name.localeCompare(b.name));

export const FUNCTIONS = [
  {code:'GF01',label:'General public services',short:'General services',color:'#638BC0',description:'Public administration, foreign affairs, general research and public debt transactions.'},
  {code:'GF02',label:'Defence',short:'Defence',color:'#BC819A',description:'Military defence, civil defence and related activities.'},
  {code:'GF03',label:'Public order and safety',short:'Public safety',color:'#D2A06D',description:'Police, fire protection, courts and prisons.'},
  {code:'GF04',label:'Economic affairs',short:'Economic affairs',color:'#6BB7C1',description:'Transport, infrastructure, energy, industry, agriculture and other economic programmes.'},
  {code:'GF05',label:'Environmental protection',short:'Environment',color:'#85BE8D',description:'Waste management, pollution abatement and environmental conservation.'},
  {code:'GF06',label:'Housing and community amenities',short:'Housing',color:'#A1A8D0',description:'Housing development, community development and water supply.'},
  {code:'GF07',label:'Health',short:'Health',color:'#E77F86',description:'Hospitals, medical products, outpatient services and public health.'},
  {code:'GF08',label:'Recreation, culture and religion',short:'Culture',color:'#BE96D0',description:'Culture, recreational services, broadcasting, publishing and religion.'},
  {code:'GF09',label:'Education',short:'Education',color:'#E9C26C',description:'Preschool, primary, secondary and higher education and education services.'},
  {code:'GF10',label:'Social protection',short:'Social protection',color:'#79A8DF',description:'Old age, disability, unemployment, family and other social support.'},
];

export const EUROSTAT_DATASET = 'gov_10a_exp';
export const EUROSTAT_PAGE = 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table?lang=en';
export const EUROSTAT_DOI = 'https://doi.org/10.2908/gov_10a_exp';
export const EUROSTAT_API = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp';
// One source of truth for both the static data refresh and browser fallback.
export function sourceUrl() {
  const q = new URLSearchParams({freq:'A',unit:'MIO_EUR',sector:'S13',na_item:'TE',sinceTimePeriod:'2021',lang:'EN'});
  return `${EUROSTAT_API}?${q}`;
}
export function countryFlag(code) {
  const iso=code==='EL'?'GR':code;
  return [...iso].map(ch=>String.fromCodePoint(ch.charCodeAt(0)-65+127462)).join('');
}
