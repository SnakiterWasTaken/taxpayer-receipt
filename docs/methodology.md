# Methodology and limitations

**Scope of current milestone:** An EU-27 government spending explorer and an illustrative allocation of a tax amount supplied by the visitor. **This is not a personal income tax calculator.** Entering a gross salary is not yet supported; a gross wage is not the same as taxes paid.

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

No foreign-exchange conversion is necessary to calculate a share because the numerator and denominator have the same source currency; the source uses Eurostat's millions-of-euros statistics. **The entered amount is not inferred from salary.**

The ten categories must reconcile with Eurostat's separately reported TOTAL to within 0.5% before any year is published. Any country-year missing a category or an independent total is excluded, rather than filling in zeroes. User-visible result charts use the ten-category sum as denominator for shares. The printed totals cite the Eurostat `TOTAL` value. Provisional/statistical flags are retained in the snapshot and displayed when present.

## Interpretation and caveats

This is an *illustrative pro-rata allocation*; governments pool revenues and finance budgets using many sources, including non-tax revenues and borrowing. An individual has no earmarked share of public expenditure. This tool is not an assertion that money was actually routed to specific expenditure categories, nor a substitute for personal tax advice.

`S13` covers consolidated **general government** across levels of government and relevant social-security subsectors, not merely federal or central-government budgets. Spending allocations do not reflect who benefits from a service, only how expenditure is classified. Users can explore historical years; some data are provisional or later revised by Eurostat. Eurostat may revise historical records without maintaining previous public versions.

The amount entered by users remains in their browser. We don't transmit it to our server or to Eurostat. Eurostat receives ordinary data retrieval requests for public spending statistics.

The cached official dataset contains Eurostat data under its [free-reuse policy](https://ec.europa.eu/eurostat/help/copyright-notice); source attribution is retained. If other upstream code is imported later, the relevant copyright and licences must be preserved separately.

## Future tax engine

Before enabling salary-to-tax estimates, implement per-country, per-year tax-rule adapters and benchmark them against official worked examples. Distinguish income tax, employee social security, employer contributions and indirect taxes. Keep spending-year selection separate from tax-year selection; forbid mixing years without explicit disclosure. Budget Galaxy's UK tax calculator is a **potential** source of suitably attributed MIT-licensed code, not an existing dependency of this MVP.

## Limitations requiring audit before expansion

- Verify country-specific currency display annually (notably transitions to the euro).
- Confirm official income-tax examples for each country/year before claiming to compute salaries.
- Add financial-year vs calendar-year explanations in relevant non-EU jurisdictions.
- For deeper government-line-item views, Budget Galaxy data have different scopes, including *planned budget* rather than final expenditure for some countries; these cannot replace S13 COFOG statistics without an explicit comparison framework.
