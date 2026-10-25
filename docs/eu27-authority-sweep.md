# EU27 government expenditure and decision-authority sweep

**Status as of 25 October 2026:** automated national-accounts sweep designed for all **27 EU Member States, ten COFOG spending categories and years 2021–2024**; official API execution and exact data coverage will be recorded by CI. A national ledger/municipal-law audit has **not** been completed for all countries. A country with no verified national budget portal listed below is **not** a country without published government accounts.

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
