# EU27 government expenditure and decision-authority sweep

**Status as of 25 October 2026:** actual official Eurostat API sweep **successfully executed across all 27 EU Member States**, ten COFOG spending categories and years 2021–2024; verified country-by-country results are recorded below. A national ledger/municipal-law audit has **not** been completed for all countries. A country with no verified national budget portal listed below is **not** a country without published government accounts.

## Verified results — CI Eurostat API sweep, 25 October 2026

The official Eurostat API extraction was **executed**, not merely proposed, in [GitHub Actions validation #40240167630](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40240167630):

- **27 of 27 countries scanned** for 2024.
- **27 of 27 countries have all ten complete national S13 COFOG categories**.
- **27 of 27 countries have at least one reported government-subsector observation for each of those ten functions**.
- **810** individual 2024 subsector/category observations (out of a theoretical **1,080** if all four subsectors reported values for all categories). Non-reported and inapplicable cells are **not filled with zero**.
- **1,080 national S13 category/year observations were cross-checked** against the independently refreshed main expenditure dataset for 2021–2024; the tolerance gate passed.
- **123 of 123 automated tests PASS, zero FAIL, zero SKIP** (final PR verification, [Actions #40240485472](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40240485472)). The official economic-context refresh and static website build also completed successfully.

| Country | 2024 national COFOG functions | Functions with any subsector amount | Individual reported sector/function amounts |
|---|---:|---:|---:|
| AT | 10/10 | 10/10 | 40/40 |
| BE | 10/10 | 10/10 | 40/40 |
| BG | 10/10 | 10/10 | 25/40 |
| HR | 10/10 | 10/10 | 30/40 |
| CY | 10/10 | 10/10 | 30/40 |
| CZ | 10/10 | 10/10 | 30/40 |
| DK | 10/10 | 10/10 | 30/40 |
| EE | 10/10 | 10/10 | 30/40 |
| FI | 10/10 | 10/10 | 30/40 |
| FR | 10/10 | 10/10 | 30/40 |
| DE | 10/10 | 10/10 | 40/40 |
| EL | 10/10 | 10/10 | 30/40 |
| HU | 10/10 | 10/10 | 30/40 |
| IE | 10/10 | 10/10 | 30/40 |
| IT | 10/10 | 10/10 | 30/40 |
| LV | 10/10 | 10/10 | 21/40 |
| LT | 10/10 | 10/10 | 24/40 |
| LU | 10/10 | 10/10 | 30/40 |
| MT | 10/10 | 10/10 | 20/40 |
| NL | 10/10 | 10/10 | 30/40 |
| PL | 10/10 | 10/10 | 30/40 |
| PT | 10/10 | 10/10 | 27/40 |
| RO | 10/10 | 10/10 | 30/40 |
| SK | 10/10 | 10/10 | 30/40 |
| SI | 10/10 | 10/10 | 30/40 |
| ES | 10/10 | 10/10 | 40/40 |
| SE | 10/10 | 10/10 | 23/40 |

**Interpretation:** an observation is a government-sector expenditure figure, **not** a ministry/agency decision-power attestation. A country showing 30/40 observations is not necessarily less transparent than one with 40/40: it may have no separately constituted state or social-security-fund subsector. An absent record is not automatically zero. This sweep **does not** validate any of the 270 individual named 'largest budget managers'.

## What this source can establish — and what it cannot

1. The official [Eurostat COFOG government expenditure dataset](https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table?lang=en) contains publicly reported actual expenditure for central government (S1311), state/regional government (S1312), local government (S1313), social-security funds (S1314), and the consolidated national total (S13). Its official source is national statistical authorities transmitting ESA 2010 Table 11. This is available in the **same classification** for each EU country and function if that value was reported. The sweep stores **missing cells as missing**, not zero.
2. Crucial [Eurostat metadata §18.5](https://webgate.ec.europa.eu/eurostat/cache/metadata/en/gov_10a_exp_esms.htm): general-government expenditure consolidates transfers between government units (transactions D4, D7, D9), so **subsector sums need not equal the national total**. We display values separately in **million EUR**, never add them to claim the share controlled by each unit.
3. **Not established:** which **named ministry**, parliament, region, municipality, insurer or fund has final discretion, votes the budget, transfers the money, or manages the **largest reconciled amount** within a broad COFOG function. We do not rank institutions from Eurostat sector amounts.
4. A legal power or provision duty for a **particular service** (e.g. Czech municipalities and local roads) cannot be extended to all of that category. See [official Czech competence evidence](authority-sources.md). These sources were reviewed against 2026 legal positions, not independently verified effective law versions for 2021–2024.

## Country-by-country sweep and national budget-source starting points

**Universal official reporting source for ALL rows:** Eurostat `gov_10a_exp` (linked above) and the generated `data/institutional-spending.json` source snapshot (after successful CI). The `sweep` field is a machine-readable country-by-year audit with explicit numeric counts of reported observations.

The budget-document sources below are individually checked official publications, **not** yet mapped to all ten COFOG categories. In 'Not yet reviewed', the project has not yet identified and verified an official treasury portal or country-specific legal-budget crosswalk.

| EU country | Official national budget documentation | Named category budget manager |
|---|---|---|
| AT | [Federal budget and execution CSV](https://www.bmf.gv.at/services/startseite-budget.html) | **Not verified** |
| BE | Not yet reviewed by this project | **Not verified** |
| BG | Not yet reviewed by this project | **Not verified** |
| HR | [Finance Ministry 2024 state-budget accounts](https://mfin.gov.hr/proracun-86/drzavni-proracun-2024-godina/3504) | **Not verified** |
| CY | Not yet reviewed by this project | **Not verified** |
| CZ | [MONITOR national and local budget accounts](https://monitor.statnipokladna.gov.cz/) | **Not verified** |
| DK | Not yet reviewed by this project | **Not verified** |
| EE | [Finance Ministry state-budget documents](https://fin.ee/en/public-finances-and-taxes/state-budget-and-economy) | **Not verified** |
| FI | Not yet reviewed by this project | **Not verified** |
| FR | Not yet reviewed by this project | **Not verified** |
| DE | [Federal digital budget chapter explorer](https://www.bundeshaushalt.de/DE/Bundeshaushalt-digital/bundeshaushalt-digital.htm) | **Not verified** |
| EL | Not yet reviewed by this project | **Not verified** |
| HU | [2024 enacted state budget law](https://njt.jog.gov.hu/jogszabaly/2023-55-00-00) | **Not verified** |
| IE | [Government public expenditure explorer 2024](https://www.whereyourmoneygoes.gov.ie/en/2024/) | **Not verified** |
| IT | Not yet reviewed by this project | **Not verified** |
| LV | Not yet reviewed by this project | **Not verified** |
| LT | Not yet reviewed by this project | **Not verified** |
| LU | Not yet reviewed by this project | **Not verified** |
| MT | Not yet reviewed by this project | **Not verified** |
| NL | Not yet reviewed by this project | **Not verified** |
| PL | Not yet reviewed by this project | **Not verified** |
| PT | Not yet reviewed by this project | **Not verified** |
| RO | Not yet reviewed by this project | **Not verified** |
| SK | Not yet reviewed by this project | **Not verified** |
| SI | Not yet reviewed by this project | **Not verified** |
| ES | Not yet reviewed by this project | **Not verified** |
| SE | Not yet reviewed by this project | **Not verified** |

**Status distinction:** 'Not yet reviewed' means **no national official budget portal was added to the source register after individual inspection**. 'Not verified' means no reliable full COFOG-to-institution reconciliation has been completed. Neither status implies official documents do not exist or the public cannot access them.

## Per-country investigations required before naming a main budget manager

For **every** one of the 27 countries and each of the 10 functions:

- Identify the legal authority that **sets rules**, the body that **approves allocations**, the institution that **executes the budget**, and any regional/municipal or social-security entities with autonomy.
- Obtain official 2024 **actual budget execution**, not only draft appropriations. Determine which budget **chapters/programmes** match each COFOG purpose and whether they are already recorded by other institutions.
- Trace intra-government transfers so the same money is not attributed twice to the sending ministry and recipient municipality.
- Reconcile the result to the Eurostat 2024 consolidated national-accounts figure, documenting explicit differences in public-sector definitions, timing, grants, social insurance and non-profit public entities.
- Only then label a named institution **largest budget manager** and publish a transparent ratio with its numerator, denominator, effective year, original official document and uncertainty.
- Preserve unavailable/unverified statuses if official records do not permit a defensible match.

## Reproducibility

```sh
npm run data:refresh
npm run institutional:refresh
npm run test:report
npm run build
```

GitHub Actions performs those steps and logs a 27-row 2024 coverage table: **country | complete consolidated COFOG functions | functions with published subsector figures | individual published cells**. The main static snapshot is cross-checked against this independently retrieved official extract. Absent/invalid data must never be backfilled or manufactured.

## Remaining risks

2024 may contain provisional/revised government-finance statistics, regional/state level does not exist as a separate subsector in every country, social-security funds may be classified within another subsector, and legal decision-making discretion may lie at a different level from recorded expenditure. Even where a large sum is attributed to a sector, that is **not a named ministry or an independent budget choice**. No full country-specific manager ranking or 270 legally validated manager claims are asserted here.
