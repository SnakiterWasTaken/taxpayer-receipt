import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNodeTap,parsePythonUnittest,testReportMarkdown} from '../scripts/test-report-lib.mjs';

const tap='# TAP version 13\nok 1 - reconciles public expenditure\nnot ok 2 - checks an invalid year\n# tests 2\n# pass 1\n# fail 1\n';
const py="test_valid_model (test_euromod_tools.ModelChecks.test_valid_model) ... ok\ntest_missing_model (test_euromod_tools.ModelChecks.test_missing_model) ... FAIL\n\nRan 2 tests in 0.011s\nFAILED (failures=1)\n";
test('The reporter records each JavaScript success and failure instead of only aggregate counts',()=>{
 const r=parseNodeTap(tap);assert.equal(r.reportedCount,2);
 assert.deepEqual(r.records.map(x=>x.status),['PASS','FAIL']);
 assert.match(r.records[1].purpose,/invalid year/);
});
test('The reporter records each Python unittest result and readable purpose',()=>{
 const r=parsePythonUnittest(py);
 assert.equal(r.reportedCount,2);
 assert.deepEqual(r.records.map(x=>x.status),['PASS','FAIL']);
 assert.match(r.records[0].purpose,/valid model/);
});
test('An individual failed test cannot be reported as an overall pass',()=>{
 const n=parseNodeTap(tap),p=parsePythonUnittest(py);
 const x=testReportMarkdown({createdAt:'2026-10-25T12:00:00Z',commit:'abc',runUrl:'local',
   node:n,python:p,nodeSuccess:false,pythonSuccess:false});
 assert.equal(x.healthy,false);assert.equal(x.counts.total,4);
 assert.match(x.markdown,/checks an invalid year/);
 assert.match(x.markdown,/missing model/);
 assert.match(x.markdown,/Do not describe this run as passing/);
});
test('Uncaptured test outcomes also cause reporting to fail closed',()=>{
 const n=parseNodeTap(tap);n.records.pop();
 const p=parsePythonUnittest(py);
 const x=testReportMarkdown({createdAt:'x',commit:'x',runUrl:'x',node:n,python:p,nodeSuccess:true,pythonSuccess:true});
 assert.equal(x.healthy,false);
 assert.match(x.markdown,/did not match the runner/);
});
test('Valid tests include an explanation of what passing does and does not prove',()=>{
 const n=parseNodeTap('# TAP version 13\nok 1 - verifies documented threshold\n# tests 1\n# fail 0\n');
 const p=parsePythonUnittest('test_sources (test_euromod_tools.Test.test_sources) ... ok\nRan 1 test in 0.003s\nOK');
 const x=testReportMarkdown({createdAt:'x',commit:'x',runUrl:'x',node:n,python:p,nodeSuccess:true,pythonSuccess:true});
 assert.equal(x.healthy,true);assert.equal(x.counts.passed,2);
 assert.match(x.markdown,/not a legal audit/);
});
