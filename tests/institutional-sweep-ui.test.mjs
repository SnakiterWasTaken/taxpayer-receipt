import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const workflow=readFileSync(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
const validation=readFileSync(new URL('../.github/workflows/validate.yml',import.meta.url),'utf8');
const docs=readFileSync(new URL('../docs/eu27-authority-sweep.md',import.meta.url),'utf8');

test('EU27 institution-level reporting displays verified amounts, not invented budget authority',()=>{
 assert.match(app,/sectorSpendingFor\(institutionalSnapshot,activeCountry,Number\(year\),code\)/);
 assert.match(app,/for\(const sector of SECTORS\)/);
 assert.match(app,/Not reported or not applicable/);
 assert.match(app,/not a list of budget decision-makers/);
 assert.match(app,/cannot be added to recreate the national total/);
 assert.match(app,/Largest budget manager: Not yet verified/);
 assert.doesNotMatch(app,/S1313.*?largest budget manager/s);
});
test('Missing institutional snapshot is visibly unavailable or loading, not silently zero',()=>{
 assert.match(app,/if\(rec\)\{/);
 assert.match(app,/institutionalError\?/);
 assert.match(app,/No matched published Eurostat sector figures/);
 assert.match(app,/Loading official Eurostat sector figures/);
});
test('Official source and official methodology directly accompany the sector figures',()=>{
 assert.match(app,/SECTOR_SOURCE/);
 assert.match(app,/SECTOR_METHOD/);
 assert.match(app,/Official national budget documents:/);
 assert.match(app,/portal\.scope/);
});
test('The complete 27-country data extraction is a validated build-and-deploy prerequisite',()=>{
 for(const flow of [workflow,validation])assert.match(flow,/npm run institutional:refresh/);
 assert.match(build,/institutional-spending\.json/);
 assert.match(workflow,/npm run data:refresh[\s\S]*npm run institutional:refresh/);
});
test('Authority details do not undo the mobile width containment fix',()=>{
 assert.match(css,/\.institutional-report\{[^}]*min-width:0;max-width:100%;overflow-wrap:anywhere;/s);
 assert.match(css,/\.institutional-sector-list\{[^}]*grid-template-columns:minmax\(0,1fr\) auto/);
 assert.match(css,/@media\(max-width:560px\)/);
});
test('All EU countries are in the documented source register with no fabricated manager',()=>{
 const names=['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','EL','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
 for(const code of names)assert.match(docs,new RegExp('\\| '+code+' \\|'));
 assert.match(docs,/Not yet reviewed by this project/);
 assert.match(docs,/Not verified/);
});

test('No official sector value automatically makes an institution its category budget manager',()=>{
 assert.match(app,/sector figures available; budget authority unverified/);
 assert.match(app,/not yet verified by this project/);
 assert.match(app,/Largest budget manager: Not yet verified/);
});
