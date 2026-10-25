# Project roadmap

The project aims to make official government spending, tax contributions and economic outcomes understandable, reproducible and internationally comparable. **No ranking or individual accounting claim may override source evidence, denominators, years or caveats.**

## Priority 0 — Clear definitions and meaningful responsibility

- [ ] **Plain-language default:** show the three largest spending functions as an amount out of every €100 of public expenditure, plus no more than three neutral, source-backed observations; make all additional figures optional. Tracked in [issue #8](https://github.com/SnakiterWasTaken/taxpayer-receipt/issues/8).
- [ ] **Info bubbles for all 10 COFOG expense categories:** a clearly labelled **(i)** next to each category; hovering, keyboard focusing or tapping reveals everyday examples and the most common source of confusion. Definitions use the **same UN COFOG 1999 classification across countries**, link to the original explanation, and are ready for translation.
- [ ] **Who decides?** For every `country + year + spending category`, eventually explain three distinct roles: **who sets policy**, **who decides/approves funding**, and **who records/delivers the spending**. A single institution may perform several roles; authority can be shared. Tracked in [issue #10](https://github.com/SnakiterWasTaken/taxpayer-receipt/issues/10).
- [ ] **Institutional expenditure breakdown:** investigate Eurostat `gov_10a_exp` S1311 (central), S1312 (regional/state), S1313 (local), S1314 (social security), compared with S13 consolidated totals. Treat missing or inapplicable subsectors explicitly and **validate intergovernmental transfers and consolidation** before publishing percentages.
- [ ] **National authority evidence:** independently verify legislative, appropriation, allocation and execution responsibilities using country/year-specific statutes and official budgets; never infer who **controls** spending solely from the sector or ministry that records it. Do not invent majority decision-makers.
- [ ] **Progressive detail:** show only essential common definitions at a glance; government-sector composition, legal authority, ministry names, time-sensitive national caveats and official evidence live in optional disclosures **only when that country is selected**.
- [ ] **Integrity and accessibility:** mouse hover, touch tap, keyboard focus and screen readers; no unsupported claims that spending level indicates efficiency, corruption or quality. Verify the examples against [UN COFOG](https://unstats.un.org/unsd/classifications/cofog/revision) and [OECD group definitions](https://www.oecd.org/en/publications/government-at-a-glance-2025_0efd0bcd-en/full-report/classification-of-the-functions-of-government-cofog_16aa2337.html).
- [ ] **Localisation:** translate the category help, authority roles, source descriptions and national notes into all 24 official EU languages without changing numbers, years or country filtering.

**Governing rules:** methodology common to all countries; national specifics only in the selected country's context; clarity first and evidence-rich detail on demand. See [PROJECT_PRINCIPLES.md](PROJECT_PRINCIPLES.md).

## Delivered foundations

- [x] EU-27 government spending explorer using Eurostat S13 COFOG data; official source provenance, strict reconciliation, historical years and comparison.
- [x] Czech employee and household tax estimator (2024–2026), independently scoped and visibly labelled as an estimate.
- [x] Eurostat GF1002 Old age and GF1003 Survivors drill-down within (not added to) GF10.
- [x] French civil-service pensions financing explanation, with source years and accounting-scope caveats.
- [x] Eurostat economic-context trends: HICP inflation, statutory minimum wage where applicable, real household disposable income per person.
- [x] Separate reviewed national accounting notes from the EU-wide methodology, displayed only for the selected jurisdiction.
- [x] EUROMOD release monitoring and integration scaffolding; **actual Czech policy parity has not yet been established**.

## Priority 1 — National accounting and statistical integrity

- [ ] Expand national notes by source-verified country and topic, not by automatic speculation.
- [ ] Create a neutral, structured note schema with language-independent IDs, jurisdiction, affected years, reference period, scope, status (planned vs actual), source references, review metadata, and affected statistical concepts.
- [ ] Separate facts, official accounting treatment, independent methodological critiques and hypothetical counterfactuals.
- [ ] For French pensions, add source-line-level reconciliation of ministry budgets vs CAS Pensions, with explicit non-double-counting tests (tracked in issue #2).
- [ ] Audit continuity and scope of harmonised international statistics when national financing arrangements differ.
- [ ] Preserve previously published source versions where licensing and archive access permit, so revisions are inspectable.

## Priority 2 — Localisation for every EU country's languages

**Coverage objective: every page, visible datum/label, calculator and national note can be read in the languages used across EU member countries.** Launch with the **24 official EU languages** as the minimum supported language set and plan additional officially recognised national/regional languages (for example, where a country's residents use more than one language). A country is not equivalent to a language: a Belgian resident should be able to select French, Dutch or German, and a Czech resident should be able to browse France in Czech.

Official EU locales (BCP 47 language subtags): **bg, cs, da, de, el, en, es, et, fi, fr, ga, hr, hu, it, lt, lv, mt, nl, pl, pt, ro, sk, sl, sv**.

### Implementation stages

1. **Extract all public-facing strings** into language-neutral keys and separate locale catalogs. Include UI controls, validation messages, legends and tooltips, chart accessibility descriptions, source and footnote labels, salary/household inputs, tax relief explanations, methodology pages, economic context, pension notes, country-specific disclosures, status/error messages, README-derived help content and generated report templates.
2. **Localise structured statistical descriptions**, not raw numbers: country names, COFOG headings, social categories, economic indicator definitions, tax-policy parameter names, accounting note metadata and publication statuses. Official source URLs stay intact; link labels and excerpts can be translated and must retain original-language/source attribution.
3. **Implement language selection independent of country selection**; optionally suggest a visitor language from browser settings without overriding an explicit choice. Permit `?lang=fr` deep links alongside `?country=CZ&year=2024`. Default to English only when a reviewed translation is genuinely unavailable, with an explicit fallback indicator.
4. **Locale-aware formatting**: dates, currencies, decimals, digit-grouping, pluralisation and grammatical gender/cases using `Intl` and message-format tooling. Preserve tax calculations and COFOG values numerically across all locales.
5. **Complete translated pages**, not merely front-page labels: methodology, economic-context definitions, pensions, country dossiers and every newly created explanatory page. Use stable URLs or route identifiers, locale-aware metadata and page `lang` attributes, navigation, search indexing and correct hreflang equivalents.
6. **Translation workflow**: version each catalog alongside code; allow open-source community contributions and review by native speakers and, for fiscal/legal terminology, qualified subject-matter reviewers. Label machine translations as unreviewed; do not silently publish them as authoritative.
7. **CI quality gates**: required-key coverage per locale; placeholder and plural checks; no unlocalised user-visible strings; forbidden markup or malicious URL injection; fallbacks tested; visual regression for long translations, mobile, diacritics and accessibility. Numbers and eligibility outcomes must be invariant when switching languages.
8. **Future national/regional coverage**: extend beyond the 24 EU official languages where relevant to residents; keep the format and language registry open-ended rather than hard-coding one language per member state.

**Definition of done:** Every public route, data label and country note is localisable; each declared fully supported language has 100% reviewed user-facing string coverage (including data explanations and accessible labels), passes automated integrity tests, and keeps underlying numeric outcomes unchanged. Partial/unreviewed translations are labelled explicitly.

## Priority 3 — Tax-model coverage and updates

- [ ] Validate Czech 2024–2026 worked examples against actual EUROMOD training simulations; document deviations.
- [ ] Add verified standard-employee models country by country, then household benefits and specialist regimes with explicit coverage badges.
- [ ] Automate policy-release monitoring and source-supported pull requests; human-review substantive legislative or eligibility changes.
- [ ] Include model versions, source years, correction history and verification status with every estimate.

## Priority 4 — Economic outcomes and sustainability

- [ ] Add median real disposable income, housing affordability, inequality, poverty, employment and public finances (issue #4).
- [ ] Provide selectable historical baselines for compounded inflation and comparable real-wage changes.
- [ ] Distinguish cross-country PPS income-level comparisons from within-country index trends.
- [ ] Show age structure, dependency ratios, deficit, debt and interest costs where reliable.
- [ ] Do not publish simplistic country 'policy goodness' scores or assert causation from contemporaneous indicators.

## Operational principles

Official data is refreshed automatically and fails closed when incomplete or inconsistent. Personal salary/household inputs remain client-side. All sources, selected reporting years, provenance, classifications and gaps are visible. Changes to accounting assumptions are separately flagged, audited and never silently mixed with raw statistical totals.
