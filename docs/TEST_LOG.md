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

## Current handover

- **Authoritative repo:** [SnakiterWasTaken/taxpayer-receipt](https://github.com/SnakiterWasTaken/taxpayer-receipt).
- **Primary operating rule:** Common methodology across all countries. National facts appear only on the selected country's main page. Show an understandable headline first and preserve the complete, verifiable detail on request.
- **After adding this reporting system:** For each new PR and subsequent fix, append the structured record above including the outcome of every meaningful manual, integration or external-data test. Use the automatically captured individual test report to investigate regressions, then summarize changes and reasons here.
- **Highest-priority next work:** Sourced spending-authority mappings (#10), accessible language coverage (#6), and real EUROMOD model validation. Keep every unexecuted test visibly **NOT RUN**.
