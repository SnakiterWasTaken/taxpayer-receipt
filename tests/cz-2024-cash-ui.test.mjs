import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const docs=readFileSync(new URL('../docs/cz-2024-cash-reconciliation.md',import.meta.url),'utf8');
test('Czech official cash-source reconciliation is visible only for the selected country/year/category',()=>{
 assert.match(app,/czCashReconciliation\(activeCountry,Number\(year\),code\)/);
 assert.match(app,/if\(czCash\)\{/);
 assert.match(app,/CZ_2024_CASH_SOURCE.url/);
 assert.match(app,/CZK/);
});
test('The user sees net central, gross local, transfer elimination and final total separately',()=>{
 assert.match(app,/Central budgets, after internal transfers/);
 assert.match(app,/Local budgets, before central-to-local adjustment/);
 assert.match(app,/Transfer and other cross-level eliminations/);
 assert.match(app,/Combined public-budget expenditure for this function/);
 assert.match(app,/cash\.append\(cashHeading,lead,dl,warning,law,link,lawLink\)/);
});
test('No false equivalence to Eurostat, or transfer double-counting',()=>{
 assert.match(app,/NOT the same as Eurostat/);
 assert.match(app,/do not identify the largest discretionary budget manager/);
 assert.match(docs,/3,157,927/);
 assert.match(docs,/-29,741/);
 assert.match(docs,/204,763/);
 assert.match(docs,/not a compatible denominator/);
});
test('Municipal council approval and executive management have 2024 versioned official legal citation',()=>{
 assert.match(app,/Municipalities Act §84\(2\)\(b\)/);
 assert.match(app,/§102\(2\)\(a\)/);
 assert.match(app,/\/sb\/2000\/128\/2024-01-01/);
 assert.match(docs,/not evidence that every transfer is free of central conditions/);
});
test('The reconciled function table stays within narrow mobile display width',()=>{
 assert.match(css,/\.cz-cash-reconciliation\{[^}]*min-width:0;max-width:100%/);
 assert.match(css,/\.cz-cash-rows\{[^}]*grid-template-columns:minmax\(0,1fr\) auto/);
 assert.match(css,/@media\(max-width:420px\)/);
});
test('MONITOR datasets are researched as an input, not silently declared processed or reconciled',()=>{
 assert.match(docs,/Not yet executed/);
 assert.match(docs,/FIN 2-12 M/);
 assert.match(docs,/FIN 1-12 OSS/);
 assert.match(docs,/Official.*MONITOR|Ministry of Finance MONITOR/);
});
