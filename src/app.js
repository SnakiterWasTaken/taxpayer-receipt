import {COUNTRIES,FUNCTIONS,EUROSTAT_PAGE,countryFlag,sourceUrl} from './config.js';
import {normalizeEurostat,validateSnapshot,availableYears,allocate} from './eurostat.js';
import {calculateCzechEmployee,CZ_RULES} from './tax/cz.js';
import {pensionTransparency} from './pensions.js';
import {countryNotesFor,notePeriodDescription} from './country-notes.js';
import {helpForCategory} from './category-help.js';
import {spendingLeaders,observationsForCountry} from './glance.js';
import {explainIncomeIndex} from './plain-language.js';
import {responsibilityStatus} from './official-responsibilities.js';
import {SECTORS,validateSectorSpending,sectorSpendingFor,SECTOR_SOURCE,SECTOR_METHOD} from './sector-spending.js';
import {budgetPortalFor} from './national-budget-portals.js';
import {CZ_2024_STATE_ACCOUNT_SOURCE,CZ_2024_CHAPTER_TOTAL_THOUSAND_CZK,czechChapterData,czechChaptersSorted} from './cz-2024-budget-chapters.js';
import {validateEconomicContext,economicForYear,economicGrowth,NO_NATIONAL_MINIMUM_WAGE,ECONOMIC_SOURCES} from './economic-context.js';

const el=id=>document.getElementById(id);
const countryEl=el('country'),yearEl=el('year'),amountEl=el('amount'),compareEl=el('compare');
const modeEl=el('contribution-mode'),grossEl=el('gross-salary'),taxYearEl=el('tax-year'),basisEl=el('allocation-basis');
const childrenEl=el('household-children'),childZtpEl=el('child-ztp-fields'),spouseEl=el('household-spouse');
const disabilityEl=el('household-disability'),ownZtpEl=el('household-ztp');
let childZtpSelection=[];
let snapshot=null;
let economicSnapshot=null;
let economicError=null;
let institutionalSnapshot=null;
let institutionalError=null;
let activeCountry='CZ';
let year=null;
let compare='';
let contributionMode='salary';
let categoryTooltipSequence=0;

function formatNumber(x,max=0){return new Intl.NumberFormat('en-GB',{maximumFractionDigits:max}).format(x)}
function formatMoney(x,currency){return new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:0}).format(x)}
function formatPct(v){return `${(v*100).toFixed(1)}%`}
function label(code){return COUNTRIES.find(x=>x.code===code)?.name||code}
function currency(code){return COUNTRIES.find(x=>x.code===code)?.currency||'EUR'}
function toggle(id,on){el(id).classList.toggle('hidden',!on)}
function renderOptions(select,entries,value){select.replaceChildren(...entries.map(({code,name})=>{const option=document.createElement('option');option.value=code;option.textContent=name;return option}));select.value=value}

function selectYear(preferred){
  const years=availableYears(snapshot,activeCountry);
  if(years.length===0){year=null;yearEl.replaceChildren();yearEl.disabled=true;return}
  year=years.includes(preferred)?preferred:years.includes(2024)?2024:years[0];
  yearEl.replaceChildren(...years.map(yr=>{const opt=document.createElement('option');opt.value=String(yr);opt.textContent=String(yr);return opt}));
  yearEl.value=String(year);yearEl.disabled=false;
}
function updateUrl(){
  const u=new URL(location.href);
  u.searchParams.set('country',activeCountry);
  if(year)u.searchParams.set('year',String(year)); else u.searchParams.delete('year');
  if(compare)u.searchParams.set('compare',compare);else u.searchParams.delete('compare');
  if(contributionMode==='salary'&&activeCountry==='CZ')u.searchParams.set('taxYear',taxYearEl.value);else u.searchParams.delete('taxYear');
  // Never persist visitor-entered money in a link, analytics or network request.
  history.replaceState(null,'',u);
}
function donut(data){
  const svg=el('donut');svg.replaceChildren();
  const ns='http://www.w3.org/2000/svg';const radius=88;const circumference=2*Math.PI*radius;
  const base=document.createElementNS(ns,'circle');
  base.setAttribute('cx','120');base.setAttribute('cy','120');base.setAttribute('r',radius);base.setAttribute('fill','none');base.setAttribute('stroke','#304258');base.setAttribute('stroke-width','21');svg.append(base);
  let offset=0;
  for(const item of data){
    const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx','120');circle.setAttribute('cy','120');circle.setAttribute('r',radius);circle.setAttribute('fill','none');circle.setAttribute('stroke',item.color);circle.setAttribute('stroke-width','21');circle.setAttribute('transform','rotate(-90 120 120)');circle.setAttribute('stroke-dasharray',`${Math.max(0,circumference*item.share-.8)} ${circumference}`);circle.setAttribute('stroke-dashoffset',String(-offset*circumference));
    const title=document.createElementNS(ns,'title');title.textContent=`${item.label}: ${formatPct(item.share)}`;circle.append(title);svg.append(circle);offset+=item.share;
  }
}

function categoryInfo(item){
 const info=helpForCategory(item.code);
 if(!info)return null;
 const wrap=document.createElement('span');wrap.className='category-help';
 const button=document.createElement('button');button.type='button';button.className='category-help-button';
 button.textContent='i';button.setAttribute('aria-label','What does '+item.label+' include?');
 const id='category-help-'+item.code+'-'+(++categoryTooltipSequence);button.setAttribute('aria-describedby',id);
 const tip=document.createElement('span');tip.className='category-help-tooltip';tip.id=id;tip.setAttribute('role','tooltip');
 const summary=document.createElement('strong');summary.textContent=info.summary;
 const examples=document.createElement('span');examples.textContent='For example: '+info.examples;
 const caveat=document.createElement('span');caveat.textContent='Note: '+info.not;
 const disclaimer=document.createElement('small');disclaimer.textContent='Examples of classified functions, not a receipt for individual spending.';
 tip.append(summary,examples,caveat,disclaimer);wrap.append(button,tip);
 wireInfoBubble(wrap);
 return wrap;
}
/** Same pointer, keyboard and touch behavior for static and dynamic information bubbles. */
function wireInfoBubble(wrap){
 const button=wrap.querySelector('button');
 if(!button)return;
 button.setAttribute('aria-expanded','false');
 button.addEventListener('click',()=>{
   const opening=!wrap.classList.contains('help-open');
   for(const prior of document.querySelectorAll('.category-help.help-open')){
     prior.classList.remove('help-open');
     prior.querySelector('button')?.setAttribute('aria-expanded','false');
   }
   wrap.classList.toggle('help-open',opening);
   button.setAttribute('aria-expanded',String(opening));
 });
 button.addEventListener('blur',()=>{
   wrap.classList.remove('help-open');button.setAttribute('aria-expanded','false');
 });
 button.addEventListener('keydown',event=>{
   if(event.key==='Escape'){wrap.classList.remove('help-open');button.blur();}
 });
}
/** Explain only responsibilities supported by official, country-specific publications. */
function authorityDetails(code){
 const data=responsibilityStatus(activeCountry,code,Number(year));
 const card=document.createElement('details');card.className='authority-details';
 const trigger=document.createElement('summary');trigger.className='authority-summary';
 const hasSector=!!sectorSpendingFor(institutionalSnapshot,activeCountry,Number(year),code);
 trigger.textContent=data.available
   ?'Who decides? · sourced legal examples'+(hasSector?' and sector expenditure':'')
   :hasSector
     ?'Who decides? · sector figures available; budget authority unverified'
     :'Who decides? · not yet verified by this project';
 const content=document.createElement('div');content.className='authority-content';
 if(!data.available){
   const missing=document.createElement('p');missing.className='authority-unavailable';
   missing.textContent=data.reason+' This does not mean no government institution is responsible.';
   content.append(missing);
 }else{
   const record=data.entry;
   const scope=document.createElement('strong');scope.textContent=record.scope;
   const intro=document.createElement('p');intro.textContent=record.summary;
   const date=document.createElement('p');date.className='authority-period';date.textContent=data.timeNote;
   const list=document.createElement('dl');
   for(const role of record.roles){
     const dt=document.createElement('dt');dt.textContent=role.label;
     const dd=document.createElement('dd');dd.textContent=role.detail;
     list.append(dt,dd);
   }
   const caution=document.createElement('p');caution.className='authority-caveat';caution.textContent=record.limit;
   const sources=document.createElement('div');sources.className='authority-sources';
   for(const src of record.sources){
     const link=document.createElement('a');
     link.href=src.url;link.textContent=src.title+' ↗';link.rel='noopener noreferrer';
     link.target='_blank';sources.append(link);
   }
   content.append(scope,intro,date,list,caution,sources);
 }
 // These are official *reported expenditure* figures, not responsibility/control shares.
 const reporting=document.createElement('section');reporting.className='institutional-report';
 const heading=document.createElement('h4');heading.textContent='Where does government record this spending?';
 reporting.append(heading);
 const rec=sectorSpendingFor(institutionalSnapshot,activeCountry,Number(year),code);
 if(rec){
   const intro=document.createElement('p');
   intro.textContent='Eurostat '+year+' · € million. Accounting sectors, not a list of budget decision-makers.';
   const sectorList=document.createElement('dl');sectorList.className='institutional-sector-list';
   for(const sector of SECTORS){
     const dt=document.createElement('dt');dt.textContent=sector.label;
     const explainer=document.createElement('small');explainer.textContent=sector.help;
     dt.append(explainer);
     const dd=document.createElement('dd');
     const value=rec.sectors[sector.code];
     dd.textContent=value?'€'+formatNumber(value.eurMillion,1)+' million'+
        (value.flags?' (Eurostat flags: '+value.flags+')':''):'Not reported or not applicable';
     sectorList.append(dt,dd);
   }
   const caveat=document.createElement('p');caveat.className='authority-caveat';
   caveat.textContent='These sector figures cannot be added to recreate the national total: transfers between public bodies are consolidated in the national figure. They do NOT show which authority controls the funding.';
   const full=document.createElement('p');
   full.textContent='Consolidated national total for this function: €'+formatNumber(rec.s13EurMillion,1)+' million. Do not sum subsectors or interpret their amounts as shares of decision-making authority.';
   const source=document.createElement('a');source.href=SECTOR_SOURCE;source.target='_blank';source.rel='noopener noreferrer';
   source.textContent='Eurostat original expenditure table ↗';
   const method=document.createElement('a');method.href=SECTOR_METHOD;method.target='_blank';method.rel='noopener noreferrer';
   method.textContent='Official explanation of transfers and consolidation ↗';
   reporting.append(intro,sectorList,full,caveat,source,method);
 }else{
   const unavailable=document.createElement('p');
   unavailable.textContent=institutionalError?'Official Eurostat institutional data could not be loaded: '+institutionalError
      :institutionalSnapshot?'No matched published Eurostat sector figures for '+activeCountry+', '+year+', '+code+'.'
      :'Loading official Eurostat sector figures…';
   reporting.append(unavailable);
 }
 const budget=document.createElement('p');budget.className='authority-manager-gap';
 budget.textContent='Largest budget manager: Not yet verified from comparable official institution-level accounts. This figure cannot be inferred from the reporting sectors above.';
 reporting.append(budget);
 const portal=budgetPortalFor(activeCountry);
 if(portal){
   const sourceLink=document.createElement('a');sourceLink.href=portal.url;
   sourceLink.target='_blank';sourceLink.rel='noopener noreferrer';
   sourceLink.textContent='Official national budget documents: '+portal.label+' ↗';
   const scopeNote=document.createElement('small');scopeNote.textContent=portal.scope;
   reporting.append(sourceLink,scopeNote);
 }
 content.append(reporting);
 card.append(trigger,content);
 return card;
}
function breakdownRow(item,amount,curr){
 const row=document.createElement('div');row.className='breakdown-row';
 const square=document.createElement('span');square.className='square';square.style.background=item.color;square.setAttribute('aria-hidden','true');
 const main=document.createElement('div'),labelNode=document.createElement('div');labelNode.className='breakdown-label';
 const title=document.createElement('b');title.textContent=item.label;labelNode.append(title);
 const help=categoryInfo(item);if(help)labelNode.append(help);
 if(amount!=null){const small=document.createElement('small');small.textContent=formatMoney(item.allocated,curr);labelNode.append(small)}
 const track=document.createElement('div');track.className='bar-track';const fill=document.createElement('div');fill.className='bar';fill.style.background=item.color;fill.style.width=formatPct(item.share);track.append(fill);main.append(labelNode,track,authorityDetails(item.code));
 const pct=document.createElement('div');pct.className='pct';pct.textContent=formatPct(item.share);
 row.append(square,main,pct);return row;
}
function renderGlance(entry){
 const leaders=el('glance-leaders');leaders.replaceChildren();
 for(const leader of spendingLeaders(entry)){
   const card=document.createElement('div');card.className='glance-leader';
   const value=document.createElement('strong');value.className='glance-value';value.textContent=leader.perHundred.toFixed(1)+'%';
   const label=document.createElement('span');label.textContent=leader.label;
   const help=categoryInfo(leader);if(help)label.append(help);
   card.append(value,label);leaders.append(card);
 }
 el('glance-country-year').textContent=label(activeCountry)+' · '+entry.year;
 const current=economicForYear(economicSnapshot,activeCountry,entry.year);
 const prior=economicForYear(economicSnapshot,activeCountry,entry.year-1);
 const observations=observationsForCountry(entry,current,prior,[]).slice(0,2);
 const list=el('glance-observations');list.replaceChildren();
 for(const observation of observations){
   const article=document.createElement('details');article.className='glance-observation insight-card';
   const summary=document.createElement('summary');summary.className='insight-summary';
   const heading=document.createElement('strong');heading.textContent=observation.title;
   const text=document.createElement('span');text.textContent=observation.text;
   summary.append(heading,text);
   const evidence=document.createElement('div');evidence.className='insight-evidence';
   const why=document.createElement('p');why.textContent=observation.qualifier;
   const source=document.createElement('small');source.textContent='Source: '+observation.source+' · '+observation.year;
   evidence.append(why,source);
   article.append(summary,evidence);list.append(article);
 }
 el('glance-observations-caption').textContent=observations.length?'Facts to explore, not a rating of government policy.':'Historical comparisons are not available for this year.';
}
function updateContributionControls(){
  if(activeCountry!=='CZ') contributionMode='manual';
  modeEl.value=contributionMode;
  for(const option of modeEl.options) option.disabled=option.value==='salary'&&activeCountry!=='CZ';
  toggle('salary-fields',contributionMode==='salary'&&activeCountry==='CZ');
  toggle('manual-fields',contributionMode==='manual');
  toggle('other-countries-note',activeCountry!=='CZ');
}
/** Never persist household selections in URLs, storage or network requests. */
function renderChildZtpInputs(){
  const count=Number(childrenEl.value);
  childZtpSelection=Array.from({length:count},(_,index)=>childZtpSelection[index]||false);
  childZtpEl.replaceChildren();toggle('child-ztp-fields',count>0);
  if(count===0)return;
  const note=document.createElement('p');note.className='field-hint';note.textContent='Select any child with a ZTP/P card. The order is the benefit order you claim, not necessarily birth order.';childZtpEl.append(note);
  for(let i=0;i<count;i++){
    const label=document.createElement('label');label.className='check-field';
    const check=document.createElement('input');check.type='checkbox';check.checked=childZtpSelection[i];
    check.addEventListener('change',()=>{childZtpSelection[i]=check.checked;if(snapshot)refreshCountry()});
    const title=document.createElement('span');title.textContent=`Child ${i+1} has ZTP/P (doubles this child’s credit)`;
    label.append(check,title);childZtpEl.append(label);
  }
}
function currentHousehold(){return {
  children:Number(childrenEl.value),childZtp:[...childZtpSelection],
  spouse:spouseEl.value,disability:disabilityEl.value,ownZtp:ownZtpEl.checked,
}}
function renderPayroll(receipt){
  toggle('payroll-panel',!!receipt);
  if(!receipt)return;
  const amounts={
    'payroll-gross':receipt.grossAnnual,
    'payroll-net':receipt.netAnnual,
    'payroll-income':receipt.incomeTax,
    'payroll-social':receipt.employeeSocial,
    'payroll-health':receipt.employeeHealth,
    'payroll-total':receipt.totalEmployee,
    'payroll-employer':receipt.employerSocial+receipt.employerHealth,
    'payroll-other-credits':receipt.householdCreditsApplied.spouse+receipt.householdCreditsApplied.disability+receipt.householdCreditsApplied.ztp,
    'payroll-child-credit':receipt.householdCreditsApplied.children,
    'payroll-child-bonus':receipt.childTaxBonus,
  };
  for(const [id,value] of Object.entries(amounts))el(id).textContent=formatMoney(value,'CZK');
  el('payroll-year').textContent=receipt.year;
  el('payroll-rate').textContent=formatPct(receipt.effectiveEmployeeRate);
  const adjustment=receipt.annualSettlementAdjustment;
  el('payroll-caveat').textContent=`Full-year, single-employer estimate with self-declared household eligibility. Estimated tax settlement vs advances assuming ONLY the basic credit was applied monthly: ${formatMoney(adjustment,'CZK')} (negative means refund). The child tax bonus is added to net pay and is not counted as a tax deduction. Partial-year reliefs and exceptional cases excluded.`;
}
function currentContribution(){
  toggle('salary-error',false);
  renderPayroll(null);
  if(contributionMode==='salary'&&activeCountry==='CZ'){
    const raw=grossEl.value.trim();
    if(!raw)return {amount:null,kind:'salary'};
    try {
      const receipt=calculateCzechEmployee({grossAnnual:Number(raw),year:Number(taxYearEl.value),household:currentHousehold()});
      renderPayroll(receipt);
      return {amount:basisEl.value==='income'?receipt.incomeTax:receipt.totalEmployee,kind:'salary',receipt};
    }catch(error){
      el('salary-error').textContent=error.message;
      toggle('salary-error',true);
      return {amount:null,kind:'invalid'};
    }
  }
  const raw=amountEl.value.trim();
  if(!raw)return {amount:null,kind:'manual'};
  const amount=Number(raw);
  const valid=Number.isFinite(amount)&&amount>=0;
  amountEl.setCustomValidity(valid?'':'Please enter a nonnegative tax amount.');
  return {amount:valid?amount:null,kind:valid?'manual':'invalid'};
}
function refreshCountry(){
  const name=label(activeCountry),curr=currency(activeCountry);
  el('currency-label').textContent=`(${curr})`;
  updateContributionControls();
  const entry=year?snapshot.entries[`${activeCountry}-${year}`]:null;
  el('result-title').firstChild.textContent=`${countryFlag(activeCountry)} ${name} `;
  renderCountryNotes(activeCountry,year);
  if(window.location.hash)revealLinkedSection();
  el('result-year').textContent=year||'';
  if(!entry){toggle('results',false);toggle('error',true);el('error').textContent=`No complete, reconcilable spending data is available for ${name}. Try another country or year.`;renderCompare();return;}
  toggle('error',false);toggle('results',true);
  const contribution=currentContribution();
  const amount=contribution.amount;
  const withAmount=amount!==null;
  const allocations=allocate(snapshot,activeCountry,year,withAmount?amount:0).sort((a,b)=>b.share-a.share);
  donut(allocations);
  const billions=entry.eurMillion/1000;
  el('donut-number').textContent=formatNumber(billions,billions>=100?0:1);
  el('donut-unit').textContent='billion EUR';
  el('summary-number').textContent=`€${formatNumber(entry.eurMillion,1)} million`;
  el('summary-kicker').textContent=withAmount?'Official national total':'Reported total expenditure';
  el('breakdown-caption').textContent=withAmount?`Illustrative allocation of ${formatMoney(amount,curr)} · spending year ${year}`:'Share of public expenditure, by COFOG function';
  el('allocation-note').textContent=withAmount?(contribution.kind==='salary'?`Illustration only: ${formatMoney(amount,curr)} is estimated for Czech tax year ${taxYearEl.value} (${basisEl.value==='income'?'income tax after applicable household credits (child bonus excluded)':'income tax plus employee social and health contributions (refundable child bonus excluded)'}). Spending shares use ${year}. Social and health contributions have their own financing arrangements; this is not an actual flow of your payments.`:`Illustration only: ${formatMoney(amount,curr)} is the amount you entered. Shares are pro-rata estimates, not traced payments.`):'Figures represent shares of consolidated general-government spending, not actual earmarked individual tax payments.';
  renderGlance(entry);
  const makeRow=x=>breakdownRow(x,withAmount?amount:null,curr);
  // The outer "Explore all spending categories" disclosure is the only gate:
  // render every reconciled COFOG category when the card opens, without a second click.
  el('breakdown').replaceChildren(...allocations.map(makeRow));
  el('flags').textContent=entry.flags.length?`Statistical flags: ${entry.flags.join(', ')} (see Eurostat for definitions)`:'Reported complete dataset; no observation flags in this selection.';
  el('data-link').href=EUROSTAT_PAGE;
  el('result-subtitle').textContent=`All government levels and social-security funds · ${year} · ten spending categories`;
  renderPensions(entry,withAmount?amount:null,curr);
  renderCompare();
  renderEconomicContext();
}

/** Reviewed national accounting context, scoped to selected jurisdiction. */
/** One-level country detail: official state-budget chapters (not COFOG authorities). */
function renderCzechStateBudgetLedger(container){
 const section=document.createElement('section');section.className='cz-chapter-section';
 section.id='cz-2024-state-budget-chapters';
 const heading=document.createElement('h3');heading.textContent='Where did the 2024 Czech state budget go?';
 const description=document.createElement('p');description.textContent=
   '48 official state-budget chapters · actual expenditure · CZK '+formatNumber(CZ_2024_CHAPTER_TOTAL_THOUSAND_CZK/1e6,1)+
   ' billion. The chapter administrator reports these expenses; that is not proof they independently decided every payment.';
 const warning=document.createElement('p');warning.className='cz-chapter-warning';
 warning.textContent='This is the STATE budget (cash accounting), not Eurostat’s whole-government COFOG total. Chapter spending can include transfers to municipalities or other bodies. Do not add it to the Eurostat figures or assign a whole chapter to one spending category.';
 const wrap=document.createElement('div');wrap.className='cz-chapters-scroll';
 const table=document.createElement('table');table.className='cz-chapters-table';
 const caption=document.createElement('caption');caption.textContent='Czech state budget chapter actual spending in 2024, largest first; rounded to 0.1 billion CZK';
 const thead=document.createElement('thead'),tr=document.createElement('tr');
 for(const name of ['Budget chapter / administrator','Actual spending (CZK bn)']){
   const th=document.createElement('th');th.scope='col';th.textContent=name;tr.append(th);
 }
 thead.append(tr);
 const tbody=document.createElement('tbody');
 for(const chapter of czechChaptersSorted()){
   const row=document.createElement('tr');
   const name=document.createElement('th');name.scope='row';name.textContent=chapter.id+' · '+chapter.name;
   const amount=document.createElement('td');amount.textContent=formatNumber(chapter.actualThousandCzk/1e6,1);
   row.append(name,amount);tbody.append(row);
 }
 table.append(caption,thead,tbody);wrap.append(table);
 const source=document.createElement('a');source.href=CZ_2024_STATE_ACCOUNT_SOURCE.url;
 source.rel='noopener noreferrer';source.target='_blank';source.textContent='Original Ministry of Finance final accounts — Book G, Table 7, page 32 ↗';
 const detail=document.createElement('a');detail.href='./docs/countries/cz-budget-chapters-2024.md';
 detail.textContent='What these chapters prove, and what remains unverified ↗';
 section.append(heading,description,warning,wrap,source,detail);
 container.append(section);
}

function renderCountryNotes(code,spendingYear){
  const notes=countryNotesFor(code);
  const chapters=czechChapterData(code,spendingYear);
  toggle('country-context',notes.length>0||!!chapters);
  const list=el('country-context-list');list.replaceChildren();
  if(notes.length===0&&!chapters)return;
  el('country-context-country').textContent=label(code);
  el('country-context-teaser').textContent=chapters
    ?'48 verified 2024 state-budget chapters · '+notes.length+' national note'+(notes.length===1?'':'s')
    :notes.length===1?'1 country-specific note · Tap for context':notes.length+' country-specific notes · Tap for context';
  if(chapters)renderCzechStateBudgetLedger(list);
  for(const note of notes){
    const article=document.createElement('article');article.className='country-note';
    article.dataset.noteId=note.id;article.id='country-note-'+note.id;
    const meta=document.createElement('div');meta.className='country-note-meta';meta.textContent=note.status;
    const heading=document.createElement('h3');heading.textContent=note.title;
    const body=document.createElement('p');body.textContent=note.summary;
    const period=document.createElement('p');period.className='country-note-period';period.textContent=notePeriodDescription(note,spendingYear,code==='CZ'?Number(taxYearEl.value):null);
    const caveat=document.createElement('p');caveat.className='country-note-caveat';caveat.textContent=note.caveat;
    const details=document.createElement('div');details.className='country-note-details';
    if(note.topic==='employee-tax-model' && code==='CZ'){
      const y=Number(taxYearEl.value),rules=CZ_RULES[y];
      if(rules){
        const h=document.createElement('h4');h.textContent='Parameters for tax year '+y;
        const dl=document.createElement('dl');dl.className='country-note-rules';
        for(const [label,value] of [
          ['Annual threshold for 23% income tax',rules.annualHigherRate],
          ['Annual social insurance assessment cap',rules.maxSocialBase],
          ['Minimum income for annual child tax bonus',rules.minimumAnnualBonusIncome],
        ]){
          const dt=document.createElement('dt');dt.textContent=label;
          const dd=document.createElement('dd');dd.textContent=formatMoney(value,'CZK');
          dl.append(dt,dd);
        }
        details.append(h,dl);
      }
    }
    for(const item of note.details||[]){
      const h=document.createElement('h4');h.textContent=item.title;
      const para=document.createElement('p');para.textContent=item.body;
      details.append(h,para);
    }
    const sources=document.createElement('div');sources.className='country-note-links';
    if(note.detailPage){
      const detail=document.createElement('a');detail.href=note.detailPage;
      detail.textContent='Read the detailed national accounting explanation ↗';
      sources.append(detail);
    }
    for(const src of note.sources){
      const a=document.createElement('a');a.href=src.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=src.label+' ↗';
      sources.append(a);
    }
    const more=document.createElement('details');more.className='country-note-more';
    const summary=document.createElement('summary');summary.textContent='Show complete rules and original sources';
    more.append(summary,details,sources);
    const card=document.createElement('details');card.className='country-note-card';
    card.id=article.id;article.removeAttribute('id');
    const opener=document.createElement('summary');opener.className='country-note-card-summary';
    const shortTitle=document.createElement('strong');shortTitle.textContent=note.title;
    const shortMeta=document.createElement('small');shortMeta.textContent=note.sourcePeriod;
    opener.append(shortTitle,shortMeta);
    article.append(meta,heading,body,period,caveat,more);
    card.append(opener,article);
    list.append(card);
  }
}

function renderPensions(entry, amount, curr) {
  const result=pensionTransparency(entry,amount);
  toggle('pension-unavailable',!result);
  toggle('pension-metrics',!!result);
  el('pension-year').textContent=String(entry.year);
  el('pension-teaser').textContent=result
    ?formatPct(result.publicShare)+' of public spending · '+entry.year+' · See what it covers'
    :'No comparable old-age breakdown available for '+entry.year;
  if(!result)return;
  el('pension-total').textContent='€'+formatNumber(result.combinedEurMillion,1)+' million';
  el('pension-share-total').textContent=formatPct(result.publicShare);
  el('pension-share-social').textContent=formatPct(result.socialShare);
  el('pension-old-age').textContent='€'+formatNumber(result.oldAgeEurMillion,1)+' million';
  el('pension-survivors').textContent='€'+formatNumber(result.survivorsEurMillion,1)+' million';
  toggle('pension-allocation',result.totalAllocated!==null);
  if(result.totalAllocated!==null)
    el('pension-allocation').textContent='Of your illustrative contribution: '+formatMoney(result.totalAllocated,curr)+' corresponds proportionally to these two categories.';
}

function renderEconomicContext(){
 const y=Number(year),geo=activeCountry;
 el('economic-country').textContent=label(geo);
 el('economic-year').textContent=year||'—';
 const entry=economicForYear(economicSnapshot,geo,y);
 const prior=economicForYear(economicSnapshot,geo,y-1);
 const noFloor=NO_NATIONAL_MINIMUM_WAGE.includes(geo);
 const pct=n=>Number.isFinite(n)?(n>0?'+':'')+n.toFixed(1)+'%':'Not available';
 const val=n=>Number.isFinite(n)?formatNumber(n,1):'Not available';
 el('econ-inflation').textContent=pct(entry?.inflation);
 const incomeChangeForTeaser=economicGrowth(entry?.disposableIncomeIndex,prior?.disposableIncomeIndex);
 const preview=[];
 if(Number.isFinite(entry?.inflation))preview.push('Prices '+pct(entry.inflation));
 if(Number.isFinite(incomeChangeForTeaser))preview.push('Household income after inflation '+pct(incomeChangeForTeaser));
 el('economic-teaser').textContent=preview.length
   ?String(y)+' · '+preview.join(' · ')
   :'Historical indicators not available for '+y+' · Open to check the sources';
 el('econ-wage').textContent=noFloor?'No national statutory minimum':Number.isFinite(entry?.minimumWage)?formatMoney(entry.minimumWage,currency(geo)):'Not available';
 const wageChange=economicGrowth(entry?.minimumWage,prior?.minimumWage);
 el('econ-wage-change').textContent=noFloor?'Collective agreements set sector wages':Number.isFinite(wageChange)?pct(wageChange)+' vs 1 January '+(y-1):'Previous January comparison unavailable';
 const incomeChange=economicGrowth(entry?.disposableIncomeIndex,prior?.disposableIncomeIndex);
 el('econ-real-income').textContent=pct(incomeChange);
 el('econ-income-index').textContent=Number.isFinite(entry?.disposableIncomeIndex)
   ?'Index: '+val(entry.disposableIncomeIndex)+' (2008 = 100). '+explainIncomeIndex(entry.disposableIncomeIndex)
   :'No inflation-adjusted household income index reported for this year.';
 const history=el('economic-history');
 history.replaceChildren();
 const years=Array.from({length:Math.min(5,Math.max(0,y-2020))},(_,i)=>y-Math.min(4,y-2021)+i);
 for(const yr of years){
   const data=economicForYear(economicSnapshot,geo,yr);
   const prev=economicForYear(economicSnapshot,geo,yr-1);
   const tr=document.createElement('tr');
   for(const value of [
     String(yr),
     pct(data?.inflation),
     noFloor?'No national rate':Number.isFinite(data?.minimumWage)?formatMoney(data.minimumWage,currency(geo)):'—',
     noFloor?'—':pct(economicGrowth(data?.minimumWage,prev?.minimumWage)),
     Number.isFinite(data?.disposableIncomeIndex)?val(data.disposableIncomeIndex):'—',
   ]){
     const td=document.createElement('td');td.textContent=value;tr.append(td);
   }
   history.append(tr);
 }
 el('economic-status').textContent=economicError
   ?'Official economic data unavailable: '+economicError
   :!economicSnapshot?'Loading independently sourced context data…'
   :!entry?'No matching economic observations for the selected country/year.'
   :'Independent Eurostat statistical series. The displayed year is not substituted.';
}
/** Published official institutional data, refreshed independently of national laws. */
async function loadInstitutionalSpending(){
 try{
   const response=await fetch('./data/institutional-spending.json',{cache:'no-cache'});
   if(!response.ok)throw Error('published institutional reporting snapshot unavailable (HTTP '+response.status+')');
   institutionalSnapshot=validateSectorSpending(await response.json());
   institutionalError=null;
 }catch(error){
   institutionalSnapshot=null;
   institutionalError=error.message;
 }
 // Redisplay the selected country's official-sector panels with the new source data.
 if(snapshot&&year)refreshCountry();
}
async function loadEconomicContext(){
 try{
   const res=await fetch('./data/economic-context.json',{cache:'no-cache'});
   if(!res.ok)throw Error('historical snapshot not published');
   economicSnapshot=validateEconomicContext(await res.json());
   economicError=null;
 }catch(err){economicError=err.message;economicSnapshot=null;}
 renderEconomicContext();
 const record=year?snapshot?.entries[activeCountry+'-'+year]:null;
 if(record)renderGlance(record);
}

function renderCompare(){
  const other=compare&&year?snapshot?.entries[`${compare}-${year}`]:null;
  const current=year?snapshot?.entries[`${activeCountry}-${year}`]:null;
  const show=!!(compare&&current&&other&&compare!==activeCountry);
  toggle('comparison-panel',show);
  if(!show)return;
  const key=el('compare-key');key.replaceChildren();
  for(const [color,name] of [['#9fd3d7',label(activeCountry)],['#e4b179',label(compare)]]){
    const span=document.createElement('span');const dot=document.createElement('span');dot.className='key-color';dot.style.background=color;span.append(dot,document.createTextNode(name));key.append(span);
  }
  const rows=el('comparison-rows');rows.replaceChildren();
  const scale=Math.max(...current.categories.map(x=>x.share),...other.categories.map(x=>x.share),0.01);
  for(const f of FUNCTIONS){
    const a=current.categories.find(x=>x.code===f.code)?.share||0;
    const b=other.categories.find(x=>x.code===f.code)?.share||0;
    const row=document.createElement('div');row.className='compare-row';const title=document.createElement('span');title.className='compare-label';title.textContent=f.label;
    const help=categoryInfo(f);if(help)title.append(help);
    const tracks=document.createElement('div');tracks.className='compare-tracks';
    for(const [value,color] of [[a,'#7ec8c8'],[b,'#dda773']]){
      const t=document.createElement('div');t.className='compare-track';const fill=document.createElement('div');fill.className='compare-fill';fill.style.width=`${Math.min(100,value/scale*100)}%`;fill.style.background=color;t.append(fill);
      const n=document.createElement('span');n.className='compare-value';n.textContent=formatPct(value);t.append(n);tracks.append(t);
    }
    row.append(title,tracks);rows.append(row);
  }
  // Non-additive cross-country drill-down below the ten COFOG divisions.
  // Both countries must have official GF1002/GF1003 observations.
  if(current.pensionDetail && other.pensionDetail){
    const pA=current.pensionDetail.publicShare;
    const pB=other.pensionDetail.publicShare;
    const row=document.createElement('div');row.className='compare-row pension-compare-row';
    const title=document.createElement('span');title.className='compare-label';
    title.textContent='↳ Old age & survivors (included above)';
    const tracks=document.createElement('div');tracks.className='compare-tracks';
    for(const [value,color] of [[pA,'#7ec8c8'],[pB,'#dda773']]){
      const t=document.createElement('div');t.className='compare-track';
      const fill=document.createElement('div');fill.className='compare-fill';
      fill.style.width=`${Math.min(100,value/scale*100)}%`;fill.style.background=color;t.append(fill);
      const n=document.createElement('span');n.className='compare-value';n.textContent=formatPct(value);t.append(n);tracks.append(t);
    }
    row.append(title,tracks);rows.append(row);
  }
}
function chooseCountry(code){activeCountry=code;contributionMode=code==='CZ'?'salary':'manual';selectYear(year);refreshCountry();updateUrl()}
/** A direct link to an explanation opens every containing native disclosure first. */
function revealLinkedSection(){
 const hash=window.location.hash;
 if(!hash||hash.length<2)return;
 let id;
 try{id=decodeURIComponent(hash.slice(1))}catch{return}
 const target=document.getElementById(id);
 if(!target||target.classList.contains('hidden'))return;
 for(let parent=target;parent;parent=parent.parentElement){
   if(parent.tagName==='DETAILS')parent.open=true;
 }
 if(target.id.startsWith('country-note-')||target.id==='how-it-works'){
   target.scrollIntoView({block:'start',behavior:'auto'});
 }
}
function init(){
  const q=new URLSearchParams(location.search);
  activeCountry=COUNTRIES.some(c=>c.code===q.get('country'))?q.get('country'):'CZ';
  compare=COUNTRIES.some(c=>c.code===q.get('compare'))?q.get('compare'):'';
  renderOptions(countryEl,COUNTRIES.map(c=>({code:c.code,name:`${countryFlag(c.code)}  ${c.name}`})),activeCountry);
  renderOptions(compareEl,[{code:'',name:'No comparison'},...COUNTRIES.map(c=>({code:c.code,name:`${countryFlag(c.code)}  ${c.name}`}))],compare);
  countryEl.addEventListener('change',()=>chooseCountry(countryEl.value));
  contributionMode=activeCountry==='CZ'?'salary':'manual';
  taxYearEl.value=CZ_RULES[Number(q.get('taxYear'))]?q.get('taxYear'):'2024';
  modeEl.addEventListener('change',()=>{contributionMode=modeEl.value;updateContributionControls();if(snapshot)refreshCountry()});
  grossEl.addEventListener('input',()=>{if(snapshot)refreshCountry()});
  taxYearEl.addEventListener('change',()=>{if(snapshot)refreshCountry();updateUrl()});
  basisEl.addEventListener('change',()=>{if(snapshot)refreshCountry()});
  childrenEl.addEventListener('change',()=>{renderChildZtpInputs();if(snapshot)refreshCountry()});
  for(const field of [spouseEl,disabilityEl,ownZtpEl])field.addEventListener('change',()=>{if(snapshot)refreshCountry()});
  renderChildZtpInputs();
  wireInfoBubble(el('income-table-help'));
  yearEl.addEventListener('change',()=>{year=Number(yearEl.value);refreshCountry();updateUrl()});
  compareEl.addEventListener('change',()=>{compare=compareEl.value;renderCompare();updateUrl()});
  amountEl.addEventListener('input',()=>{if(snapshot)refreshCountry()});
  el('reset').addEventListener('click',()=>{
    grossEl.value='';amountEl.value='';basisEl.value='income';taxYearEl.value='2024';
    childrenEl.value='0';childZtpSelection=[];renderChildZtpInputs();spouseEl.value='none';
    disabilityEl.value='none';ownZtpEl.checked=false;
    compareEl.value='';compare='';countryEl.value='CZ';year=2024;chooseCountry('CZ');
  });
  updateContributionControls();
  window.addEventListener('hashchange',revealLinkedSection);
  loadData(Number(q.get('year'))||2024);
  loadEconomicContext();
  loadInstitutionalSpending();
}
async function loadData(preferredYear){
  toggle('loading',true);toggle('error',false);
  let source='snapshot';
  try{
    try{
      const res=await fetch('./data/eu-spending.json',{cache:'no-cache'});
      if(!res.ok)throw new Error(`Snapshot missing: ${res.status}`);
      snapshot=validateSnapshot(await res.json());
    }catch(e){
      source='live API';el('loading-label').textContent='Fetching official data directly from Eurostat…';
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),60000);
      let res;try{res=await fetch(sourceUrl(),{signal:controller.signal,headers:{Accept:'application/json'}})}finally{clearTimeout(timer)}
      if(!res.ok)throw new Error(`Eurostat responded with HTTP ${res.status}`);
      snapshot=validateSnapshot(normalizeEurostat(await res.json()));
    }
    el('loading').classList.add('hidden');selectYear(preferredYear);refreshCountry();updateUrl();
    const stamp=new Date(snapshot.fetchedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    el('data-status').textContent=`Eurostat · ${source} · Retrieved ${stamp} · ${Object.keys(snapshot.entries).length} complete country-year records`;
    el('footer-fetched').textContent=`retrieved ${stamp}`;
  }catch(e){
    toggle('loading',false);toggle('results',false);toggle('error',true);
    el('error').textContent=`Could not load authoritative Eurostat data. The explorer never substitutes fabricated figures. Error: ${e.message}. Check your connection or try again later.`;
    el('data-status').textContent='Source unavailable — no figures displayed';
    console.error('Official data retrieval failed:',e);
  }
}
init();
