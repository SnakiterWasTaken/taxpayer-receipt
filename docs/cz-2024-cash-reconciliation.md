# Czechia 2024 — cash public-budget COFOG and transfer reconciliation

**Official publisher:** Czech Ministry of Finance. [Government Finance Statistics 2024](https://mf.gov.cz/cs/rozpoctova-politika/makroekonomika/statistika-vladniho-sektoru/2024/vladni-financni-statistika-2024-60237), Table 5, *Výdaje podle funkcí vládních institucí*, in **million CZK**. Released 30 June 2025, updated 31 July 2025. Source also exposes Tables 1–4 with cash flows, transfers, and functional breakdowns.

This is **public-budget CASH Government Finance Statistics (GFS)**, NOT ESA2010 accrual `gov_10a_exp`, NOT the `2024 state-budget chapter outturn`, and NOT proof which individual minister, municipal council or public institution has final authority over each amount.

## Exact column interpretation

The source Table 5 lists eight components per function in order:

1. Central-government ordinary budget accounts (gross).
2. Central-government extra-budgetary funds (gross).
3. Social-security funds (gross).
4. **Negative:** transfers/consolidation between those central-budget groups.
5. **Central public budgets after their internal consolidation** (rounded source total).
6. **Local public budgets before cross-level elimination** (gross).
7. **Negative:** cross-level central/local transfers and other consolidation adjustments.
8. **National public-budget functional expenditure**, after consolidation, in **million CZK**.

Within rounding: `central net = central budget accounts + extra-budget funds + social-security funds + internal central adjustment`; `public budget function = central net + local gross + cross-level adjustments`. Source figures are independently rounded to the nearest million, so ±2 million CZK per equation is allowed. Do not divide gross local amounts by national totals as a claim of discretionary budget ownership.

## Every 2024 function (official Table 5)

| COFOG purpose | Central net (CZK m) | Local gross (CZK m) | Cross-level adjustment (CZK m) | Public-budget final (CZK m) |
|---|---:|---:|---:|---:|
| GF01 General public services | 232,333 | 103,754 | -16,648 | 319,438 |
| GF02 Defence | 146,409 | 2,315 | -5 | 148,719 |
| GF03 Public order and safety | 115,835 | 15,900 | -934 | 130,801 |
| GF04 Economic affairs | 359,323 | 157,781 | -19,824 | 497,280 |
| GF05 Environmental protection | 23,923 | 52,234 | -7,493 | 68,664 |
| GF06 Housing and community amenities | 33,006 | 66,461 | -16,298 | 83,168 |
| GF07 Health | 520,202 | 19,413 | -146 | 539,469 |
| GF08 Recreation, culture and religion | 27,985 | 57,374 | -2,540 | 82,818 |
| GF09 Education | 271,339 | 264,321 | **-204,763** | **330,897** |
| GF10 Social protection | 969,830 | 47,841 | -31,257 | 986,414 |

**Sanity check:** adding these ten official net functional rows gives **CZK 3,187,668 million**, but the source Table 5 contains a further **CZK -29,741 million** adjustment for the proceeds from selling non-financial assets, yielding the **published public-budget total CZK 3,157,927 million**. The difference is therefore an explicit source adjustment, **not a missing COFOG category** or evidence of fraud. The source is rounded to whole millions, not exact crowns.

The **Education** example shows why naive central/local totals fail: the central net (271,339) and local gross (264,321) would add to 535,660 million, but **204,763 million** is removed, giving **330,897 million**. This adjustment includes intra-government transfers. It does not mean all the adjustment was a discretionary education decision by either level.

## Separately verified 2024 municipal legal budget powers

The **2024 version** of the official [Municipalities Act 128/2000, §§84 and 102](https://e-sbirka.gov.cz/sb/2000/128/2024-01-01) states:
- Municipal **councils** approve the municipal budget and its final accounts (§84(2)(b)).
- Municipal **executive councils** (`rada obce`) implement budget management and make authorised budget amendments within limits delegated by elected councils (§102(2)(a)).

This is **budget approval/implementation** evidence for ordinary municipal self-government, not evidence that every transfer is free of central conditions or that one municipality 'controls' every local-budget expenditure.

## MONITOR and institutional reconciliation status

- **Official [Ministry of Finance MONITOR open-data catalogue](https://monitor.statnipokladna.gov.cz/datovy-katalog/open-data)** supports annual transaction and master-data CSV/XML extracts as well as machine-readable data-set metadata. It includes the **FIN 2-12 M — 12/2024** statement for local government, municipalities, regions and associations.
- **Government-published [national data catalogue](https://data.gov.cz/datov%C3%A9-sady?kl%C3%AD%C4%8Dov%C3%A1-slova=FIN&kl%C3%AD%C4%8Dov%C3%A1-slova=obdob%C3%AD+12%2F2024)** lists December 2024 FIN 2-12 M (local), FIN 1-12 OSS (state chapters) and FIN 1-12 SF (state funds) separately. The data model must also account for Prague district statements when constructing any national aggregation.
- **Not yet executed:** download, schema/period verification, de-duplication and reconciliation of full FIN statement rows to the 2024 functional table; extraction of named individual municipal and regional actual-expense managers; and the source-verified crosswalk from budget paragraphs and chapters to the UN COFOG purpose.
- The `2024 Ministry of Finance GFS public-budget cash table` itself already publishes the **aggregated cross-level consolidation** for ten functions. This is verified, without yet publishing a claim about **any named municipality's amount**.

## Official ZIP provenance probe — 26 October 2026

The national open-data catalogue identifies the 2024 December local-government FIN extract and separately the Prague magistrate/district statement. Their original official downloadable ZIP addresses and catalogue identities are recorded in `scripts/probe-fin-2024.py`. A reproducible read-only GitHub Actions probe records source checksum and header shape **if the archive can be downloaded**; it does not aggregate/publish municipality spending. The local runtime could not reach MONITOR due to external DNS restrictions, so CI may still report BLOCKED. All attempts and future results belong in `docs/TEST_LOG.md`.

The raw FIN source's ZIP/CSV headers are **not** automatically a map from budget paragraph to COFOG and do not prove spending decision-making authority.

## What must happen before naming a 'largest budget manager'

1. Download original **2024 FIN 1-12 OSS** chapter/paragraph and **2024 FIN 2-12 M** local government institution/paragraph datasets from official public distributions, keeping checksums and provider metadata.
2. Identify the official 2024 fiscal-classification functional code-to-COFOG correspondence; mark ambiguous mappings, grants, state-funded schools and local spending explicitly.
3. Reconcile municipal budget totals against the GFS **local gross figures** in this table, including Prague municipal boroughs and regional budgets without duplicate grouping.
4. Trace official cash transfers from chapters to cities/regions, preserving both payer and recipient but attributing final expenditure only once.
5. Join explicit, year-effective council/ministry/social-insurer decisions (policy powers, appropriation, operating discretion) with **recorded** spending amounts; do not infer discretionary authority merely from the payer's name.
6. Publish an institution/category 'largest budget manager' **only** when the verified eligible coverage and numerator/denominator permit comparison. If not, retain **not yet verified by this project**.

The existing [2024 Czech 48-chapter actual ledger](countries/cz-budget-chapters-2024.md) is a different cash source that supports step 1's chapter totals, not the function-level crosswalk. The existing [EU27 Eurostat sector sweep](eu27-authority-sweep.md) is an ESA2010 dataset, not a compatible denominator for these cash sums. No numbers are added between them.
