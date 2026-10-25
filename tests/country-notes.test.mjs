import test from 'node:test';
import assert from 'node:assert/strict';
import {countryNotesFor,notePeriodDescription,COUNTRY_NOTES} from '../src/country-notes.js';
import {COUNTRIES} from '../src/config.js';
import {readFileSync} from 'node:fs';
test('National note registry only targets known EU countries',()=>{
 const valid=new Set(COUNTRIES.map(c=>c.code));
 for(const country of Object.keys(COUNTRY_NOTES))assert.ok(valid.has(country));
});
test('French note is visible for FR only, not globally',()=>{
 assert.equal(countryNotesFor('FR').length,1);
 for(const country of ['CZ','DE','IT','BE'])assert.deepEqual(countryNotesFor(country),[]);
});
test('Notes distinguish source and selected expenditure years',()=>{
 const note=countryNotesFor('FR')[0];
 assert.equal(note.sourceYear,2027);
 assert.match(notePeriodDescription(note,2024),/2027/);
 assert.match(notePeriodDescription(note,2024),/2024/);
 assert.match(notePeriodDescription(note,2027),/Eurostat COFOG/);
 assert.match(note.caveat,/not comparable directly/i);
});
test('Every reviewed national note has independent source citations',()=>{
 for(const notes of Object.values(COUNTRY_NOTES))for(const note of notes){
  assert.match(note.id,/^[a-z0-9-]+$/);assert.ok(note.sources.length>=1);
  assert.ok(note.sources.every(s=>s.label&&s.url.startsWith('https://')));
  assert.ok(note.detailPage.startsWith('./docs/countries/'));
 }
});
test('General pension page is country-neutral; source notes have their own page',()=>{
 const general=readFileSync(new URL('../docs/pension-transparency.html',import.meta.url),'utf8');
 const fr=readFileSync(new URL('../docs/countries/fr-pensions.html',import.meta.url),'utf8');
 assert.doesNotMatch(general,/France|CAS Pensions|Institut des politiques publiques/);
 assert.match(fr,/CAS Pensions/);
});
