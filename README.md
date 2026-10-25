# Where Do My Taxes Go? — EU public spending explorer

An open-source, privacy-respecting, source-verifiable **public spending explorer**. It shows how the governments of EU countries allocate expenditure across ten comparable COFOG categories. Visitors may enter an **illustrative annual tax amount** in their local currency to see a proportional allocation. Czechia also has a **source-audited 2024–2026 employee estimator with optional full-year household tax reliefs**; other countries remain manual-only.

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
