import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');

test('Country and year remain immediately accessible while five explanations are native expandable cards',()=>{
 for(const id of ['country','year'])assert.match(html,new RegExp('id="'+id+'"'));
 for(const id of ['category-details','pension-details','country-context','economic-details','how-it-works']){
   assert.match(html,new RegExp('<details[^>]+id="'+id+'"'));
 }
 assert.equal((html.match(/class="topic-summary"/g)||[]).length,5);
 assert.doesNotMatch(html,/<details[^>]+id="economic-details"[^>]*\bopen\b/);
 assert.doesNotMatch(html,/<details[^>]+id="how-it-works"[^>]*\bopen\b/);
});
test('Each closed category card communicates a clear purpose without reading full body',()=>{
 for(const phrase of [
   'Explore all spending categories',
   'Dive deeper: reviewed local questions',
   'What is different in',
   'Are living standards improving?',
   'How can I trust these figures?',
 ])assert.ok(html.includes(phrase),phrase);
 assert.match(html,/id="local-debate-topics" class="hidden"/);
 assert.match(html,/id="pension-teaser"/);
 assert.match(html,/id="economic-teaser"/);
 assert.match(html,/id="country-context-teaser"/);
});
test('Dynamic insight cards expose the fact first and reveal methodological evidence on tap or keyboard',()=>{
 assert.match(app,/document.createElement\('details'\);article.className='glance-observation insight-card'/);
 assert.match(app,/document.createElement\('summary'\);summary.className='insight-summary'/);
 assert.match(app,/evidence.append\(why,source\)/);
 assert.match(css,/\.insight-card>summary:focus-visible/);
});
test('Dynamic previews reflect selected official year, and missing observations are never invented',()=>{
 assert.match(app,/result\.publicShare/);
 assert.match(app,/el\('pension-teaser'\)\.textContent=result/);
 assert.match(app,/toggle\('local-debate-topics',!!pensionReview\)/);
 assert.match(app,/reviewedTopic\(activeCountry,Number\(year\),'old-age-and-survivors'\)/);
 assert.match(app,/economicGrowth\(entry\?\.disposableIncomeIndex,prior\?\.disposableIncomeIndex\)/);
 assert.match(app,/if\(Number\.isFinite\(entry\?\.inflation\)\)/);
 assert.match(app,/if\(Number\.isFinite\(incomeChangeForTeaser\)\)/);
 assert.match(app,/Historical indicators not available for/);
});
test('National rules remain selected-country only and collapse into their own note cards',()=>{
 assert.match(app,/countryNotesFor\(code\)/);
 assert.match(app,/document.createElement\('details'\);card.className='country-note-card'/);
 assert.match(app,/card\.append\(opener,article\)/);
 assert.match(app,/more\.append\(summary,details,sources\)/);
 assert.match(html,/id="country-context-list"/);
});
test('Tax-model and methodology deep links open every enclosing native disclosure',()=>{
 assert.match(html,/href="#country-note-cz-employee-tax-2024-2026"/);
 assert.match(app,/function revealLinkedSection\(\)/);
 assert.match(app,/parent\.tagName==='DETAILS'\)parent\.open=true/);
 assert.match(app,/window\.addEventListener\('hashchange',revealLinkedSection\)/);
 assert.match(app,/if\(window\.location\.hash\)revealLinkedSection\(\)/);
});
test('Long economic tables retain internal scrolling and mobile cards cannot widen the page',()=>{
 assert.match(css,/\.economic-table-wrap\s*\{[^}]*overflow-x:auto;/s);
 assert.match(css,/\.topic-card,[\s\S]*?min-width:0;/);
 assert.match(css,/@media\(max-width:700px\)\{\s*\.topic-card\{width:100%;max-width:100%\}/);
 assert.match(html,/<div class="economic-table-wrap">\s*<table class="economic-table">/);
});
test('Accounting and statistical source links survive simplification',()=>{
 for(const path of ['docs/pension-transparency.html','docs/methodology.html','docs/glossary.html','docs/economic-context.md'])
   assert.ok(html.includes(path),path);
 assert.match(html,/View original Eurostat dataset/);
 assert.match(html,/Common OECD \/ UN spending definitions/);
});
