# Czechia: 2024 state-budget chapter actual expenditure

**Source of every amount:** [Czech Ministry of Finance, State Final Account 2024, Book G, Table 7, page 32](https://mf.gov.cz/assets/attachments/2025-04-28_G-Tabulkova-cast.pdf), column **Výdaje celkem — Skutečnost 2024** (Total expenditures — Actual 2024), in **thousands of CZK**. Released 28 April 2025; the overview page has later revisions. This source was reviewed on 25 October 2026.

## What we can now state

- **48 budget chapter lines** (including chapter 373 with a reported zero after organisational change), every row transcribed in `src/cz-2024-budget-chapters.js`.
- **2,236,790,777.48 thousand CZK** actual central state-budget expenditure, which equals **2,236,790,777,480 CZK** and **2,236.79077748 billion CZK**.
- The validation test adds all 48 original lines **as integer hundredths of 1,000 CZK**. It matches the Ministry of Finance's own **Celkem** exactly with no rounding discrepancy.
- The table has budget chapters such as the Ministry of Labour and Social Affairs, Ministry of Education, Ministry of Defence, **State Debt**, and **General Treasury Administration**. These chapters are not always ministries.

| Budget chapter | 2024 actually spent (CZK bn, rounded) |
|---|---:|
| 313 Ministry of Labour and Social Affairs | 949.5 |
| 333 Ministry of Education, Youth and Sports | 275.4 |
| 398 General Treasury Administration | 233.3 |
| 307 Ministry of Defence | 159.0 |
| 327 Ministry of Transport | 109.6 |
| 314 Ministry of the Interior | 100.5 |
| 396 State Debt | 88.5 |

**These are not shares or leading managers of COFOG categories.** They are the largest lines in the **2024 state-budget chapter ledger**, across all purposes. Many entries include transfers, pensions, grants or programmes managed or delivered by others.

## What this DOES NOT prove

1. **Not the whole government:** The state budget is not the same as Eurostat's **consolidated S13 general government** including municipalities, regions, other extra-budgetary units and separate social-insurance reporting. Different classification and accounting basis; cannot add totals.
2. **Not a COFOG chapter/function crosswalk:** The Czech budget ledger groups cash expenditure by responsible budget chapter, not by the ten UN/Eurostat COFOG purpose groups. E.g. the Ministry of Transport's whole chapter amount cannot simply be put into GF04 Economic affairs, nor the Ministry of Health's chapter into GF07 Health. Several chapters finance many functions, while healthcare is substantially financed outside the ministry's own budget.
3. **Not demonstrated sole decision power:** The budget chapter or reporting administrator is not necessarily the person/institution with power over every final recipient's expenditure. A parliament can approve budgets; ministries transfer grants; regional/local bodies or social insurers can choose operational uses. Actual powers require independently sourced laws, appropriation restrictions and transaction records.
4. **No invented largest category manager:** Even with exact chapter totals, we still cannot identify who controls the biggest **reconciled** amount within one COFOG function. The site continues to label this *not verified*.

## Audit trail and next reproducible source checks

**Completed:** official PDF page checked visually, 48 total figures transcribed, integer-centi-thousand CZK reconciliation pass, country/year feature guard, table integration tests, and standard CI/build validation once run. Before CI completes, the above last check remains NOT RUN.

**Next:** Obtain the Ministry of Finance's 2024 **budget execution by paragraph and chapter**, plus MONITOR's **2024 municipal and regional actual expenditure** by functional purpose and organisation. The MF 2024 final account, Book G, Table 3 uses its own Czech functional budget classification, which requires a **documented, independently sourced crosswalk** to COFOG 1999 before adding chapter amounts to the 10 spending categories. Reconcile transfers to avoid double counting and record source versions and year. Then evaluate which institution has the **largest documented decision authority** in each individual function.

**EU27:** Apply the same labelled ledger schema to other countries only when source provides actual 2024 executed amounts **by named budget holder**. The already completed EU27 S1311/S1312/S1313/S1314 Eurostat sweep is a sector reporting baseline, not this institutional audit.

Official supporting documentation: [Ministry of Finance 2024 final account index](https://mf.gov.cz/cs/rozpoctova-politika/statni-rozpocet/plneni-statniho-rozpoctu/2024/statni-zaverecny-ucet-za-rok-2024-59626), [2024 government financial statistics](https://mf.gov.cz/cs/rozpoctova-politika/makroekonomika/statistika-vladniho-sektoru/2024/vladni-financni-statistika-2024-60237), and [MONITOR local public accounts](https://monitor.statnipokladna.gov.cz/).
