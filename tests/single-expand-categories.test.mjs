import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FUNCTIONS} from '../src/config.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('One category-card expansion reveals the single complete list of ten functions',()=>{
 const a=html.indexOf('<details class="topic-card spending-card" id="category-details">');
 const end=html.indexOf('</details>',a);
 assert.ok(a>=0 && end>a, 'outer spending card exists and closes');
 const inside=html.slice(a,end);
 assert.match(inside,/id="breakdown"/);
 assert.doesNotMatch(inside,/<details\b|id="breakdown-extra"/);
 assert.match(app,/el\('breakdown'\)\.replaceChildren\(\.\.\.allocations\.map\(makeRow\)\)/);
 assert.equal(FUNCTIONS.length,10,'all ten common COFOG functions remain registered');
});
test('The first-screen short summary stays separate and untouched',()=>{
 assert.match(html,/id="glance-leaders"/);
 assert.match(app,/spendingLeaders\(entry\)/);
 assert.match(html,/Explore all spending categories/);
});
test('All row help buttons and per-category spending figures are still generated',()=>{
 assert.match(app,/const help=categoryInfo\(item\);if\(help\)labelNode\.append\(help\)/);
 assert.match(app,/pct\.textContent=formatPct\(item\.share\)/);
 assert.match(app,/small\.textContent=formatMoney\(item\.allocated,curr\)/);
});
