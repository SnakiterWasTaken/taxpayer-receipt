# Methodology and limitations

**Scope of current milestone:** An EU-27 government spending explorer with a **Czech salaried-employee estimator with optional full-year household tax reliefs for 2024–2026**. Visitors in other countries must enter their known tax amount. The Czech estimate covers ordinary single-employer full-time wages with explicit exclusions below.

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

No foreign-exchange conversion is necessary to calculate a share because the numerator and denominator have the same source currency; the source uses Eurostat's millions-of-euros statistics. **For Czechia only**, the amount may instead be calculated from the salary estimate described below; all other countries use entered tax amounts.

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

## Czechia personal income-tax calculator (2024–2026) {#czechia}

Czechia is the first country with an **estimated personal salary-to-payroll calculation**. It is for a standard single-employer, full-time employee earning regular gross wages for all twelve months. Enter the total yearly **gross salary in CZK**. The calculator distributes whole-CZK salary approximately evenly across twelve months, computes monthly contributions and tax advances, then uses the *annual* Czech income-tax base and credit to estimate tax after year-end reconciliation. It is an illustration, not an official tax assessment or payroll service.

### Tax-year configuration

| Tax year | Average wage (CZK) | Annual 23% tax threshold (36× wage) | Monthly 23% threshold (3× wage) | Annual social contribution cap (48× wage) | Full-time minimum salary/month |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2024 | 43,967 | 1,582,812 | 131,901 | 2,110,416 | 18,900 |
| 2025 | 46,557 | 1,676,052 | 139,671 | 2,234,736 | 20,800 |
| 2026 | 48,967 | 1,762,812 | 146,901 | 2,350,416 | 22,400 |

- **Income tax**: 15% of the annual tax base up to the threshold, 23% above it. Annual tax base rounded **down** to 100 CZK; computed tax rounded **up** to 1 CZK. The basic taxpayer credit (**30,840 CZK per year**) is deducted, never producing a negative tax. Monthly advances instead round the base **up** to 100 CZK, use the 3× average wage threshold, and apply a monthly basic credit of **2,570 CZK**. The displayed income-tax result is **after estimated annual reconciliation**, not necessarily the sum of monthly payslip advances. See the explicit adjustment in the UI.
- **Employee social insurance**: 7.1% (6.5% pension and 0.6% sickness), monthly rounding up to whole CZK, subject to the annual social-insurance assessment-base cap. Standard employer social insurance: 24.8%; employer costs are reported separately and **excluded** from employee deductions. Special-risk jobs and employer concessions are not modelled.
- **Health insurance**: 13.5% total of monthly gross, rounded up to 1 CZK, with one third attributed to the employee (approximately 4.5%) and two thirds to the employer (approximately 9%). The employee share is rounded up to a whole CZK for the estimate. The 2024–2026 full-time minimum salaries are a conservative input restriction: smaller earnings can involve minimum assessment-base top-ups or statutory exemptions, which the calculator deliberately does not attempt to infer.
- **Excluded**: partial-year claims, unverified eligibility, non-standard deductions, non-taxable items, employer benefits, exceptional pay, partial-year employment, part-time minimum health-base rules, multiple jobs/employers, non-residents with special circumstances, self-employment (OSVČ), DPP/DPČ and other contract regimes. Do **not** present this model as suitable for those cases.
- **Allocation modes**: *Income tax only* allocates just the estimated personal income tax; *all employee deductions* also includes employee social and health premiums. Both multiply the amount by published **general-government** COFOG expenditure shares. Insurance contributions fund distinct schemes and should **not** be interpreted as unrestricted money paid into a common government fund. Employer-paid amounts are never silently included.
- **Year labels**: Czech tax year and Eurostat spending year are **separate** selectors. Different years may be used, but both appear in the allocation explanation. Spending patterns are from reported expenditure, not the selected salary tax year.

### Optional household credits: full-year self-declared eligibility (2024–2026)

**Selected reliefs apply to the individual employee, not to combined household income.** The calculator does not look up family records, confirm legal residence, check documentation or verify whether the other parent has claimed an allowance. Only select a credit if you are satisfied that all statutory requirements were met **for every eligible month of the calendar year**. Partial-year births, custody/eligibility transitions, split benefits, student-related qualifications, and nonresident exceptions are not modelled.

- **Dependent children**: CZK **15,204** for the first claimed child; **22,320** for the second; **27,840** for each third or subsequent child, annually. Each child with a qualifying **ZTP/P** card receives double the amount assigned to that child. Children must qualify as dependents in the household; the other parent must not claim the same child-month. The chosen order reflects the order of relief claimed, not necessarily birth order. The interface currently accepts zero to six full-year claimed children. Real-life child-benefit eligibility depends on age and additional legal conditions and is not determined from a numeric count.
- **Spouse or eligible registered partner**: CZK **24,840** annually, doubled to **49,680** when that spouse/partner has ZTP/P. A jointly maintained household with a *dependent child of the taxpayer under three* is required, **plus** spouse/partner own annual gross income of **CZK 68,000 or less**. The model's full-year option also assumes those conditions held on **the first day of each month**. A child need not be claimed for the child tax credit by this taxpayer for the spouse credit to be applicable. A parental allowance generally does not count toward the spouse income test; maternity benefits generally do.
- **Taxpayer disability credit**: CZK **2,520** for qualifying disability grade I/II, or **5,040** for qualifying grade III, annually. The degree and eligibility are self-declared; grades are mutually exclusive.
- **Taxpayer ZTP/P**: a distinct **CZK 16,140** annual credit, if eligible throughout the year.
- **Credit application order**: the annual basic taxpayer credit and other *nonrefundable* credits reduce income tax only to **zero**. Dependent-child credit then reduces any remaining income tax; unused child credit becomes an **annual refundable child tax bonus** only if the statutory conditions are met. Income thresholds for annual child bonus are CZK **113,400** (2024), **124,800** (2025), or **134,400** (2026), representing six times the respective monthly minimum wage. The calculated annual bonus must be at least **CZK 100**. The restricted full-time model has a higher input minimum, but the bonus threshold is still enforced by the calculation engine. Monthly bonuses have different eligibility and minimum-payment conditions and are **not** modelled here.
- **Separate tax and bonus display**: `incomeTax` is never negative. `childTaxBonus` is a **positive transfer**, added to the estimated employee net annual income and shown separately from employee payroll deductions. A personal tax-to-spending visualisation allocates actual **nonnegative income tax** (or payroll deductions if selected), **not** the refundable child bonus as though it were tax paid.
- **Annual vs monthly**: the calculator's monthly tax advance remains a *basic-credit-only baseline*, because it does not know whether individual household credits were claimed on payslips. The displayed settlement adjustment therefore assumes these other reliefs are reconciled at year-end; it is not a prediction of an actual refund or of payslip-by-payslip net wages.

**Official Czech sources:** [Financial Administration — employee taxation and dependent child credits](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/zamestnanci-zamestnavatele/obecne-informace); [2024 archival rules](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/zamestnanci-zamestnavatele/obecne-informace/archiv-obecne-informace-2024); [2025 employer/taxpayer Q&A](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/zamestnanci-zamestnavatele/dotazy-a-odpovedi/2025/aktualni-dotazy-a-odpovedi-k-dani-z); [2026 tax credit Q&A](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/zamestnanci-zamestnavatele/dotazy-a-odpovedi/2026/aktualni-dotazy-a-odpovedi-k-dani-z); [spouse income and birth-month qualification](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/dotazy-a-odpovedi/dan-z-prijmu-fyzickych-osob/sleva-na-manzela).

### Primary official references

1. Czech Financial Administration, [employment income tax 2026](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/zamestnanci-zamestnavatele/obecne-informace), thresholds, tax-base rounding and taxpayer credit.
2. Czech Financial Administration, [2024 archive](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/zamestnanci-zamestnavatele/obecne-informace/archiv-obecne-informace-2024), 2024 thresholds and advance calculations; [official worked example (2024 PDF)](https://financnisprava.gov.cz/assets/cs/prilohy/d-seznam-dani/Prijmy-ze-zavisle-cinnosti-pro-rok-2024.pdf): 165,615 CZK monthly gross → 27,559 CZK monthly tax before personal relief.
3. Czech Financial Administration, [2025 36× threshold and comparison with 2024](https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2026/influenceri-a-dane-za-rok-2025-na-co-si-dat-pozor).
4. Czech Social Security Administration, [assessment-base cap](https://www.cssz.gov.cz/maximalni-vymerovaci-zaklad) and [social contribution rounding](https://www.cssz.gov.cz/vypocet-pojistneho), plus the Ministry of Labour and Social Affairs' [2026 rates](https://mpsv.gov.cz/socialni-pojisteni).
5. VZP health insurer, [employee/employer premiums](https://www.vzp.cz/platci/informace/povinnosti-platcu-metodika/2-4-platce-pojistneho-zamestnavatel), [calculation and rounding](https://www.vzp.cz/platci/informace/zamestnavatel/vymerovaci-zaklad-a-vypocet-pojistneho), and [historical minimum wage/minimum health-insurance base](https://www.vzp.cz/platci/informace/obzp/minimalni-mzda).

**Test reference:** automated tests cover statutory thresholds, ordinary salaries, annual contribution caps, employer separation, monthly/annual rounding and the official 2024 worked example. Tests ensure internal consistency and known cases; they are not a substitute for certifying every payslip or tax return.


## Pension-related expenditure — group-level COFOG (2024 onward)

The public interface shows **Old age (GF1002)** and **Survivors (GF1003)** as a breakdown of **Social protection (GF10)** whenever both official observations exist and their sum does not exceed the parent's value by over 0.5%. The groups are not added to national spending a second time. Eurostat [COFOG methodology](https://webgate.ec.europa.eu/eurostat/cache/metadata/en/gov_10a_exp_esms.htm) reports both function and group levels.

Definitions matter: **GF1002 is not exclusively cash retirement pensions**. It may include in-kind old-age services and scheme administration. **GF1003** covers survivors' benefits. Some national mandatory supplementary pension arrangements may be outside the general-government sector, and national all-schemes totals may be larger. The displayed portion is the sum of the two reported COFOG groups divided by the sum of ten top-level general-government expenditure groups. It is not a direct tracing of an individual's tax or social-insurance payments.

If either subgroup is missing or fails parent reconciliation, we disclose unavailable detail; we never infer a zero. Figures are refreshed by the existing Eurostat workflow. The pension functions are available for both France and other EU countries when Eurostat reports them, using the same definitions.

### Country-specific accounting notes

National accounting exceptions and reviewed methodological disputes appear on the main explorer **only when the corresponding country is selected**. Notes are versioned, source-linked entries in the jurisdictional registry (src/country-notes.js). Each note states its source year, budget status and comparability limitations. These facts do not modify the Eurostat COFOG calculation.

See the EU-wide [pension methodology](pension-transparency.html) or the national [French civil-service pension dossier](countries/fr-pensions.html) for the separate original government and IPP accounting perspectives.
