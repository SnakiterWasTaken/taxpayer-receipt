/** Convert ordinary Node TAP and Python unittest verbose output to one explained row per test. */
export function parseNodeTap(output){
 const records=[];
 for(const line of String(output).split(/\r?\n/)){
   // TAP 13 exposes the human-readable test title at the end of each "ok" line.
   const m=/^\s*(ok|not ok)\s+\d+\s+-\s+(.+?)(?:\s+#\s+(SKIP|TODO).*)?$/.exec(line);
   if(!m)continue;
   records.push({status:m[3]==='SKIP'?'SKIP':m[1]==='ok'?'PASS':'FAIL',
     purpose:m[2].trim(),suite:'JavaScript (Node)'});
 }
 const tests=Number((String(output).match(/^# tests\s+(\d+)\s*$/m)||[])[1]);
 const failures=Number((String(output).match(/^# fail\s+(\d+)\s*$/m)||[])[1]);
 return {records,reportedCount:Number.isFinite(tests)?tests:null,reportedFailures:Number.isFinite(failures)?failures:null};
}
export function parsePythonUnittest(output){
 const records=[];
 for(const line of String(output).split(/\r?\n/)){
   const m=/^(\S+)\s+\(([^)]+)\)\s+\.\.\.\s+(ok|FAIL|ERROR|skipped\b.*)$/.exec(line.trim());
   if(!m)continue;
   const s=m[3].startsWith('skipped')?'SKIP':m[3]==='ok'?'PASS':'FAIL';
   const human=m[1].replace(/^test_/,'').replaceAll('_',' ');
   records.push({status:s,purpose:human+' ('+m[2]+')',suite:'Python (EUROMOD tools)'});
 }
 const tests=Number((String(output).match(/^Ran\s+(\d+)\s+tests?\s+in/m)||[])[1]);
 return {records,reportedCount:Number.isFinite(tests)?tests:null};
}
export function testReportMarkdown({createdAt,commit,runUrl,node,python,nodeSuccess,pythonSuccess}){
 const all=[...node.records,...python.records];
 const passed=all.filter(r=>r.status==='PASS').length;
 const failed=all.filter(r=>r.status==='FAIL').length;
 const skipped=all.filter(r=>r.status==='SKIP').length;
 const healthy=nodeSuccess&&pythonSuccess&&node.reportedCount===node.records.length
   &&python.reportedCount===python.records.length&&failed===0;
 const esc=s=>String(s).replaceAll('|','\\|').replace(/\r?\n/g,' ');
 const lines=[
 '# Individual automated test results',
 '',
 '**Purpose:** a reproducible list of each executed test, its human-readable intent and its outcome. This report is generated from the test runners, not manually declared successful.',
 '',
 '- **Result:** '+(healthy?'PASS':'FAIL / INCOMPLETE'),
 '- **Time (UTC):** '+createdAt,
 '- **Commit:** \`'+commit+'\`',
 '- **GitHub Actions:** '+runUrl,
 '- **JavaScript tests:** '+node.records.length+' captured (runner said '+node.reportedCount+'); process '+(nodeSuccess?'passed':'failed'),
 '- **Python tests:** '+python.records.length+' captured (runner said '+python.reportedCount+'); process '+(pythonSuccess?'passed':'failed'),
 '- **Individual results:** '+passed+' passed; '+failed+' failed; '+skipped+' skipped',
 '',
 'A PASS means **only** that the named test assertions succeeded in this environment. It is not a legal audit, browser accessibility review, or a real EUROMOD simulation. The test title explains what was checked; its implementation is in the repository’s \`tests/\` directory. Raw standard output and diagnostics accompany this file.',
 '',
 '| Result | What the test checks (name from source) | Test suite |',
 '| --- | --- | --- |'
 ];
 for(const x of all)lines.push('| '+x.status+' | '+esc(x.purpose)+' | '+esc(x.suite)+' |');
 if(!all.length)lines.push('| FAIL | No individual results were captured | — |');
 lines.push('','## What failed or remains unverified','');
 if(healthy)lines.push('No failed or missing automated tests were detected in these two suites. **External datasets, the website build, manual browser tests and official EUROMOD execution are separate steps** and must be recorded independently.');
 else{
   if(!nodeSuccess||node.reportedCount!==node.records.length)lines.push('- JavaScript suite failed or its individual-result count did not match the runner.');
   if(!pythonSuccess||python.reportedCount!==python.records.length)lines.push('- Python suite failed or its individual-result count did not match the runner.');
   for(const x of all.filter(r=>r.status==='FAIL'))lines.push('- '+x.suite+': '+x.purpose);
   lines.push('Consult \`node-tests.log\` and \`python-tests.log\` for the assertion, exception and stack trace. Do not describe this run as passing.');
 }
 lines.push('','## Durable handover', '',
 'The GitHub Actions artifact is time-limited. Append attempted commands, investigation, fixes, reruns and open questions to [docs/TEST_LOG.md](../docs/TEST_LOG.md) in the repository as part of the PR. Future investigators should start there.','');
 return {markdown:lines.join('\n'),healthy,counts:{passed,failed,skipped,total:all.length}};
}
