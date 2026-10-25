# Project roadmap

The project aims to make official government spending, tax contributions and economic outcomes understandable, reproducible and internationally comparable. **No ranking or individual accounting claim may override source evidence, denominators, years or caveats.**

## Priority 0 — Understand spending, then investigate responsibility

- [x] **Understand at a glance:** identify the largest three spending categories, with a percentage of all public spending and up to two source-backed observations. No individual tax calculation is required. Tax inputs and more detailed tables are optional (issue #8).
- [x] **Explain every category:** show an accessible **(i)** bubble beside all ten COFOG categories, containing examples of included services and common misconceptions. Use universal COFOG definitions, the same for every country, ready for translation.
- [ ] **Who decides?** First official-source Czech pilot shipped for roads, municipal waste and primary-school provision, with other categories and countries explicitly unavailable; complete country/year/service authority mappings still pending. Provide a verified country-and-year-specific explanation of who sets rules, who approves/controls the budget, and who actually delivers or records spending for each COFOG category (issue #10). Shared authority must remain visible; don't invent a dominant ministry.
- [x] **Where expenditure is recorded (source-backed first pass):** add an EU27 Eurostat sector-expenditure extraction, country/year/function coverage matrix and conservative accounting labels; national ministries and largest **budget managers remain unverified** until comparable ledger crosswalks are independently reviewed. Original follow-up: investigate Eurostat sector-level `gov_10a_exp` (`S1311` central, `S1312` regional, `S1313` local, `S1314` social security) and validate institutional transfers and S13 reconciliation before publishing any percentages. These are **accounting sectors, not proof of spending autonomy**.
- [ ] **Country-specific policy and budget authority:** source national rules, financing, budget approval and executing institutions separately, with effective dates, references and review metadata. Display these only for the selected country and never mix national specifics into the common methodology.
- [ ] **Evidence, not political scores:** only report verifiable facts, reference periods and denominators; a high share does not by itself demonstrate waste, efficiency or causality.
- [ ] **Multilingual explanations:** translate short category help and deeper institutional notes into the 24 EU official languages, while keeping original source URLs and unchanged calculations.

Definition of done for **Who decides?**: each published claim has a named institution, distinct responsibility (policy, allocation, execution), source and effective year; missing/contested responsibilities are explicitly identified. Display as optional detail, not a wall of text.

See [PROJECT_PRINCIPLES.md](PROJECT_PRINCIPLES.md), the [common UN COFOG classification](https://unstats.un.org/unsd/classifications/cofog/revision), and the [OECD COFOG detail table](https://www.oecd.org/en/publications/government-at-a-glance-2025_0efd0bcd-en/full-report/classification-of-the-functions-of-government-cofog_16aa2337.html).

### Responsive layout reliability

- [ ] Verify that expanding any economic, pension, national note or payroll panel does not change the width of the main explorer on narrow phones.
- [ ] Keep wide statistics tables horizontally scrollable **within their own section**; support long links and translated descriptions without page-level horizontal overflow.
- [ ] Add real mobile-browser smoke testing at 320–430 px viewport widths, plus desktop, to complement static CSS tests and representative fixtures.
- [ ] Document device/browser, failed viewport, expected/actual widths, corrections, test output and any remaining limitations in the [handover journal](docs/TEST_LOG.md).

## Priority 0.2 — Compact expandable information cards

- [x] Convert long spending, pension, national-accounting, economic history and methodology sections into clear, accessible disclosure cards. The closed cards retain meaningful country/year-specific previews.
- [x] Present short, source-backed **What's worth checking?** insights as individually expandable cards: the factual observation remains visible, methodological qualifications and source attribution remain one tap away.
- [x] Keep reviewed country-specific notes inside the selected country's context, with optional deeper explanations and links; preserve tax-calculator deep links to hidden details.
- [x] Preserve country/year selection and the three largest spending areas by default, without removing any data, statistics or official sources.
- [ ] Manually verify mobile tap targets, card focus indicators, direct-link expansion, keyboard-only navigation, and screenshots at representative small and large viewports; record PASS/FAIL/BLOCKED per check in the handover journal.
- [ ] Test comprehension with non-specialist readers and adapt the preview copy before translation into the 24 official EU languages.

**Principle:** each closed card explains *why the visitor might open it*. Never hide all useful information behind generic "learn more" text.

### Source-backed government responsibility pilot

- [x] Add **Who is responsible?** disclosures beside each of the 10 spending categories for the selected country, including an explicit **no verified official public data available** state.
- [x] Ground Czech examples for road maintenance (GF04), municipal household waste (GF05) and preschool/primary provision (GF09) in official public law and Czech government pages. Scope each example narrowly; **not** a claim about the whole spending category.
- [x] Display a prominent **2026 responsibility review date**, distinguished from any selected historical Eurostat expenditure year.
- [ ] Verify official historic authorities in each expenditure year and complete all 10 Czech categories, then extend to other EU countries using official sources only.
- [ ] Independently verify policymaking, appropriations and spending execution; source-based functional mappings alone do not establish who controls most category spending.

Source review and known gaps: [official responsibilities audit](docs/authority-sources.md).

### Priority 0.6 — Reproducible official FIN 2024 institution-level ingestion

- [x] Find direct official Ministry of Finance CSV/ZIP distributions and original Czech open-data catalogue identities for **2024 FIN 2-12 M** municipalities/regions and a **separate Prague** dataset; record them without guessing download URLs.
- [x] Build a read-only GitHub Actions original-source probe: bounded download, archive SHA-256, safe ZIP member validation and first-row CSV schema, with an explicit **BLOCKED** status when the original source cannot be fetched.
- [ ] Download and validate the complete FIN 2-12 M 2024 original data, with exact row counts, organisation IDs, units and transfer classifications. Separate ZIP-schema inspection is **not** this acceptance criterion.
- [ ] Verify Prague magistrate / borough overlap before combining original institution records with other local-government data.
- [ ] Verify official 2024 FIN 1-12 OSS state chapters and FIN 1-12 SF funds original distributions; reconcile state-chapter totals without adding incompatible ESA numbers.
- [ ] Reconcile funding flows, identify which legal institution truly approved and controlled the expenditure, and only then publish a COFOG category's largest budget manager.

Official source, run failures and next steps: [FIN ingestion log](docs/TEST_LOG.md).

### Priority 0.5 — Czech 2024 cash-COFOG transfer reconciliation

- [x] Transcribe and validate the Czech Finance Ministry's official **2024 Government Finance Statistics Table 5**, all ten COFOG functions and eight central/extrabudgetary/social-security/local/transfers columns, without adding it to incompatible Eurostat ESA or the 48-chapter cash ledger.
- [x] Reconcile central + local budgets **after the stated internal transfer eliminations**, with independent 1–2-million-CZK rounding tolerance, and preserve the **-29,741 million CZK asset-sale adjustment** to the official public-budget total.
- [x] Distinguish the **2024 law's municipal council power to approve a budget** from the separate executive power to manage an approved budget (§§84 and 102); explain central grants may constrain local discretion.
- [x] Display these verified Czech cash figures in the **Who decides?** disclosure for each category only when selected country = CZ and year = 2024; no inference of a largest ministry.
- [x] Locate original 2024 government MONITOR **FIN 2-12 M, FIN 1-12 OSS and FIN 1-12 SF** datasets in the official public open-data catalogue.
- [ ] Download and validate **the actual original 2024 FIN transaction records**, document schema, IDs, version, checksums and treatment of Prague/boroughs, then reconcile institutions' cash spending to published MF Table 5.
- [ ] Derive and audit a genuine official 2024 budget-paragraph-to-COFOG classification bridge, check grant/transfer double counting and **then** assess comparable largest institution-level spending authority.
- [ ] Run real mobile tap and full source-link/browser review before marking the UX fully validated.

Audit: [2024 Czech cash COFOG reconciliation](docs/cz-2024-cash-reconciliation.md).

## Priority 0.4 — Actual named institutions and reconciled budget authority

- [x] **2024 Czech government-state budget:** transcribe **all 48 state-budget chapter cash-expenditure outturns** from the Ministry of Finance 2024 final accounts (Book G, Table 7). Require the sum to reconcile **exactly** with the official state-budget total. Show the audited chapter list only when Czechia and spending year 2024 are selected.
- [x] **Clarity:** distinguish budget chapter accounts and their administrators from final legal decision authority or the entire consolidated COFOG amount; label the different accounting bases and transfers, with no invented percentage of category control.
- [ ] Map **Czech 2024 state-budget chapter + functional budget paragraph** to the international COFOG purpose, with an **officially sourced** crosswalk, no inferred ministry-by-category mapping.
- [ ] Obtain and verify **2024 municipal, regional and extra-budgetary institutional accounts** from the Finance Ministry's MONITOR service; reconcile government grants and intergovernmental transfers before attributing amounts.
- [ ] Independently source *who proposes, approves, allocates and independently executes* each mapped expense. Publish a **largest budget manager** only where comparable, complete 2024 observations and legal decision powers support the claim.
- [ ] Apply the same verified actual-expenditure ledger approach to the remaining **26 EU Member States**; an EU-wide sector extraction is not completion of named-manager verification.
- [ ] Verify actual browser and mobile interaction with full 48-row ledger; add regression screenshots with environment and failed attempts to the journal.

Audit and limitations: [Czech 2024 state-budget institution ledger](docs/countries/cz-budget-chapters-2024.md).

## Priority 0.3 — All 27 countries: official sector expenditure and national budget responsibility

- [x] Build and test one reproducible annual **EU27 × 10 COFOG** sector-data sweep from Eurostat, including country-by-country availability, source-year attribution and the four general-government subsectors.
- [x] Preserve the Eurostat rule **S13 consolidated total ≠ sum of the subsectors**, and show actual amounts rather than bogus 'share controlled' percentages.
- [x] Distinguish **not yet reviewed by this project** from **official data unavailable**, with an explicit "largest budget manager not verified" message.
- [x] Add directly reviewed national budget sources for an initial seven countries, clearly labelled as budget portals **not** COFOG/decision-authority crosswalks.
- [ ] For each country's 2024 budget and local-government treasury ledgers, independently verify the institution, spending purpose, approved budget, actual expenditure, decision powers, and intergovernmental transfers before identifying a category's largest manager.
- [ ] Finish official country-specific source discovery for the other 20 countries; do not infer competent ministry from the category's name.
- [ ] Distinguish 2024 legal powers from 2026 reviewed current-law examples. Translate country-specific descriptions and verify historical legal effective dates.
- [ ] Extend direct review from one representative year to every selectable expenditure year and explicitly document revisions.
- [ ] Run a browser-level mobile/keyboard integration test and capture screenshots before describing accessibility as fully verified.

Source coverage, limitations and next individual research tasks: [EU27 source sweep](docs/eu27-authority-sweep.md).

## Priority 0.1 — Test evidence and plain language everywhere

- [x] **Durable handover process:** keep a chronological test and decision journal with each trial, what failed, corrections, retests, open limitations, and next action; add a mandatory PR checklist.
- [x] **Per-test automated reports:** GitHub Actions displays and uploads individual JavaScript/Python test names, outcomes and diagnostics (reports are temporary artifacts; permanently meaningful context belongs in git).
- [x] **Household-income table bubble:** replace the separate index explanation paragraph with a touch/focus/hover (i) button in the history table column itself.
- [x] **Plain-language glossary:** explain terms like real household income index, COFOG, HICP, real vs nominal, current-year comparison and consolidated government, with practical examples and statistical limits.
- [ ] **Audit all technical labels** across country calculators, data warnings, pensions, other pages and future 24-language catalogs; require a nearby short explanation (not just a glossary link).
- [ ] **Validate comprehension** with users who lack financial training; improve any explanations that lead readers to confuse indices with money amounts, reported expenditure with policy control, or national trends with international living-standard rankings.
- [ ] **Keep long-term test outcomes** in committed history, and explicitly record manual browser, legal-source, national-model and external-data testing as distinct from automatic unit tests.

Documentation: [testing guide](docs/TESTING.md), [handover log](docs/TEST_LOG.md), [user-facing glossary](docs/glossary.html).

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
