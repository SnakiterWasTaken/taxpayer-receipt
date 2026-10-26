import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('overview order: pie, category explanations, then three largest areas',()=>{
 const pie=html.indexOf('class="visual-row"');
 const categories=html.indexOf('id="category-details"');
 const glance=html.indexOf('class="glance-panel"');
 assert.ok(pie>0&&categories>pie&&glance>categories);
});
test('every pie slice can be selected with pointer and keyboard',()=>{
 assert.match(app,/circle\.addEventListener\('click',openBreakdown\)/);
 assert.match(app,/circle\.addEventListener\('keydown'/);
 assert.match(app,/circle\.setAttribute\('aria-label'/);
 assert.match(app,/details\.open=true/);
 assert.match(html,/id="donut-selection" role="status"/);
});
