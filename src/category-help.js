/**
 * Common COFOG 1999 descriptions, independent of country and accounting year.
 * These are classification examples; NOT evidence of spending on each item.
 * Locale-neutral IDs must be reused when internationalising UI strings.
 * Source: OECD Government at a Glance 2025 COFOG first/second-level table,
 * cross-checked against UN Statistics Division COFOG explanatory notes.
 */
export const CATEGORY_HELP_SOURCE="https://www.oecd.org/en/publications/government-at-a-glance-2025_0efd0bcd-en/full-report/classification-of-the-functions-of-government-cofog_16aa2337.html";
export const CATEGORY_HELP=Object.freeze({
  "GF01": {
    "summary": "Running government-wide services.",
    "examples": "Parliament and elections, tax offices, diplomacy, official statistics, basic research and public-debt interest.",
    "not": "Ordinary road repairs, hospitals or schools are normally classified elsewhere."
  },
  "GF02": {
    "summary": "Protecting the country from military threats.",
    "examples": "Armed forces, defence equipment, military facilities and civil-defence activities.",
    "not": "Local police and courts belong to Public order and safety."
  },
  "GF03": {
    "summary": "Keeping people safe and enforcing the law.",
    "examples": "Police, fire brigades, courts, prisons and related public-safety services.",
    "not": "Military defence has its own category."
  },
  "GF04": {
    "summary": "Supporting transport, work and the wider economy.",
    "examples": "Building and repairing roads, bridges and railways; public transport, energy, agriculture and employment programmes.",
    "not": "Street lighting is normally under Housing and community amenities; waste collection is under Environmental protection."
  },
  "GF05": {
    "summary": "Protecting the environment and handling pollution.",
    "examples": "Waste collection and treatment, wastewater, air and water pollution controls, habitat and biodiversity protection.",
    "not": "Routine road construction belongs to Economic affairs."
  },
  "GF06": {
    "summary": "Maintaining and developing places where people live.",
    "examples": "Public housing programmes, community development, water supply and street lighting.",
    "not": "Road building is normally in Economic affairs; environmental clean-up is in Environmental protection."
  },
  "GF07": {
    "summary": "Providing and supporting healthcare.",
    "examples": "Hospital treatment, doctors and outpatient clinics, medicines, vaccinations, disease prevention and health services.",
    "not": "Care can be funded publicly even when a private provider delivers it."
  },
  "GF08": {
    "summary": "Supporting culture, sport and community life.",
    "examples": "Libraries, museums, public sporting facilities, cultural programmes, public broadcasting and some community or religious services.",
    "not": "Ordinary school teaching belongs to Education."
  },
  "GF09": {
    "summary": "Educating people from early years to university.",
    "examples": "Nurseries and preschools, schools, vocational training, universities and services that support education.",
    "not": "Cash family or child benefits belong to Social protection."
  },
  "GF10": {
    "summary": "Supporting people through age, illness or hardship.",
    "examples": "Old-age and survivors’ benefits, disability support, unemployment benefits, family and child assistance, and social housing support.",
    "not": "Hospital treatment and other healthcare belong to Health."
  }
});
export function helpForCategory(code){return CATEGORY_HELP[code]??null;}
