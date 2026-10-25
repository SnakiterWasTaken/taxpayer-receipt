import {spawnSync} from 'node:child_process';
import {readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseNodeTap,parsePythonUnittest,testReportMarkdown} from './test-report-lib.mjs';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const output=join(root,'test-results');
mkdirSync(output,{recursive:true});
const testPaths=readdirSync(join(root,'tests')).filter(f=>f.endsWith('.test.mjs')).sort()
 .map(f=>'tests/'+f);
function execute(program,args,logName){
 const result=spawnSync(program,args,{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024});
 const content=[result.stdout||'',result.stderr||'',result.error?String(result.error):''].join('\n');
 writeFileSync(join(output,logName),content);
 process.stdout.write('['+logName+'] '+(result.status===0?'PASS':'FAIL')+'\n');
 if(result.status!==0)process.stderr.write(content.slice(-6500)+'\n');
 return {content,success:result.status===0&&!result.error};
}
const node=execute(process.execPath,['--test','--test-reporter=tap',...testPaths],'node-tests.log');
const py=execute('python3',['-m','unittest','discover','-v','-s','tests','-p','test_euromod*.py'],'python-tests.log');
const commit=process.env.GITHUB_SHA||'local, uncommitted/unknown';
const runUrl=process.env.GITHUB_RUN_ID
 ?'https://github.com/'+(process.env.GITHUB_REPOSITORY||'unknown')+'/actions/runs/'+process.env.GITHUB_RUN_ID
 :'Local execution (not a GitHub Actions run)';
const summary=testReportMarkdown({
 createdAt:new Date().toISOString(),commit,runUrl,
 node:parseNodeTap(node.content),python:parsePythonUnittest(py.content),
 nodeSuccess:node.success,pythonSuccess:py.success
});
writeFileSync(join(output,'test-report.md'),summary.markdown+'\n');
const short='Individual-result report: '+summary.counts.total+' tests; '+
 summary.counts.passed+' passed; '+summary.counts.failed+' failed; '+
 summary.counts.skipped+' skipped; '+(summary.healthy?'PASS':'FAIL / INCOMPLETE');
process.stdout.write(short+'\nWritten: test-results/test-report.md and raw logs\n');
if(!summary.healthy)process.exitCode=1;
