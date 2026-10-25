import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('Czech household controls and payroll results have corresponding accessible DOM elements',()=>{
  for(const id of [
    'household-children','household-spouse','household-disability','household-ztp',
    'child-ztp-fields','payroll-other-credits','payroll-child-credit','payroll-child-bonus',
  ])assert.match(html,new RegExp(`id="${id}"`));
  assert.match(html,/fieldset class="household-fields"/);
  assert.match(html,/legend>Household tax reliefs/);
  assert.match(app,/renderChildZtpInputs\(\)/);
  assert.match(app,/household:currentHousehold\(\)/);
});

test('Visitor household and income values are not included in URL query state',()=>{
  const urlHandler=app.match(/function updateUrl\(\)\{[\s\S]*?\n\}/)?.[0];
  assert.ok(urlHandler);
  assert.doesNotMatch(urlHandler,/household|children|spouse|disability|grossAnnual|gross-salary|payroll/);
});
