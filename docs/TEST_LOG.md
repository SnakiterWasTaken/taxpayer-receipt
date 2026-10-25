# Testing and handover journal

**Purpose:** The durable decision record for this project. Read this before changing calculations, source data handling, classification rules, or the interface. It explains *what was tried, what passed, what failed, how it was fixed, and what is still unverified*. For individual automated test results, open the corresponding [GitHub Actions run](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions) and its **test-explanations** artifact (from the date that automatic reports were introduced). Generated CI artifacts have limited retention: this committed journal preserves the conclusions.

## Mandatory entry for every future change

Each pull request that alters behaviour, datasets, tax policy, tooling, tests, methodology or UI **must append** a dated record with:

1. **Goal and scope.** What was changed, what problem it addresses, and what is intentionally excluded.
2. **Environment and version.** Commit/PR, test run URL, test date, versions, country and years where applicable.
3. **Each attempt:** exact command or reproducible steps; expectation; actual **PASS / FAIL / BLOCKED / NOT RUN**; what that result establishes **and does not establish**.
4. **Failures and adjustments:** error text or linked log, diagnosis, code/assumption adjustment and rerun outcome. Do not erase failed attempts after repairing them.
5. **Open limitations and next action.** Explicitly distinguish a local test from a live browser test, a fixture from official data, and a model adapter from an executed official model.
6. **Plain-language summary.** Two or three sentences describing the result for someone unfamiliar with the code.

Automated per-test reports are produced by `npm run test:report`, uploaded to each CI run, and attached to the GitHub Actions run summary. Each report lists **every test**, PASS/FAIL/SKIP, its descriptive test title (what it checks), and the raw diagnostics. CI reports are **not** a substitute for this committed record explaining experiments, decisions and unresolved risks.

Do not silently claim a test passed when it wasn't executed. If CI or external tools are unavailable, record **BLOCKED**, the reason and a specific next step.

## Retrospective handover — known milestones and problems

The entries below were reconstructed from project work and available GitHub runs **before the per-test-reporting system existed**. They are representative, **not a fabricated complete historical list of individual tests**.

### 2026-10-25 — EU spending baseline and Czech tax engine

- **Tried:** Eurostat `gov_10a_exp` S13/TE data loading, ten COFOG functions, totals reconciliation and missing-data protection; Czech single-employer 2024–2026 salary calculations and household tax credits; cross-country and privacy checks.
- **Worked:** Complete reconciled observations and automated tests. National payroll assumptions remain visibly separate from expenditure years.
- **Limit:** Proportional allocations do **not** trace individual tax payments. Czech estimates omit part-time, unusual income and partial-year entitlements.
- **Evidence:** [Czech tax feature commit](https://github.com/SnakiterWasTaken/taxpayer-receipt/commit/1313d12713e63886e0398a27edd01d681c95cdd3); national detailed documentation in `docs/countries/cz-tax.md`.
- **Next:** Real EUROMOD parity, not just hand-constructed examples.

### 2026-10-25 — Pension transparency classification and rounding repair

- **Tried:** Eurostat GF1002 (Old age) plus GF1003 (Survivors), nested under GF10 Social protection; validate sums and proportional allocations without double counting.
- **Failed:** An initial test compared a floating-point allocation with an exact integer. Normal floating-point arithmetic produced an extremely small difference.
- **Adjustment:** Changed that test to a numerical tolerance; did not change the authoritative underlying pension formula or totals.
- **Worked:** The corrected branch passed validation and published the nested pension breakdown for country-years with official reported observations.
- **Limit:** These groups are not identical to all cash pension payments. French ministry-budget CAS Pensions figures use a separate accounting basis and year.
- **Evidence:** [PR #1](https://github.com/SnakiterWasTaken/taxpayer-receipt/pull/1) and [France follow-up #2](https://github.com/SnakiterWasTaken/taxpayer-receipt/issues/2).
- **Next:** Document, reconcile and independently source any alternative French budget presentations before showing adjusted amounts.

### 2026-10-25 — Historical economic series and fixture repairs

- **Tried:** Eurostat annual HICP inflation, January minimum-wage observations and real disposable household income per capita, with country/year completeness checks.
- **Failed:** Two test fixtures initially made wrong assumptions: one looked for `eurostat` in a URL hostname instead of its path; another asserted that an inflation year was missing even though both required years were supplied.
- **Adjustment:** Corrected both test assertions. These were test-fixture errors, **not** evidence that the live Eurostat figures or formula were wrong.
- **Worked:** Real Eurostat downloads passed source coverage checks; 2024 observations available for 27/27 inflation, 22/27 national minimum wage and 26/27 real-income series. The other five EU members have **no national statutory minimum wage**, not a zero wage.
- **Limit:** The real-income **index** is suitable for within-country trend, never comparing income **levels** across countries. Mean national household figures do not describe each person's finances.
- **Evidence:** [PR #3](https://github.com/SnakiterWasTaken/taxpayer-receipt/pull/3); [Eurostat source](https://ec.europa.eu/eurostat/databrowser/view/tepsr_wc310/default/table?lang=en).
- **Next:** Clear public descriptions for the indicators; deeper affordability and distribution measures [issue #4](https://github.com/SnakiterWasTaken/taxpayer-receipt/issues/4).

### 2026-10-25 — Country scoping and accessible simplification

- **Tried:** Move French accounting and Czech tax-methodology details to their selected-country views while keeping universal methodology neutral; add common COFOG help bubbles and a concise initial overview.
- **Worked:** Separate reviewed source-backed country notes and common Eurostat classifications; latest reported pre-journal run completed **69 JavaScript and 8 Python tests**, followed by successful build and deployment.
- **Evidence:** [PR #5](https://github.com/SnakiterWasTaken/taxpayer-receipt/pull/5), [PR #7](https://github.com/SnakiterWasTaken/taxpayer-receipt/pull/7), [PR #11](https://github.com/SnakiterWasTaken/taxpayer-receipt/pull/11), [deployment run 40202603174](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40202603174).
- **Limit:** Automated tests alone are not a substitute for user comprehension studies, responsive browser testing, or assistive-technology review.
- **Next:** Test tooltips, long translations and mobile interactions with actual browsers; implement sourced *Who decides?* responsibilities [issue #10](https://github.com/SnakiterWasTaken/taxpayer-receipt/issues/10).

### 2026-10-25 — EUROMOD integration probe (still incomplete)

- **Tried:** Model release monitoring, official policy-file comparison, Czech model runner scaffolding and reference-output adapters.
- **Worked:** Release discovery/diff and integration unit tests.
- **NOT RUN:** A real official EUROMOD Czech simulation, because a compatible external model installation/executable was not available. **Do not describe the tax calculator as parity-validated.**
- **Evidence:** `docs/euromod-integration.md` and test suite `tests/test_euromod_tools.py`.
- **Next:** Install a licensed compatible model, execute identical-household benchmarks and publish measured deviations with scope and sources.

### 2026-10-25 — Per-test reporting, durable handover and household-index explanation (PR pending)

- **Goal:** Make all subsequent test results comprehensible and discoverable, prevent code changes without a written handover record, and explain the household-income index without financial jargon for all countries.
- **Affected:** GitHub Actions validation/deployment workflows; JavaScript and Python test reporting; global economic-context user interface, plain-language glossary and docs. **No change to Eurostat numerical values or the Czech tax engine.**
- **Failed run — [Actions 40203656346](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40203656346):** PR validation failed at `npm run test:report` **before any tests executed**. The JavaScript module `scripts/test-report-lib.mjs:48` contained an unescaped apostrophe inside a single-quoted documentation string (`test's`), causing `SyntaxError: Unexpected identifier 's'`. The PR journal gate passed; Eurostat refresh and build were skipped after the test step failed. The report's upload step ran but had no useful report to attach.
- **Adjustment:** Replaced `test's` with safe wording in the reporter source, without modifying statistical or fiscal formulas. **Retest:** awaiting next PR CI run; do not record PASS until it completes.
- **Attempt 1 (implementation review):** Added a runner capturing individual Node TAP and Python verbose test outcomes, generating an explained Markdown report and raw diagnostic logs. Added synthetic PASS/FAIL fixtures for the parser and negative-case tests. **Status: NOT RUN in real GitHub CI as of this initial entry.** Unit tests will verify that a failure can never be reported as an overall pass.
- **Attempt 2 (workflow change):** Replace aggregate-only test steps with `npm run test:report`; upload reports even on failure and surface them in GitHub Actions summary. PR check requires this journal to change when source, tests or workflow changes. **Status: awaiting PR validation.**
- **Attempt 3 (human-facing interpretation):** Replaced ambiguous "Real household index" label with nearby simple explanations of the 2008=100 baseline, country-internal comparison, what 120 means, and what the index cannot say. Added a country-neutral glossary and explanation tests. **Status: awaiting PR validation and live Pages verification.**
- **Unverified / limitations:** No real EUROMOD simulation was performed; browser interaction and mobile readability are not covered by unit tests. The CI artifact retains complete test rows for 90 days, while important decisions and failures belong in this committed journal.
- **Retest 1 — [Actions 40203741619](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40203741619): PASS.** The syntax correction allowed the reporter to run. JavaScript/Python tests, journal gate, official Eurostat economic-context refresh and static build all succeeded. This establishes that the reporter now executes and the data source is currently reachable; it does **not** mean live browser rendering was tested.
- **Retest 2 — [Actions 40203766190](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40203766190): PASS.** Report generated and uploaded as `explained-test-results` (artifact ID 12602758285): **86 individual test cases captured, 86 passed, zero failures and zero skips**. Official Eurostat economic-context coverage for the reference year 2024 remained **inflation 27/27**, **statutory minimum wage 22/27** (five countries have no nationwide legal rate), and **real household income index 26/27**; build PASS. No numerical calculation formulas changed.
- **Interpretation:** Parser negative tests confirm that a synthetic failed test, missing reported case, or unparseable result cannot be silently declared passing; the real CI run confirms that the complete suite can be reported correctly in this environment. This is **not** an official tax-law audit, full browser/assistive-technology usability verification, real EUROMOD calculation, or proof that individual households' real incomes rose.
- **Next:** Review and merge PR #12, then confirm Pages deployment separately. Perform a manual browser/touch/keyboard check of the new index explainer in a later testing session and retain that result in this log.

### 2026-10-25 — Mobile expanded panels widen the page (PR pending)

- **Goal:** Keep every expanded card the same width on phones. Wide historical statistics should scroll **inside their table**, not push the whole page sideways.
- **Affected:** Shared CSS layout, all countries, all years; country notes, tax/calculation panels, comparison legend and expandable economic history. **No changes to COFOG totals, pension data, economic indicators, payroll formulas or Eurostat downloads.**
- **Reported symptom:** Opening a detailed section on mobile can make some panels wider than others and require horizontal scrolling of the entire page.
- **Cause investigated:** The explorer and inner output use CSS grid. An expandable grid child can supply an intrinsic minimum width based on wide descendants. In particular, the historical table intentionally has a 520 px minimum width; without zero-minimum grid tracks and constrained children, the expanded table can force the output column beyond the mobile viewport. Long official links, amounts and comparison labels are additional overflow candidates.
- **Reproduction 1 — direct file navigation:** A Chromium Playwright attempt to navigate to `file:///mnt/data/mobile-layout-fixture.html` returned **BLOCKED: ERR_BLOCKED_BY_ADMINISTRATOR**. This is an environment/navigation restriction, not evidence about the website. Adjusted the testing method to use `page.set_content(...)` with the same fixture markup.
- **Reproduction 2 — representative Chromium fixture BEFORE correction: FAIL.** The fixture recreated the affected grid/detail/table structure and its pre-fix mobile width behavior. With the statistics panel opened, a **390 px** viewport produced **576 px of document scroll width** and **562 px-wide content cards**. At 320, 375 and 430 px, the table likewise made the document wider than the viewport. **This is a synthetic layout fixture**, not a screenshot or execution of the actual deployed site.
- **Adjustment:** Use `minmax(0,1fr)` for the outer/inner mobile grid tracks and `min-width:0; max-width:100%` on expandable output children. Keep a deliberate `min-width:520px` on the statistics table but constrain its immediate wrapper to 100% and enable `overflow-x:auto` there. Allow long notes, official links and amounts to wrap; wrap the mobile comparison legend and payroll heading.
- **Reproduction 3 — same Chromium fixture AFTER correction: PASS at nine widths** (320, 360, 375, 390, 430, 600, 700, 800, 980 px). All output panels had identical rendered widths; `documentElement.scrollWidth` never exceeded the viewport width; at 320–430 px the table's own scroll width remained **520 px**, inside a 250–360 px wrapper. The fixture was loaded via `page.set_content` and is **not a full integration test** against the live site.
- **Automated regression tests — [Actions 40231804740](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40231804740): PASS.** `tests/mobile-expanded-layout.test.mjs` contains four new responsive CSS/HTML contract tests. GitHub Actions captured **90 individual test results, all 90 PASS, zero FAIL and zero SKIP**, including the established JavaScript/Python suites. The official economic data refresh also succeeded (2024 HICP 27 EU countries; statutory minimum wage 22; household income index 26), and the static site build passed. These static checks prevent accidental removal of the intended CSS containment, but do not replace full-page mobile browser testing.
- **Limitations:** Production JavaScript data filling, real device viewport handling, iOS Safari and direct visual inspection of the published app have **not yet been verified**. The browser fixture shares representative layout rules but is not the actual production DOM/CSS bundle.
- **Next:** Validate PR tests/data refresh/build, merge only on success, confirm GitHub Pages publish, and run an actual smartphone or browser device-emulation check expanding economic history and country-specific notes. If any panel still widens, capture viewport size and affected section and add a browser-level regression.

### 2026-10-25 — Less text; expandable insight and explanation cards (PR pending)

- **Goal (in ordinary language):** a visitor sees their country, the biggest spending areas and a few important facts. Explanations, national legal details, source notes and historical statistics should be available when opened, rather than making an intimidating wall of text.
- **Scope:** Shared interface, every country/year; no changes to Eurostat data, tax rules, tax-calculator mathematics, reference years, or the country-specific note registry. Markup uses native accessible `<details>/<summary>` rather than a custom JavaScript-only accordion; multiple sections can remain open.
- **Attempt 1 — inspection (PASS):** found default-page redundancy: the same top three functions are shown as cards and repeated in the breakdown; country notes showed lengthy text before the user opened anything; the page ended with three methodology articles. Checked existing mobile-width fix and planned not to undo it.
- **Adjustment:** Grouped the full category breakdown, pensions, economic history, national notes and general methodology into five optional topic cards. The closed pension card previews the **selected country's verified pension share and year**; the economic card previews **selected year's inflation and real household income movement** when reported; the national card says how many notes are available for the selected country. Country-specific content stays country-specific, and detailed financial-source caveats are kept inside the cards.
- **Attempt 2 — insight layout (implementation prepared):** moved methodological caveats and source explanations inside expandable individual insight cards; the actual observation remains visible even when collapsed. All text is inserted using `textContent` rather than `innerHTML` so source data or user inputs cannot inject markup.
- **Attempt 3 — deep link (implementation prepared):** added `revealLinkedSection` to open containing native disclosures when the salary receipt's tax rules link or the methodology anchor is opened. Full official source links remain reachable. Open/closed state is managed by the browser, not saved remotely.
- **Regression risks to test:** legacy HTML tests referenced old class names, so their expectations have been updated to the new markup. On mobile, all nested cards must keep `min-width:0`; wide economic tables continue to scroll within their own wrapper. The numerical model must remain unchanged.
- **Initial status:** BEFORE running GitHub CI, new visual behavior was **NOT RUN** and not deployed; the implementation was code-reviewed and instrumented with structural tests.
- **Validation attempt 1 — [Actions 40235849918](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40235849918): PASS.** The PR test workflow finished with **98 individual test cases, all 98 passed, zero failed and zero skipped**, including the 8 new expandable-card regressions and the preexisting mobile-width checks. Official economic-context refresh PASS (2024 inflation: 27 EU countries; statutory minimum wage: 22; real household-income index: 26). Static site build PASS. This proves the code builds and documented structural invariants hold; it does **not** prove the expanded visual interactions work on physical phones.
- **Adjustment required by tests:** existing test assertions mentioned the previous classes for pension/economic disclosure cards. Updated them to the new, named topic-card classes while retaining checks that the same sources, tables and national information remain available. No spending calculations changed.
- **Still NOT RUN:** physical-device touch/keyboard walkthrough, visual regression screenshots of the complete deployed app, translations or user-comprehension testing. These limitations remain on the roadmap.
- **Next:** run full JavaScript/Python CI plus real data refresh/build; inspect failing tests and log any adjustments; merge only if successful; verify published Pages, then arrange real mobile and keyboard browsing checks. Translation work is still pending.

### 2026-10-25 — One expansion should reveal all ten spending categories (PR pending)

- **Goal:** Remove redundant taps on mobile. The initial page still shows the three largest spending areas; opening **Explore all spending categories** must reveal the **entire ten-category breakdown immediately**.
- **Cause:** The previous interface placed another `<details id="spending-more">` inside the already expandable category card. It initially rendered only three rows and hid seven more behind a second disclosure. The extra step was unnecessary and contradicted the card's name.
- **Attempt 1 (code change prepared; CI not yet run):** Remove the nested disclosure and its separate `breakdown-extra` container; populate the existing `breakdown` with `allocations.map(makeRow)` rather than separate slices. Keep the first-screen three-leader summary, all ten COFOG classifications, hover/tap/keyboard information bubbles, spending percentages and optional personal estimates.
- **Test changes:** Update prior structural tests that intentionally expected the old nested control; add regression tests that confirm the outer card has no nested `<details>`, the ten registered COFOG functions remain, and the full calculated allocation array renders in the one list.
- **Failed validation — [Actions #40236930489](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40236930489): FAIL (100/101 tests passed; one regression-test assertion failed).** The new test asserted that the HTML substring from the start of the category card to its closing tag contained **no** `<details>` at all. It incorrectly matched the **outer category card itself**; the nested control had in fact been removed. This was an incorrect test assertion, not proof of a product defect. Because the test step failed, the workflow did not complete its data refresh and static build. The per-test CI report and raw log remain attached to the run.
- **Adjustment:** Changed the test to assert **exactly one** opening `<details>` (the outer card) and specifically reject any `breakdown-extra` container. The change does not alter the frontend behavior, numerical allocations or COFOG functions. **Retest pending** when this entry was written.
- **Scope:** UI presentation only; no Eurostat calculations, economic data, tax parameters, accounting rules or country-specific notes altered.
- **Unverified:** A physical mobile-browser tap and screenshot check has **not** been performed.
- **Next:** Run PR CI, document pass/fail and any adjustment here; merge on success; verify the Pages deployment; invite a mobile check of the single-expansion interaction.

## Current handover

- **Authoritative repo:** [SnakiterWasTaken/taxpayer-receipt](https://github.com/SnakiterWasTaken/taxpayer-receipt).
- **Primary operating rule:** Common methodology across all countries. National facts appear only on the selected country's main page. Show an understandable headline first and preserve the complete, verifiable detail on request.
- **After adding this reporting system:** For each new PR and subsequent fix, append the structured record above including the outcome of every meaningful manual, integration or external-data test. Use the automatically captured individual test report to investigate regressions, then summarize changes and reasons here.
- **Highest-priority next work:** Sourced spending-authority mappings (#10), accessible language coverage (#6), and real EUROMOD model validation. Keep every unexecuted test visibly **NOT RUN**.
