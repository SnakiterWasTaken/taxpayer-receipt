import {COUNTRIES,countryFlag} from './config.js';
import {EU_COUNTRY_GEOMETRY} from './eu-map-geometry.js';

const NS='http://www.w3.org/2000/svg';
const node=(name,attrs={})=>{
  const e=document.createElementNS(NS,name);
  for(const [key,value] of Object.entries(attrs))e.setAttribute(key,String(value));
  return e;
};

/**
 * Select a country from a monochrome EU-27 map. Native SVG path contours are
 * the pointer target; national flags are local SVG assets clipped inside each
 * country outline only while hovered/focused or selected. No third-party fetch.
 *
 * The smaller-country buttons and native <select> remain fully keyboard/touch
 * accessible, and the selected country is always described in text.
 */
export function createEuCountryMap(container,{onSelect,selectedCountry}){
  if(!container||typeof onSelect!=='function')throw new TypeError('Map container and onSelect required.');
  const byCode=new Map(COUNTRIES.map(country=>[country.code,country]));
  const selectedText=document.getElementById('eu-map-selected');
  const previewText=document.getElementById('eu-map-preview');
  const selectEl=document.getElementById('country');
  const svg=node('svg',{
    viewBox:'0 0 770 610',role:'group','aria-label':'Select one of the 27 EU countries on the map',
    class:'eu-map-svg',preserveAspectRatio:'xMidYMid meet'
  });
  const defs=node('defs');svg.append(defs);
  const groups=new Map();
  let selected=null;
  let hovered=null;
  const display=code=>byCode.has(code)?countryFlag(code)+' '+byCode.get(code).name:'';
  const setPreview=code=>{
    const name=display(code||selected);
    previewText.textContent=code&&code!==selected
      ?'Pointing to '+name+' · Click, tap or press Enter to view its spending'
      :'Selected: '+name;
  };
  for(const shape of EU_COUNTRY_GEOMETRY){
    if(!byCode.has(shape.code))continue;
    const [x,y,width,height]=shape.bounds;
    const clipId='eu-map-clip-'+shape.code.toLowerCase();
    const clip=node('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'});
    clip.append(node('path',{d:shape.d,'fill-rule':'evenodd'}));defs.append(clip);
    const group=node('g',{
      class:'eu-map-country',role:'button',tabindex:0,
      'aria-label':'Select '+byCode.get(shape.code).name+' on the EU map',
      'data-country':shape.code
    });
    const title=node('title');title.textContent=byCode.get(shape.code).name;group.append(title);
    const land=node('path',{d:shape.d,'fill-rule':'evenodd',class:'eu-map-land'});
    const flag=node('image',{
      href:'./assets/flags/'+shape.code.toLowerCase()+'.svg',
      x,y,width:Math.max(width,.1),height:Math.max(height,.1),
      preserveAspectRatio:'none',
      'clip-path':'url(#'+clipId+')',
      class:'eu-map-flag','pointer-events':'none'
    });
    const outline=node('path',{d:shape.d,class:'eu-map-outline','fill-rule':'evenodd'});
    group.append(land,flag,outline);
    group.addEventListener('pointerenter',()=>{hovered=shape.code;group.classList.add('is-hovered');setPreview(shape.code)});
    group.addEventListener('pointerleave',()=>{hovered=null;group.classList.remove('is-hovered');setPreview(null)});
    group.addEventListener('focus',()=>{group.classList.add('is-hovered');setPreview(shape.code)});
    group.addEventListener('blur',()=>{group.classList.remove('is-hovered');setPreview(hovered)});
    const activate=()=>onSelect(shape.code);
    group.addEventListener('click',activate);
    group.addEventListener('pointerup',event=>{if(event.pointerType==='touch')activate()});
    group.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}
    });
    svg.append(group);groups.set(shape.code,group);
  }
  container.replaceChildren(svg);
  const chips=document.getElementById('eu-map-small-countries');
  const smallCodes=['LU','MT','CY'];
  chips.replaceChildren(...smallCodes.map(code=>{
    const button=document.createElement('button');button.type='button';
    button.className='eu-map-chip';button.dataset.country=code;
    button.textContent=display(code);
    button.addEventListener('click',()=>onSelect(code));
    return button;
  }));
  function setSelected(code){
    if(!byCode.has(code))return;
    selected=code;
    for(const [key,element] of groups){
      element.classList.toggle('is-selected',key===code);
      element.setAttribute('aria-pressed',String(key===code));
    }
    for(const chip of chips.querySelectorAll('button')){
      chip.classList.toggle('is-selected',chip.dataset.country===code);
      chip.setAttribute('aria-pressed',String(chip.dataset.country===code));
    }
    selectEl.value=code;
    selectedText.textContent=display(code);
    setPreview(hovered);
  }
  setSelected(selectedCountry);
  return setSelected;
}
