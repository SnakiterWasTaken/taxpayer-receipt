import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REVIEWED_LOCAL_TOPICS,reviewedTopic} from '../src/local-debate-topics.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('No topic is promoted without an independently reviewed country-year relevance entry',()=>{
  assert.deepEqual(REVIEWED_LOCAL_TOPICS,[]);
  for(const [country,year] of [['CZ',2024],['FR',2024],['DE',2025]]){
    assert.equal(reviewedTopic(country,year,'old-age-and-survivors'),null);
  }
  assert.match(html,/<section id="local-debate-topics" class="hidden"/);
  assert.match(app,/toggle\('local-debate-topics',!!pensionReview\)/);
  assert.match(app,/el\('pension-details'\)\.open=false/);
});

test('Debate eligibility requires an exact country-year and both evidence sources',()=>{
  const record={country:'FR',year:2024,topic:'old-age-and-survivors',
    explanation:'Reviewed explanation of this specific debate.',
    reviewedAt:'2026-10-26',
    debateSource:'https://example.org/sourced-national-debate',
    dataSource:'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table'};
  assert.equal(reviewedTopic('FR',2024,'old-age-and-survivors',[record]),record);
  assert.equal(reviewedTopic('FR',2023,'old-age-and-survivors',[record]),null);
  assert.equal(reviewedTopic('CZ',2024,'old-age-and-survivors',[record]),null);
  assert.equal(reviewedTopic('FR',2024,'healthcare',[record]),null);
  assert.equal(reviewedTopic('FR',2024,'old-age-and-survivors',[{...record,debateSource:''}]),null);
  assert.equal(reviewedTopic('FR',2024,'old-age-and-survivors',[{...record,reviewedAt:''}]),null);
  assert.equal(reviewedTopic('FR',2024,'old-age-and-survivors',[{...record,dataSource:'http://example.org'}]),null);
});

test('No unrequested pension highlight in comparison or ordinary at-a-glance copy',()=>{
  assert.doesNotMatch(app,/Old age & survivors \(included above\)/);
  assert.doesNotMatch(readFileSync(new URL('../src/glance.js',import.meta.url),'utf8'),/old-age-share/);
});
