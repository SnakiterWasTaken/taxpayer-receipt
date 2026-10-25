import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');

test('Household-income index definition is a clickable keyboard-accessible bubble in the history table header',()=>{
 const header=html.match(/<thead><tr>[\s\S]*?<\/tr><\/thead>/)?.[0];
 assert.ok(header,'historical table heading exists');
 assert.match(header,/Household income index \(2008 = 100\)/);
 assert.match(header,/class="category-help income-table-help"/);
 assert.match(header,/button type="button" class="category-help-button"/);
 assert.match(header,/aria-describedby="income-index-explainer"/);
 assert.match(header,/id="income-index-explainer" role="tooltip"/);
 assert.match(header,/2008 is set to 100/);
 assert.doesNotMatch(html,/<details class="economic-help" id="income-index-explainer"/);
 assert.match(app,/wireInfoBubble\(el\('income-table-help'\)\)/);
});
test('Who-is-responsible panels show on EVERY spending function but never invent unverified governments',()=>{
 assert.match(app,/function authorityDetails\(code\)/);
 assert.match(app,/responsibilityStatus\(activeCountry,code,Number\(year\)\)/);
 assert.match(app,/main\.append\(labelNode,track,authorityDetails\(item.code\)\)/);
 assert.match(app,/if\(!data\.available\)/);
 assert.match(app,/missing\.textContent=data\.reason/);
 assert.match(app,/record\.sources/);
 assert.match(app,/src\.url/);
 assert.match(app,/record\.limit/);
 assert.doesNotMatch(app,/country==='CZ'.*GF04.*?Ministerstvo/s);
});
test('Authority details are expandable and remain mobile width constrained',()=>{
 assert.match(app,/document\.createElement\('details'\);card\.className='authority-details'/);
 assert.match(app,/document\.createElement\('summary'\);trigger\.className='authority-summary'/);
 assert.match(css,/\.authority-details\{[^}]*max-width:100%;min-width:0;?\}/);
 assert.match(css,/\.authority-content\{[^}]*min-width:0;max-width:100%;overflow-wrap:anywhere;/s);
});
