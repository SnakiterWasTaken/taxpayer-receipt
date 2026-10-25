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
 for(const country of ['DE','IT','BE'])assert.deepEqual(countryNotesFor(country),[]);
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
  if(note.detailPage)assert.ok(note.detailPage.startsWith('./docs/countries/'));
 }
});
test('General pension page is country-neutral; source notes have their own page',()=>{
 const general=readFileSync(new URL('../docs/pension-transparency.html',import.meta.url),'utf8');
 const fr=readFileSync(new URL('../docs/countries/fr-pensions.html',import.meta.url),'utf8');
 assert.doesNotMatch(general,/France|CAS Pensions|Institut des politiques publiques/);
 assert.match(fr,/CAS Pensions/);
});

test('Czech tax and household eligibility belongs to the Czech country view',()=>{
 const notes=countryNotesFor('CZ');
 assert.equal(notes.length,1);
 const note=notes[0];
 assert.equal(note.topic,'employee-tax-model');
 assert.deepEqual(note.sourceYears,[2024,2025,2026]);
 assert.match(note.summary,/15%\/23%/);
 assert.match(note.details.map(x=>x.body).join(' '),/child.*bonus/i);
 assert.match(notePeriodDescription(note,2024,2026),/2026/);
 assert.match(notePeriodDescription(note,2024,2026),/2024/);
 assert.equal(countryNotesFor('FR').some(x=>x.topic==='employee-tax-model'),false);
});
test('General methodology pages do not embed Czech-specific tax rules',()=>{
 const html=readFileSync(new URL('../docs/methodology.html',import.meta.url),'utf8');
 const md=readFileSync(new URL('../docs/methodology.md',import.meta.url),'utf8');
 assert.doesNotMatch(html,/(?:id="czechia"|Czech employment calculator|CZK 30,840|Spouse\/eligible)/);
 assert.doesNotMatch(md,/^## Czechia personal income-tax calculator/m);
 const specific=readFileSync(new URL('../docs/countries/cz-tax.md',import.meta.url),'utf8');
 assert.match(specific,/30,840 CZK/);
});

test('Payroll help links to country-scoped tax notes on the main explorer',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(html,/href="#country-note-cz-employee-tax-2024-2026"/);
 assert.match(js,/renderCountryNotes\(activeCountry,year\)/);
 assert.match(js,/note\.details/);
 assert.match(js,/CZ_RULES\[y\]/);
});
