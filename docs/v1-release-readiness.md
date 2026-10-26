# V1 release-readiness audit — 26 October 2026

**Status: NOT READY TO CERTIFY.** This checklist describes a bounded verification process, not a claim that the deployed website has passed manual browser/assistive-technology checks. The scope decision and stopping rules are in [ROADMAP.md](../ROADMAP.md). Source-level CI results do not establish usability.

## Release gates and evidence

| Gate | Check / acceptance condition | Status (26 October) | Evidence / action |
|---|---|---|---|
| M1 — official EU27 core | All 27 countries and all ten COFOG functions; S13 reconciled and missing never zero | **AUTOMATED PASS** | [Validate #40249796160](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40249796160) source refresh, [EU27 audit](eu27-authority-sweep.md). Check live selection separately |
| M1 — explanatory accuracy | Manual tax input labelled illustrative, not tracked personal revenue; separate tax and expenditure years | **CODE/DOC REVIEW; LIVE NOT RUN** | [README](../README.md) and [methodology](methodology.md); visually inspect all flows |
| M2 — tax coverage | Czech model labelled with supported years/assumptions; other EU countries offer manual tax amount, no implied validated payroll estimator | **CODE/DOC REVIEW; LIVE NOT RUN** | [Czech tax methodology](countries/cz-tax.md); exercise both modes |
| M3 — source responsibility | Eurostat sectors never called independent budget decision-makers; no unsupported biggest ministry; gaps distinguished | **AUTOMATED/DOC REVIEW; LIVE NOT RUN** | [EU27 audit](eu27-authority-sweep.md) and [authority source audit](authority-sources.md) |
| M3 — 27-country status register | At minimum each country displays honest reviewed/unreviewed/source status and never claims data do not exist because we did not find them | **DOC REVIEW; LIVE NOT RUN** | [EU27 audit](eu27-authority-sweep.md), verify current site messages |
| M4 — responsive browsers | No page-level horizontal overflow at **320, 375, 390, 430 px** with every details card open; wide tables scroll internally | **NOT RUN on deployed site** | Execute real browser/phone smoke check; older Playwright representative fixture is not production |
| M4 — navigation/accessibility | Keyboard-only operation, visible focus, no trapped focus, labels, touch/tooltip affordances, deep-link expansion | **NOT RUN** | Test Chromium, Firefox and Safari/mobile as available, log environment |
| M4 — languages | Disclose actual supported languages and review status, preserve English fallback and independent country/language scope | **NOT COMPLETE** | All 24 official translations remain post-V1; do not claim coverage |
| Privacy | No entered salary/tax/household details sent to external services or persisted without disclosure | **NOT RUN (traffic/browser audit)** | Inspect browser Network and storage while using calculators |
| Sources and deployment | Source links navigate, build/deploy works, Pages current and mobile public route functions | **PAGES DEPLOYMENT PASS; LIVE BROWSER NOT RUN** | [Pages run #40299263872](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40299263872) completed build **and deploy** for PR #29 merge; deployed URL reported as [public site](https://snakiterwastaken.github.io/taxpayer-receipt/). Post-PR30 production [Pages #40300409028](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40300409028) **build PASS and deploy PASS** for merged redesign commit `443c1b7`. The deploy job independently confirmed the same public URL. Source-link navigation and interactive browser checks remain NOT RUN. |
| Regression and source availability | JavaScript/Python suite green, Eurostat spending/institutional/economic fetch & build green | **PASS at cited commit** | **162/162** in [Validate #40249796160](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40249796160), zero failures/skips. Repeat on V1 candidate |

**Do not mark V1 ready** while critical browser/keyboard/privacy checks are NOT RUN. Findings discovered in the smoke test should be filed as individual bounded defects; fix release blockers, not optional historic accounting gaps.

## Minimum manual smoke matrix

Perform on a built/deployed site, capture device/browser/version, selected country/year, steps, expected/actual result and screenshots/console errors when available:

1. CZ 2024: ten functions and top three correct; open every details card; no horizontal page overflow at four mobile widths.
2. FR 2024: country notes and pension drill-down have correct scope/caveat, no Czech-only tax assumptions.
3. A non-CZ country: manual tax entry works, *no* Czech payroll estimator displayed; compare-country option works.
4. Year switching: no stale country-specific legal or accounting details, clear distinction tax policy year versus fiscal year.
5. Keyboard only: Tab/Shift+Tab/Enter/Space/Escape where appropriate; tooltip readable and dismissal works; focus visible.
6. Privacy: enter sample—not real—salary/household figures, inspect Network, local/session storage and URL after interactions.
7. Refresh/source links: browse official-source references; inspect broken routes/links and online fallback if snapshot missing.
8. Screen-reader smoke if available: headings, controls, expanded state and table headers announced coherently.

## Prioritised work queue

- **P0**: Missing or incorrect 27-country spending totals, misleading tax-as-tracked-money language, wrong national tax model, privacy leakage, broken public deployment, inaccessible core country selection.
- **P1**: Documented mobile overflow or keyboard failure, inaccessible help disclosure, broken source link, inconsistent country-specific scope.
- **P2**: Additional institutional ledgers, comprehensive 24-language localisation, forensic transactions, new macro indicators and advanced household taxation.

## Exit criteria

Mark V1 READY only once the required gates above have actual evidence and no unresolved P0 defects. A known P1 may be accepted only with a documented accessibility/impact evaluation and remediation plan; core interaction failures are blockers. After V1, stop scope expansion and shift to maintenance and individually approved improvements.
