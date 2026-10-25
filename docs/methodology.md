# Methodology and limitations

**Scope:** An EU-27 public-expenditure explorer with optional independently validated country-specific tax calculators. Each country's tax assumptions, sources and eligibility are shown in its selected-country view.

## Primary source

- Publisher: [Eurostat](https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table?lang=en)
- Dataset: *General government expenditure by function (COFOG)*, `gov_10a_exp`
- DOI: https://doi.org/10.2908/gov_10a_exp
- API: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp
- Selector: annual `freq=A`, `unit=MIO_EUR` (millions of euros), general government `sector=S13`, `na_item=TE` (total expenditure)
- Classifications: COFOG top-level `GF01` … `GF10`, plus `TOTAL` as an independent total-control figure.
- Geographies: the 27 EU Member States, Greece as Eurostat `EL`.
- Period: 2021 onward; only country-years where all ten COFOG groups and TOTAL are available are shown.

## Calculation

For a visitor-entered illustrative tax amount `A` (in that country's currently displayed local currency), and each COFOG spending category `i`:

`share_i = reported_expenditure_i / SUM(reported_expenditure_GF01..GF10)`

`illustrative_allocation_i = A × share_i`

No foreign-exchange conversion is necessary to calculate a share because the numerator and denominator have the same source currency; the source uses Eurostat's millions-of-euros statistics. Where a validated national tax calculator is available, visitors may instead calculate a salary-based illustrative amount; other countries use entered tax amounts.

The ten categories must reconcile with Eurostat's separately reported TOTAL to within 0.5% before any year is published. Any country-year missing a category or an independent total is excluded, rather than filling in zeroes. User-visible result charts use the ten-category sum as denominator for shares. The printed totals cite the Eurostat `TOTAL` value. Provisional/statistical flags are retained in the snapshot and displayed when present.

## Interpretation and caveats

This is an *illustrative pro-rata allocation*; governments pool revenues and finance budgets using many sources, including non-tax revenues and borrowing. An individual has no earmarked share of public expenditure. This tool is not an assertion that money was actually routed to specific expenditure categories, nor a substitute for personal tax advice.

`S13` covers consolidated **general government** across levels of government and relevant social-security subsectors, not merely federal or central-government budgets. Spending allocations do not reflect who benefits from a service, only how expenditure is classified. Users can explore historical years; some data are provisional or later revised by Eurostat. Eurostat may revise historical records without maintaining previous public versions.

The amount entered by users remains in their browser. We don't transmit it to our server or to Eurostat. Eurostat receives ordinary data retrieval requests for public spending statistics.

The cached official dataset contains Eurostat data under its [free-reuse policy](https://ec.europa.eu/eurostat/help/copyright-notice); source attribution is retained. If other upstream code is imported later, the relevant copyright and licences must be preserved separately.

## Future countries

Extend the country/year tax-rule adapters only after benchmarking against official worked examples. Distinguish income tax, employee social security, employer contributions and indirect taxes. Keep spending-year selection separate from tax-year selection and explicitly disclose year differences. Budget Galaxy's UK tax calculator remains a **potential** source of suitably attributed MIT-licensed code, not a dependency of this release.

## Limitations requiring audit before expansion

- Verify country-specific currency display annually (notably transitions to the euro).
- Continue testing official salary-tax examples for each country/year and broaden Czech edge-case coverage before supporting nonstandard payroll arrangements.
- Add financial-year vs calendar-year explanations in relevant non-EU jurisdictions.
- For deeper government-line-item views, Budget Galaxy data have different scopes, including *planned budget* rather than final expenditure for some countries; these cannot replace S13 COFOG statistics without an explicit comparison framework.

## National tax-model documentation

National tax rules, credits, special cases and sources belong in each country's main explorer view. The separate [Czech technical specification](countries/cz-tax.md) is retained for independent audit and maintenance, not embedded in this country-neutral methodology.

## Pension-related expenditure — group-level COFOG (2024 onward)

The public interface shows **Old age (GF1002)** and **Survivors (GF1003)** as a breakdown of **Social protection (GF10)** whenever both official observations exist and their sum does not exceed the parent's value by over 0.5%. The groups are not added to national spending a second time. Eurostat [COFOG methodology](https://webgate.ec.europa.eu/eurostat/cache/metadata/en/gov_10a_exp_esms.htm) reports both function and group levels.

Definitions matter: **GF1002 is not exclusively cash retirement pensions**. It may include in-kind old-age services and scheme administration. **GF1003** covers survivors' benefits. Some national mandatory supplementary pension arrangements may be outside the general-government sector, and national all-schemes totals may be larger. The displayed portion is the sum of the two reported COFOG groups divided by the sum of ten top-level general-government expenditure groups. It is not a direct tracing of an individual's tax or social-insurance payments.

If either subgroup is missing or fails parent reconciliation, we disclose unavailable detail; we never infer a zero. Figures are refreshed by the existing Eurostat workflow. The pension functions are available for both France and other EU countries when Eurostat reports them, using the same definitions.

### Country-specific accounting notes

National accounting exceptions and reviewed methodological disputes appear on the main explorer **only when the corresponding country is selected**. Notes are versioned, source-linked entries in the jurisdictional registry (src/country-notes.js). Each note states its source year, budget status and comparability limitations. These facts do not modify the Eurostat COFOG calculation.

See the EU-wide [pension methodology](pension-transparency.html) or the national [French civil-service pension dossier](countries/fr-pensions.html) for the separate original government and IPP accounting perspectives.
