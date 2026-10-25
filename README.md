# Where Do My Taxes Go? — EU public spending explorer

See [ROADMAP.md](ROADMAP.md) for national accounting transparency, validated tax models, economic outcomes, and **full localisation into all 24 EU official languages** (with additional national/regional languages planned). Country and interface language will be independently selectable.

An open-source, privacy-respecting, source-verifiable **public spending explorer**. The default view highlights the three largest spending functions; each official category has keyboard-, mouse- and touch-accessible plain-language examples. Country-specific decisions and agencies are reserved for evidence-linked national explanations. It shows how the governments of EU countries allocate expenditure across ten comparable COFOG categories. Visitors may enter an **illustrative annual tax amount** in their local currency to see a proportional allocation. Czechia also has a **source-audited 2024–2026 employee estimator with optional full-year household tax reliefs**; other countries remain manual-only.

## New: Czech 2024 state-budget chapter actuals

When Czechia and spending year **2024** are selected, the **What's different in this country?** card now shows the actual expenditure of **all 48 Czech state-budget chapters**, checked against the official 2024 Ministry of Finance final-account total. This is a separate, cash-based institutional state-budget ledger. It is **not** a one-to-one Eurostat COFOG function mapping or evidence that a named ministry controls the majority of spending in any category. See [source and validation](docs/countries/cz-budget-chapters-2024.md).

## Government responsibility: what can actually be verified

Each country/category now distinguishes *officially recorded sector expenditure* (Eurostat's national/central/state/local/social-security accounting sectors) from *proven legal responsibilities* and *institution-level budget control*. The first is sourced annually across all 27 EU countries and must never be mistaken for the last. Where we have not verified a responsible budget manager, the page explicitly says so.

The [27-country evidence and gap register](docs/eu27-authority-sweep.md) identifies the official source collection, known national treasury/budget portals, and outstanding reconciliation and legal checks. No ministry is identified as the biggest spending decision-maker on the basis of its name.

## Testing, failed attempts and handover

Read [Testing & handover](docs/TESTING.md) before making changes. The durable [test and decision journal](docs/TEST_LOG.md) records experiments, problems, corrections and next steps. Run `npm run test:report` to produce individual JavaScript/Python test results and diagnostics; GitHub Actions attaches this report and displays it in the workflow summary. New pull requests that change code, tests or workflows must update the handover journal. Technical terminology is explained in the [plain-language glossary](docs/glossary.html).

## Run locally

Requires Node.js >=20 for tests and the data refresh. The site itself is plain HTML, CSS and JavaScript with zero runtime dependencies.

```sh
npm test
npm run data:refresh   # downloads current Eurostat data; internet required
npm run serve          # open http://localhost:8000
```

Without a local snapshot, the frontend requests official Eurostat data directly (Eurostat documents CORS support). The `data:refresh` script rejects incomplete or inconsistent spending data rather than inventing values.

## Build and publish on GitHub Pages

```sh
npm test
npm run data:refresh
npm run build
```

On GitHub, enable **Settings → Pages → Build and deployment → Source: GitHub Actions**. The included workflow tests code, refreshes Eurostat data and deploys static files on every main-branch push and once a week. The repo needs no API secrets or paid hosting. If the Eurostat source is temporarily unavailable, the scheduled deployment fails rather than publishing incomplete new data.

## Accuracy and privacy

- Source: Eurostat `gov_10a_exp`; general government (`S13`), total expenditure (`TE`), ten COFOG categories, millions of euros.
- Missing values are **not** zero. Complete country-years only; reconciliation check against reported total.
- The manually entered figure is a **tax amount, not gross salary**. In Czechia, visitors may instead enter yearly gross salary to estimate personal income tax and payroll contributions. Both inputs stay in the browser.
- This is a proportional illustration, not a claim that a particular taxpayer's money was traced or earmarked.
- See [methodology](docs/methodology.md) for definitions, source links and known limitations.

## Roadmap

1. **Milestone 1 (this code):** EU-27 COFOG spending shares, year and country selector, optional illustrative contribution, comparison, automated source refresh and tests.
2. **Milestone 2 (Czechia implemented):** Source-audited Czech 2024–2026 standard-employment salary estimator, annual income tax, employee social and health premiums, clear employer contributions, personal tax-credit handling and official reference tests. Partial-year and nonstandard household/employment cases remain out of scope. Adapt Budget Galaxy's UK tax engine later only if official rate tables are revalidated.
3. **Milestone 2.1 (household reliefs implemented):** Full-year dependent-child tax advantages (including ZTP/P), eligible spouse or registered partner, taxpayer disability and ZTP/P credits, and refundable annual child tax bonus with source-based tests.
4. **Milestone 3:** Deeper descriptions and optional detailed budget drill-downs, extending international coverage through OECD/IMF data.

## Related initiatives and attribution

- [Budget Galaxy](https://github.com/JuanBlanco9/Budget-Galaxy), MIT, provides a model for detailed budget exploration and a potential UK tax-engine component. No Budget Galaxy source code is copied into this initial version.
- [OpenSpending](https://github.com/openspending/openspending) and [Where Does My Money Go?](https://github.com/openspending/wheredoesmymoneygo.org) pioneered personal tax and expenditure explorers. No OpenSpending source code is copied into this initial version.
- Eurostat data are reused with attribution in accordance with [Eurostat's reuse policy](https://ec.europa.eu/eurostat/help/copyright-notice).

## License

MIT for original application source code. Official statistical data retain their publisher's attribution and reuse conditions.


## EUROMOD validation proof of concept (experimental)

The independent [EUROMOD integration toolkit](docs/euromod-integration.md) provides a Python connector probe for official training data, country XML policy diffs, a Czech scenario-comparison gate, and a weekly official release watcher that opens review issues. **No EUROMOD tax results or national policy updates are automatically published.** The actual EUROMOD model/executable must be installed separately under the European Commission's terms before running a real comparison. The existing GitHub Pages app remains fully self-contained.


### Pensions transparency (COFOG second level)

Where Eurostat provides both `GF1002` (Old age) and `GF1003` (Survivors), their combined share appears as a non-additive drill-down within `GF10` (Social protection). The result is derived from the same official Eurostat S13 dataset as the top-level chart, without approximations for unavailable entries. National accounting notes appear on the main page when that country is selected. The EU-wide `docs/pension-transparency.html` describes the harmonised statistical definitions, while `docs/countries/fr-pensions.html` contains the France-specific CAS Pensions discussion.


## Historical economic context

Historical views include Eurostat annual HICP inflation, January national statutory minimum wages, and real gross disposable income per capita (2008=100 index). Automatic source refresh is part of the GitHub Actions deployment. Indicators appear only when reported by their separate official datasets; missing data remain missing and the five EU countries without a national statutory minimum wage are labelled accordingly. For indicator definitions and caveats, see [economic context methodology](docs/economic-context.md).
