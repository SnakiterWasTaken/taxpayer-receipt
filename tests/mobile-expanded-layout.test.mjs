import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const part=css.slice(css.indexOf('/* Mobile expansion containment:'));

test('Each expanded mobile detail card remains constrained to the explorer column',()=>{
  assert.match(part,/\.output\s*\{\s*grid-template-columns:minmax\(0,1fr\);/);
  assert.match(part,/\.output\s*>\s*details\.panel\s*\{[^}]*width:100%;[^}]*min-width:0;[^}]*max-width:100%;/s);
  assert.match(part,/\.explorer\s*\{\s*grid-template-columns:minmax\(0,1fr\)/);
  assert.match(html,/<details class="panel economic-disclosure topic-card" id="economic-details">/);
  assert.match(html,/<details class="topic-card pension-disclosure" id="pension-details">/);
  assert.match(html,/<details id="spending-more" class="detail-toggle">/);
});

test('Wide economic table scrolls inside its own box instead of resizing the whole page',()=>{
  assert.match(part,/\.economic-table-wrap\s*\{[^}]*max-width:100%;[^}]*min-width:0;[^}]*overflow-x:auto;/s);
  assert.match(part,/\.economic-table\s*\{[^}]*min-width:520px;/s);
  assert.match(html,/<div class="economic-table-wrap">\s*<table class="economic-table">/);
  assert.doesNotMatch(part,/body\s*\{[^}]*overflow-x:\s*hidden;/s);
});

test('Long country notes, euro figures and mobile payroll cards wrap in their own panels',()=>{
  assert.match(part,/\.country-note-links a,[\s\S]*?\.summary-number\s*\{\s*overflow-wrap:anywhere;/);
  assert.match(part,/\.payroll-head\s*\{\s*flex-wrap:wrap;/);
  assert.match(part,/\.breakdown-label small\s*\{\s*white-space:normal;/);
});

test('Desktop spending explorer and mobile table preserve their intended layout',()=>{
  assert.match(css,/\.explorer\s*\{\s*display:grid;grid-template-columns:335px minmax\(0,1fr\)/);
  assert.match(css,/\.economic-table\s*\{[^}]*min-width:520px;/s);
});
