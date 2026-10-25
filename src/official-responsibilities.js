/**
 * Reviewed examples of PUBLIC legal responsibility. A COFOG function can cover
 * many institutions: these examples never allocate category totals to a body.
 * Entries deliberately describe only the service named in their scope.
 *
 * asOfYear: year in which the cited legal position was reviewed, not a claim
 * that it applied unchanged in every earlier selected Eurostat spending year.
 */
export const OFFICIAL_RESPONSIBILITIES=Object.freeze({
 CZ:Object.freeze({
  GF04:Object.freeze({
   scope:'Road ownership and maintenance — one part of Economic affairs',
   asOfYear:2026,
   summary:'Responsibility depends on which type of road you mean.',
   roles:Object.freeze([
    Object.freeze({label:'Municipality (obec)',detail:'Owns local roads and is responsible for their upkeep. Its elected council approves the municipal budget.'}),
    Object.freeze({label:'Region (kraj)',detail:'Owns second- and third-class roads and is responsible for their upkeep.'}),
    Object.freeze({label:'State',detail:'Owns motorways and first-class roads and is responsible for their upkeep.'}),
   ]),
   limit:'Ownership and maintenance do not identify who decides all Economic affairs spending. Administrative permit authorities may differ from road owners; transfers and delegated work are not apportioned here.',
   sources:Object.freeze([
    Object.freeze({title:'Czech Road Act 13/1997 §9 — official e-Sbírka',url:'https://e-sbirka.gov.cz/sb/1997/13'}),
    Object.freeze({title:'Ministry of the Interior — municipal budgets and council powers',url:'https://mv.gov.cz/organy-obce-a-jejich-kompetence'}),
   ]),
  }),
  GF05:Object.freeze({
   scope:'Municipal household waste collection — one part of Environmental protection',
   asOfYear:2026,
   summary:'Municipalities arrange local household-waste collection under national law.',
   roles:Object.freeze([
    Object.freeze({label:'Municipality (obec)',detail:'Must arrange acceptance of household waste and designate separate collection locations. It may set local waste-system rules through a municipal ordinance.'}),
    Object.freeze({label:'Municipal council',detail:'Approves the municipality’s budget and adopts its generally binding local ordinances.'}),
   ]),
   limit:'This is a verified local waste-service duty, not a claim about all environmental spending, national environment policy, biodiversity or how every waste contractor is funded.',
   sources:Object.freeze([
    Object.freeze({title:'Czech Public Administration Portal — municipal waste system',url:'https://portal.gov.cz/sluzby-vs/svoz-odpadu-S44747'}),
    Object.freeze({title:'Ministry of the Interior — municipal council powers',url:'https://mv.gov.cz/organy-obce-a-jejich-kompetence'}),
   ]),
  }),
  GF09:Object.freeze({
   scope:'Public preschool and compulsory primary-school provision — one part of Education',
   asOfYear:2026,
   summary:'Municipalities must arrange access to primary schooling and specified preschool education.',
   roles:Object.freeze([
    Object.freeze({label:'Municipality (obec)',detail:'Ensures compulsory school attendance can be fulfilled, either by establishing a primary school or arranging schooling with another municipality or association; it also has statutory preschool duties.'}),
    Object.freeze({label:'Municipal council',detail:'Approves the local budget and can establish or close the municipality’s funded organisations.'}),
   ]),
   limit:'This does not assign every school, teacher salary, university or the whole Education function to municipalities. Other education levels and funding streams require separate official verification.',
   sources:Object.freeze([
    Object.freeze({title:'Czech Education Act 561/2004 §178 — official e-Sbírka',url:'https://e-sbirka.gov.cz/sb/2004/561'}),
    Object.freeze({title:'Ministry of the Interior — municipal council powers',url:'https://mv.gov.cz/organy-obce-a-jejich-kompetence'}),
   ]),
  }),
 }),
});
export function responsibilityFor(country,code){
 return OFFICIAL_RESPONSIBILITIES[country]?.[code]??null;
}
export function responsibilityStatus(country,code,selectedSpendingYear){
 const entry=responsibilityFor(country,code);
 if(!entry)return {
   available:false,reason:'No category-wide decision-maker verified by this project yet. Official public records may exist but have not been audited here.'
 };
 return {
   available:true,entry,
   timeNote:Number.isInteger(selectedSpendingYear)&&selectedSpendingYear!==entry.asOfYear
     ?'Official legal responsibilities reviewed as of '+entry.asOfYear+'. The selected spending figures are from '+selectedSpendingYear+'; historical responsibility for that year has not been independently checked.'
     :'Official legal responsibilities reviewed as of '+entry.asOfYear+'. These are responsibilities, not spending-share allocations.',
 };
}
