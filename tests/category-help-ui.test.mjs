import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');

test('The initial view shows country/year and optional tax inputs',()=>{
 assert.match(html,/id="country"/);assert.match(html,/id="year"/);
 assert.match(html,/<details class="sidebar-details" id="personalize-details">/);
 assert.match(html,/<details class="sidebar-details" id="compare-details">/);
 assert.doesNotMatch(html,/<details[^>]+id="personalize-details"[^>]*open/);
});
test('Three-category summary and full detail have distinct accessible containers',()=>{
 for(const id of ['glance-leaders','glance-observations','glance-observations-caption','breakdown','breakdown-extra'])
   assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/<details id="spending-more"/);
 assert.match(js,/allocations\.slice\(0,3\)/);
 assert.match(js,/allocations\.slice\(3\)/);
 assert.match(js,/renderGlance\(entry\)/);
});
test('Common category help is interactive and accessible in all spending displays',()=>{
 assert.match(js,/helpForCategory\(item.code\)/);
 assert.match(js,/setAttribute\('aria-label','What does '/);
 assert.match(js,/setAttribute\('aria-describedby',id\)/);
 assert.match(js,/role','tooltip'/);
 assert.match(js,/help\.open|help-open/);
 assert.match(js,/event.key==='Escape'/);
 assert.match(js,/categoryInfo\(leader\)/);
 assert.match(js,/categoryInfo\(f\)/);
 assert.match(css,/category-help:hover \.category-help-tooltip/);
 assert.match(css,/category-help:focus-within \.category-help-tooltip/);
});
test('National and granular economic context remains available on demand',()=>{
 assert.match(js,/countryNotesFor\(code\)/);
 assert.match(js,/country-note-more/);
 assert.match(html,/<details class="panel economic-disclosure"/);
 assert.match(html,/<details class="detail-toggle pension-disclosure"/);
 assert.match(html,/docs\/methodology\.html/);
});
test('The common category tooltip descriptions are linked to primary classification references',()=>{
 assert.match(html,/oecd\.org.*COFOG/i);
 const doc=readFileSync(new URL('../docs/methodology.html',import.meta.url),'utf8');
 assert.match(doc,/COFOG describes/);
 assert.doesNotMatch(doc,/Ministry of Finance of Czechia|French Ministry of Health/);
});
