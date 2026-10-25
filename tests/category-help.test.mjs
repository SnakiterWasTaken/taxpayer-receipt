import test from 'node:test';
import assert from 'node:assert/strict';
import {FUNCTIONS} from '../src/config.js';
import {CATEGORY_HELP,helpForCategory,CATEGORY_HELP_SOURCE} from '../src/category-help.js';
import {readFileSync} from 'node:fs';

test('Every official COFOG spending division has one common help explanation',()=>{
 const expected=FUNCTIONS.map(x=>x.code).sort();
 assert.deepEqual(Object.keys(CATEGORY_HELP).sort(),expected);
 assert.equal(expected.length,10);
 for(const key of expected){
  const h=helpForCategory(key);
  for(const field of ['summary','examples','not'])assert.ok(h[field].length>=25,field+' missing in '+key);
 }
});
test('COFOG common explanations never depend on a selected country or year',()=>{
 const source=readFileSync(new URL('../src/category-help.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/activeCountry|taxYear|countryNotesFor/);
 assert.match(CATEGORY_HELP_SOURCE,/oecd\.org/);
 assert.equal(helpForCategory('XYZ'),null);
});
test('Common confusion clarified: roads and hospitals do not mean general administration',()=>{
 assert.match(helpForCategory('GF04').examples,/roads/);
 assert.match(helpForCategory('GF01').not,/road repairs/);
 assert.match(helpForCategory('GF05').examples,/biodiversity/);
 assert.match(helpForCategory('GF07').examples,/Hospital/);
 assert.match(helpForCategory('GF10').examples,/Old-age/);
});
