# Czech 2024 original FIN statements — verified source profile and EU27 protocol

**Status (26 October 2026):** Actual Ministry of Finance ZIP downloads and complete CSV row profiling **PASS**; institutional spending reconciliation and named budget-manager authority **NOT VERIFIED**.

## Official original sources and reproducible checks

[GitHub Actions run 40244283048](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40244283048) retrieved both ZIP files (HTTP 200), computed SHA-256 checksums, streamed the nine CSV members in each archive and produced the `cz-fin-source-metadata` artifact. Reproduce with `python3 scripts/probe-fin-2024.py --only all`. Only metadata—not raw financial rows—is retained in the CI artifact.

| Official Czech 2024 source | ZIP size | SHA-256 |
|---|---:|---|
| [FIN 2-12 M ÚSC municipalities and regions](https://data.gov.cz/datov%C3%A1-sada?iri=https://data.gov.cz/zdroj/datov%C3%A9-sady/00006947/a292cf11a404725b37bcef6fc39203f5) | 24,347,830 bytes | `634be377587abb45e61d2b2a7e2a12fad4a80cf531a5effa2815fe18c06a3ae6` |
| [FIN 2-12 M Prague magistrate/district statements](https://data.gov.cz/datov%C3%A1-sada?iri=https://data.gov.cz/zdroj/datov%C3%A9-sady/00006947/f9e06d391325b61670602899e652e084) | 273,477 bytes | `3efc99ea1fec8f2848fb5c441f419b4b3cef06a5c8202cd5c47cc68dc4eedf97` |

SHA-256 is **calculated from downloaded bytes**, not a Ministry-supplied cryptographic signature.

## Full source row counts

| FIN section | Main municipal/regional archive | Prague archive |
|---|---:|---:|
| 201 | 1,367,958 | 14,623 |
| 202 | 222,945 | 1,857 |
| 203 | 431,955 | 3,597 |
| 204 | 27,869 | 233 |
| 205 | 341,384 | 2,843 |
| 207 | 163,632 | 2,458 |
| 208 | 39,645 | 752 |
| 210 | 796 | 34 |
| 211 | 6,858 | 257 |

All 18 CSV members were streamed completely (under the two-million-rows-per-member cap). All had **zero malformed column-count rows**. Do **not** sum the nine sections as if they were independent transactions.

**Primary section 201:** main file has 1,367,958 budget-statement rows across **6,966 unique organisation IDs** and **403 distinct purpose codes**. Prague section 201 has 14,623 rows, **59 unique IDs** and **225 purpose codes**. Main file contains columns for government ID `ZC_ICO`, fiscal period `0FISCPER`, budget purpose `FUNC_AREA`, item `ZCMMT_ITM`, budget row type `CI_TYPE` and year-to-date actual amount `ZU_ROZKZ`. The reported 201 type codes are **2: 294,734 / 3: 1,073,223 / 0: 1** (main) and **2: 1,712 / 3: 12,910 / 0: 1** (Prague). Their meaning must be validated against the **2024 official classification**, not guessed.

Each primary file includes both period codes `2024012` and `0000000`; the meaning of the latter must be verified before an aggregation. Source amounts use decimal-point strings. No values were published from this intake because the classification, summary rows, government boundary and transfer accounting remain unverified.

## Decision authority: what remains unresolved

**Do not rank a named budget manager yet.** Prague's separate extract must be checked for overlap with other reporting entities. The Czech Ministry of Finance [changed FIN 2-12 M effective 1 January 2026](https://mf.gov.cz/cs/rozpoctova-politika/uzemni-rozpocty/legislativa-a-metodicka-podpora-uzemnich-rozpoctu/2026/nova-struktura-financniho-vykazu-fin-2-12-m-od-1-l-62745), adding counterparty identifiers for many transfers. This new 2026 partner information must **not** be presumed present in the 2024 extract. Official [2024 public-budget function/transfer totals](cz-2024-cash-reconciliation.md) and the [2024 state-budget chapter outturns](countries/cz-budget-chapters-2024.md) remain separate accounting sources until a reconciliation is demonstrated.

Next: verify the 2024 budget type/purpose code dictionaries; check reporting-organisation overlaps (especially Prague), obtain official FIN 1-12 OSS and SF ZIPs, reconcile budget paragraphs and internal transfers, verify 2024 legal allocation/discretion, and only then quantify the largest **genuinely controlling** institution.

## Repeatable evidence standard for the other 26 EU states

For **each** state/year/function, record: (1) original public finance official catalogue, release, scope and licensing; (2) actual download, hash, row counts, period/organisational codes; (3) original 2024 income/expense and functional classification; (4) organisation identity, nested local jurisdictions and possible duplicate government bodies; (5) independently validated national and local outturns; (6) a source-backed COFOG bridge; (7) transfer reconciliation and cash-versus-ESA differences; (8) year-effective legal powers for policymaking, budget approval, allocation and execution; (9) the comparable numerator/denominator and audited **largest** decision-maker claim; (10) failed attempts, retests and missing-value statuses.

The existing [EU27 Eurostat sector sweep](eu27-authority-sweep.md) covers **all 27** at the sector accounting level; it **does not certify institution-level control**. Only Czechia has progressed to these original local-government FIN archives in this stage. The other 26 are pending equivalent individually verified raw official files—not categorically without public information.
