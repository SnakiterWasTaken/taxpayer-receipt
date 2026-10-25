import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES} from '../src/config.js';
import {budgetPortalFor,NATIONAL_BUDGET_PORTALS} from '../src/national-budget-portals.js';
test('Every verified national budget link is an official government publication, not a guessed URL',()=>{
 const countries=new Set(COUNTRIES.map(c=>c.code));
 for(const [code,entry] of Object.entries(NATIONAL_BUDGET_PORTALS)){
   assert.ok(countries.has(code));
   assert.ok(entry.url.startsWith('https://'));
   assert.match(new URL(entry.url).hostname,/(\.gov\.|\.gv\.at|\.de$|\.cz$|\.ee$|\.hr$|\.hu$)/);
   assert.ok(entry.label.length>15&&entry.scope.length>35);
 }
});
test('A budget chapter source is not a verified institutional manager of all COFOG spending',()=>{
 assert.match(budgetPortalFor('DE').scope,/state and local budgets not included/);
 assert.match(budgetPortalFor('CZ').scope,/not a reconciled COFOG/);
 assert.equal(budgetPortalFor('ES'),null);
});
