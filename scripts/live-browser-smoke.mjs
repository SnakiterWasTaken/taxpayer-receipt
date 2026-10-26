#!/usr/bin/env node
/**
 * Live V1 browser smoke test for the *published* GitHub Pages site.
 * Does not attest to privacy of the browser/extensions/hosting infrastructure.
 * Uses synthetic numbers only. Run via .github/workflows/live-browser-smoke.yml.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';

const SITE = process.env.V1_SITE_URL || 'https://snakiterwastaken.github.io/taxpayer-receipt/';
const OUT = 'test-results/live-browser';
const widths = [320, 375, 390, 430];
const passed = [];
const failed = [];
const screenshot = async(page, name) => {
  try {await page.screenshot({path:join(OUT, name), fullPage:true, timeout:20000});}
  catch (err) { console.warn('Screenshot not saved:', err.message); }
};
function test(name, task) {
  return (async()=>{try{await task();passed.push(name);console.log('PASS:',name);}
    catch(err){failed.push({name,error:err.message});console.error('FAIL:',name,err.stack||err);}})();
}
async function loaded(page) {
  await page.goto(SITE, {waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('#results:not(.hidden)').waitFor({timeout:90000});
  await page.locator('#donut .donut-segment').first().waitFor({timeout:30000});
}
function expectNoOverflow({width,scroll}) {
  assert.ok(scroll<=width+1, 'viewport '+width+'px has document scrollWidth '+scroll+'px');
}

await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
  await test('Live public page: CZ 2024 overview and source-backed functions',async()=>{
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    try{
      await loaded(page);
      assert.equal(await page.locator('#country').inputValue(),'CZ');
      assert.equal(await page.locator('#year').inputValue(),'2024');
      assert.equal(await page.locator('#donut .donut-segment').count(),10);
      await page.locator('#category-details > summary').click();
      assert.equal(await page.locator('#breakdown .breakdown-row').count(),10);
      assert.equal(await page.locator('#glance-leaders .glance-leader').count(),3);
      await screenshot(page,'desktop-cz.png');
    }finally{await page.close();}
  });

  await test('Keyboard: SVG slices disclose the corresponding breakdown',async()=>{
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    try{
      await loaded(page);
      const segment=page.locator('#donut .donut-segment').first();
      await segment.focus();
      const description=await page.locator('#donut-selection').textContent();
      assert.ok(description && description.includes('%'),'focused segment should announce its percentage');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#category-details').evaluate(el=>el.open),true);
      assert.ok(await page.locator('#breakdown .breakdown-selected').count()>=1);
      await page.keyboard.press('Tab');
      assert.notEqual(await page.evaluate(()=>document.activeElement?.tagName), 'BODY');
    }finally{await page.close();}
  });

  await test('Country switch, non-Czech tax mode and country comparison',async()=>{
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    try{
      await loaded(page);
      await page.locator('#country').selectOption('FR');
      assert.equal(await page.locator('#country').inputValue(),'FR');
      assert.ok(await page.locator('#salary-fields').evaluate(el=>el.classList.contains('hidden')),'Czech salary model must be hidden in France');
      await page.locator('#personalize-details > summary').click();
      await page.locator('#amount').fill('873521');
      assert.equal(await page.locator('#contribution-mode').inputValue(),'manual');
      await page.locator('#compare-details > summary').click();
      await page.locator('#compare').selectOption('CZ');
      assert.equal(await page.locator('#comparison-panel').evaluate(el=>el.classList.contains('hidden')),false);
      assert.ok((await page.locator('#result-title').textContent()).includes('France'));
    }finally{await page.close();}
  });

  await test('Privacy: synthetic tax input never leaves via URL, request, or browser storage',async()=>{
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    const marker='873521';
    const leaks=[];
    page.on('request',request=>{
      const body=request.postData()||'';
      if(request.url().includes(marker)||body.includes(marker))
        leaks.push(request.method()+' '+request.url().slice(0,250));
    });
    try{
      await loaded(page);
      await page.locator('#personalize-details > summary').click();
      await page.locator('#gross-salary').fill(marker);
      await page.locator('#country').selectOption('FR');
      await page.locator('#amount').fill(marker);
      await page.waitForTimeout(1000);
      const state=await page.evaluate(()=>({
        url:location.href,local:{...localStorage},session:{...sessionStorage}
      }));
      assert.ok(!JSON.stringify(state).includes(marker),'personal input appears in URL or storage');
      assert.deepEqual(leaks,[],'personal input was included in an HTTP request');
    }finally{await page.close();}
  });

  for(const width of widths){
    await test('Mobile '+width+'px: expanded content has no page-level overflow',async()=>{
      const context=await browser.newContext({viewport:{width,height:812},isMobile:true,hasTouch:true,deviceScaleFactor:1});
      const page=await context.newPage();
      try{
        await loaded(page);
        // Multiple long sections: the body should not stretch beyond the viewport.
        await page.locator('#category-details').evaluate(el=>el.open=true);
        for(const selector of ['#pension-details','#economic-details','#country-context','#how-it-works']){
          const panel=page.locator(selector);
          if(await panel.count())await panel.evaluate(el=>el.open=true);
        }
        const measure=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
        expectNoOverflow(measure);
        await screenshot(page,'mobile-'+width+'.png');
      }finally{await context.close();}
    });
  }

  await test('Touch: pie slice tap opens explanation',async()=>{
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const page=await context.newPage();
    try{
      await loaded(page);
      await page.locator('#donut .donut-segment').first().tap();
      assert.equal(await page.locator('#category-details').evaluate(el=>el.open),true);
    }finally{await context.close();}
  });
} finally {await browser.close();}
console.log(JSON.stringify({site:SITE,checks:passed.length+failed.length,passed,failed},null,2));
if(failed.length)process.exitCode=1;
