import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES,FUNCTIONS} from '../src/config.js';
import {OFFICIAL_RESPONSIBILITIES,responsibilityFor,responsibilityStatus} from '../src/official-responsibilities.js';

test('Verified legal records reference only recognised EU countries and COFOG divisions',()=>{
 const countrySet=new Set(COUNTRIES.map(x=>x.code)),functions=new Set(FUNCTIONS.map(x=>x.code));
 for(const [country,items] of Object.entries(OFFICIAL_RESPONSIBILITIES)){
   assert.ok(countrySet.has(country));
   for(const [code,entry] of Object.entries(items)){
     assert.ok(functions.has(code));
     assert.equal(entry.asOfYear,2026);
     assert.ok(entry.scope.length>20);
     assert.ok(entry.limit.length>35);
     assert.ok(entry.roles.every(x=>x.label&&x.detail));
     assert.ok(entry.sources.length>0);
     assert.ok(entry.sources.every(x=>x.url.startsWith('https://')&&x.title.length>10));
   }
 }
});
test('Only reviewed Czech road/waste/primary-school examples are published, not sweeping control of the entire category',()=>{
 assert.deepEqual(Object.keys(OFFICIAL_RESPONSIBILITIES.CZ).sort(),['GF04','GF05','GF09']);
 assert.match(responsibilityFor('CZ','GF04').scope,/one part/);
 assert.match(responsibilityFor('CZ','GF05').scope,/one part/);
 assert.match(responsibilityFor('CZ','GF09').limit,/teacher salary/);
});
test('Every unreviewed country or function fails closed to a visible no-data message',()=>{
 for(const country of COUNTRIES.map(x=>x.code))
   for(const category of FUNCTIONS.map(x=>x.code)){
     const result=responsibilityStatus(country,category,2024);
     if(country==='CZ'&&['GF04','GF05','GF09'].includes(category)){
       assert.equal(result.available,true);
     }else{
       assert.equal(result.available,false);
       assert.match(result.reason,/No category-wide decision-maker verified by this project yet/);
     }
   }
});
test('No current legal responsibility is silently represented as verified for an older spending year',()=>{
 assert.match(responsibilityStatus('CZ','GF04',2024).timeNote,/2026.*2024.*not been independently checked/);
 assert.match(responsibilityStatus('CZ','GF09',2026).timeNote,/not spending-share allocations/);
});
