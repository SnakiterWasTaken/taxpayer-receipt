# Project principles — Where Do My Taxes Go?

These are non-negotiable architectural and editorial rules for the entire project, not optional design preferences.

## 1. Common methodology, independent of country

- Public cross-country methodology covers **only definitions, calculations, provenance, validation, limitations and comparison standards common to all jurisdictions**.
- The selected country owns its **national tax rules, eligibility, pension financing conventions, accounting disputes, national policy notes and country-specific source explanations**. Such content must appear **on that country's main explorer view**, not in shared methodology and not when another country is selected.
- Detailed country-specific technical specifications may live in separate source documents but must be reached through the selected country's context. Language selection is independent of country selection.
- There are no unverified national conclusions. The absence of a note never signifies the absence of a problem.

## 2. Immediate comprehension before granularity

A first-time visitor with no tax or financial training should be able to understand, without scrolling through technical notes:

1. Which country and expenditure year they're viewing.
2. Where the largest portions of public money go, in clear labels and easy-to-compare proportions.
3. A small number of **source-supported observations worth examining**, with the exact reference period and a clear reason to inspect them.

The default view must not require personal salary, tax knowledge, glossary use or manual calculation. It must work on mobile and with a keyboard/screen reader.

## 3. Progressive disclosure

- **At a glance (default):** simple proportion examples (such as '€32 out of each €100 spent'), the main categories, at most a few neutral, source-backed context observations.
- **Explore more (opt-in):** all COFOG functions, pension subfunctions, household purchasing-power history, comparisons, personal-tax calculation, national accounting details, tax/legal caveats, source tables and technical methodology.
- All detailed content and original sources remain accessible and searchable; hiding detail by default must never mean deleting it.
- Prefer native accessible disclosures or equivalent controls, clear headings, explicit units and purposeful whitespace. Avoid inaccessible hover-only explanations and bright warning badges.

## 4. Evidence before judgement

- Never automatically label a government, country, policy or spending category 'good', 'bad', 'ridiculous' or 'efficient' based only on expenditure share.
- Distinguish **facts**, **context**, **questions requiring investigation**, **official accounting conventions**, **contested interpretations** and **hypothetical adjustments**.
- A context signal must identify its source indicator, **country**, **reference year**, units/denominator and factual comparison; do not claim that concurrent inflation, income changes and fiscal policy have a causal relationship.
- Never infer a pension 'crisis' or government waste solely from a high pension share. Where published evidence identifies a funding deficit or demographic pressure, report the measured metric and its scope separately.
- Don't fill missing values, infer a reassuring rating, or silently replace old years with newer data.
- Avoid comparing incompatible national accounts, budget years, benefits definitions, currencies or PPP units.

## 5. Accessible worldwide within the EU

- Full coverage in all 24 official EU languages is a delivery target (additional national and regional languages should follow).
- Locale changes never affect numeric calculations or country filtering.
- Plain language is the primary voice; source terminology can appear in an expandable definition or methodology.
- Maintain consistent source links, effective years, original-language citations, accessible chart text and understandable legends.

## 6. Implementation and review requirements

- The main page defaults to an understandable overview without opening detailed disclosures.
- Each country note is filtered by the selected country and includes its own source year(s). No global page embeds national tax rules.
- Each quick insight is derived from verified data and deterministic documented rules, not text hallucination or political scoring.
- Native detail links remain usable with a keyboard and direct links; user-supplied salary/household fields stay in the browser.
- Add tests to prevent **regressions in country filtering, methodology neutrality, source period disclosure, numerical integrity and progressive disclosure**.

**Editorial test:** Could someone who has never studied public finances accurately repeat the two or three key findings after glancing at the page? If not, simplify the first layer rather than remove the underlying evidence.
