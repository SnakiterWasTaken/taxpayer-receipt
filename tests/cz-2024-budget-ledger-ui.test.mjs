import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const docs=readFileSync(new URL('../docs/countries/cz-budget-chapters-2024.md',import.meta.url),'utf8');

test('Verified state chapter ledger appears only when Czechia and actual expenditure year 2024 are selected',()=>{
 assert.match(app,/czechChapterData\(code,spendingYear\)/);
 assert.match(app,/if\(chapters\)renderCzechStateBudgetLedger\(list\)/);
 assert.match(app,/toggle\('country-context',notes\.length>0\|\|!!chapters\)/);
 assert.match(app,/48 verified 2024 state-budget chapters/);
});
test('One country detail expansion exposes the entire 48-row ledger without a second nested disclosure',()=>{
 const block=app.slice(app.indexOf('function renderCzechStateBudgetLedger('),app.indexOf('function renderCountryNotes('));
 assert.ok(block.startsWith('function renderCzechStateBudgetLedger'));
 assert.match(block,/for\(const chapter of czechChaptersSorted\(\)\)/);
 assert.match(block,/list|container\.append\(section\)/);
 assert.doesNotMatch(block,/document\.createElement\('details'\)/);
 assert.match(block,/Source|CZ_2024_STATE_ACCOUNT_SOURCE/);
});
test('Historical budget year, cash-vs-S13 differences, chapter-versus-category distinction and original source are prominent',()=>{
 assert.match(app,/state budget \(cash accounting\), not Eurostat/i);
 assert.match(app,/Chapter spending can include transfers/);
 assert.match(app,/original Ministry of Finance final accounts|Original Ministry of Finance final accounts/);
 assert.match(docs,/state budget is not the same as Eurostat/);
 assert.match(docs,/not verified/);
 assert.match(docs,/2024/);
});
test('Complete country ledger is horizontally scrollable without widening a narrow phone',()=>{
 assert.match(css,/\.cz-chapters-scroll\{[\s\S]*?overflow-x:auto/);
 assert.match(css,/\.cz-chapters-table\{width:100%;min-width:410px;/);
 assert.match(css,/\.cz-chapter-section\{[\s\S]*?min-width:0;max-width:100%/);
});
