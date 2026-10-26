import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {EU_COUNTRY_GEOMETRY} from '../src/eu-map-geometry.js';
import {COUNTRIES} from '../src/config.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const map=readFileSync(new URL('../src/eu-map.js',import.meta.url),'utf8');

test('Map geometry includes precisely EU27 unique country codes, matching Eurostat selection',()=>{
 const expected=COUNTRIES.map(c=>c.code).sort();
 assert.equal(EU_COUNTRY_GEOMETRY.length,27);
 assert.deepEqual(EU_COUNTRY_GEOMETRY.map(c=>c.code).sort(),expected);
 for(const shape of EU_COUNTRY_GEOMETRY){
   assert.match(shape.d,/^M[\d. ]+L/);
   assert.equal(shape.bounds.length,4);
   assert.ok(shape.bounds[2]>0&&shape.bounds[3]>0);
 }
});

test('National flag artwork is bundled locally for all 27 states, with retained licence',()=>{
 const root=new URL('../assets/flags/',import.meta.url);
 for(const country of COUNTRIES){
   const path=new URL(country.code.toLowerCase()+'.svg',root);
   assert.ok(existsSync(path),'missing '+country.code+' flag');
   assert.match(readFileSync(path,'utf8'),/<svg\b/);
 }
 assert.ok(existsSync(new URL('LICENSE',root)));
 assert.match(map,/href:'\.\/assets\/flags\/'/,'flag requests must remain local');
 assert.doesNotMatch(map,/flagcdn/,'no remote flag CDN calls are allowed');
});

test('Map is primary country selector; native dropdown remains an optional accessible fallback',()=>{
 const mapPosition=html.indexOf('id="eu-map"');
 const results=html.indexOf('class="panel results-panel"');
 assert.ok(mapPosition>0&&mapPosition<results);
 assert.match(html,/<details class="eu-map-list-fallback">[\s\S]*?<select id="country"/);
 assert.doesNotMatch(html,/Set your view/);
 assert.match(map,/tabindex:0/);
 assert.match(map,/event.key==='Enter'\|\|event.key===' '/);
 assert.match(map,/aria-pressed/);
 assert.match(app,/syncEuMapSelection=createEuCountryMap/);
 assert.match(app,/syncEuMapSelection\(code\)/);
});

test('Hovered, focused and selected country colours are clipped inside their contours',()=>{
 assert.match(map,/clipPath/);
 assert.match(map,/clip-path/);
 assert.match(css,/\.eu-map-country\.is-selected \.eu-map-flag\{opacity:1\}/);
 assert.match(css,/\.eu-map-country\.is-hovered \.eu-map-flag/);
 assert.match(map,/group\.addEventListener\('pointerup'/);
 for(const code of ['LU','MT','CY']){
   assert.match(map,new RegExp("'"+code+"'"));
 }
});
