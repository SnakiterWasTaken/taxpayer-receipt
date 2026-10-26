# Czech 2024 original FIN statements — verified source profile and EU27 protocol

**Status (26 October 2026):** Actual Ministry of Finance ZIP downloads and complete CSV row profiling **PASS**; institutional spending reconciliation and named budget-manager authority **NOT VERIFIED**.

## 2024-effective legal source located (26 October 2026)

**Verified legal-version discovery:** The official [e-Sbírka historical version of Decree No. 5/2014 Sb., effective 1 January 2024 to 31 December 2025](https://e-sbirka.gov.cz/sb/2014/5/2024-01-01?odkazId=20404139) explicitly defines FIN 1-12 OSS (state organisations), FIN 1-12 SF (state funds), and FIN 2-12 M (local-government budget performance statements), with **monthly** local reporting. Annex 2 says statutory cities and Prague report a combined city-level statement. A separate district data export therefore **must not** be appended to the Prague/city-level statement before checking the exact source boundary. The Czech Ministry of Finance also hosts a [consolidated 1 January 2024 text](https://www.mfcr.cz/assets/attachments/2024-01-01_Vyhlaska-c-5-2014-Sb.pdf) and [highlighted amendment copy](https://www.mfcr.cz/assets/attachments/2024-01-01_Vyhlaska-c-5-2014-Sb-vyznacene-zmeny.pdf).

**What this does *not* verify:** The legal annex names reporting systems and sections; it does not by itself prove the extract-specific SAP/BW column semantics (especially `0FISCPER`, `0CI_TYPE`, `ZU_ROZKZ`), full row identity, official 2024 purpose-to-COFOG mapping, internal-transfer reconciliation or discretionary decision power. Those remain blocked for monetary publication. Do not read the **current**, post-2025 annex (with changed partner identifiers) as though it were the 2024 annex.

## Verified contemporary 2024 FIN 2-12 M reporting semantics

The Czech Ministry of Finance's **2024** [FIN 2-12 M correction instructions](https://mf.gov.cz/cs/rozpoctova-politika/uzemni-rozpocty/legislativa-a-metodicka-podpora-uzemnich-rozpoctu/2024/doporuceny-postup-pri-oprave-udaju-vykazanych-na-n-56625) explicitly distinguishes approved budget, budget after amendments and **`Výsledek od počátku roku` (result since the beginning of the year)**. They describe a hard check on impermissible classification items in the latter column, active for January–February 2024 submissions, and nonblocking notices for the two budget columns. This establishes the *reporting-field meaning* of the year-to-date actual **in the official FIN 2-12 M statement**, not a machine-field proof for `ZU_ROZKZ` in every CSV section, nor a reconciliation of original downloads.

**Consequence:** Do not sum a January-to-December collection of cumulative observations; a December snapshot is a *candidate* year-end selection, not a validated standalone total without section, item type, entity and transfer checks. Classifications and validation rules can change between years: use the 2024 documentation rather than 2026 instructions.

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

## State budget chapter and fund source expansion (26 October 2026)

Two further independently checked official December 2024 source distributions are queued for the same read-only bounded ZIP/CSV profiling workflow:

- [FIN 1-12 OSS — state budget chapters and state organisational units](https://data.gov.cz/datov%C3%A1-sada?iri=https://data.gov.cz/zdroj/datov%C3%A9-sady/00006947/f6ed0509c52610c3c5658712a4671b13), original `FinOSS/2024_12_Data_CSUIS_MISRIS.zip`.
- [FIN 1-12 SF — state funds](https://data.gov.cz/datov%C3%A1-sada?iri=https://data.gov.cz/zdroj/datov%C3%A9-sady/00006947/bdbd188371eb3b7417a1312d4062506e), original `FinSF/2024_12_Data_CSUIS_FINSF.zip`.

**Real source intake verified — [GitHub Actions #40244957559](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40244957559): PASS.** Both state ZIPs and both municipal ZIPs downloaded with HTTP 200 and were fully profiled.

| Original state dataset | Downloaded size | SHA-256 of actual downloaded ZIP | Main CSV rows / reporting organisation IDs |
|---|---:|---|---|
| FIN 1-12 OSS state chapters | **11,985,553 bytes** | `2b49b71cde353aad26c423642335eab5c866e67cf9c6537ed1ed7e549a82c697` | `MIS-RIS_2024012.csv`: **1,697,495 / 283** |
| FIN 1-12 SF state funds | **33,296 bytes** | `7b2e1e8428a85a8006c289df4f53ef97b3ac5ae1f4909be1cd070a63b35ab114` | `FINSF01_2024012.csv`: **1,457 / 7** |

Additional state-organisational extract sections: `ZU-MIS-RIS` **186,471 rows**, `PU3241_05` **17,487**, `ZU01` **11,299**. State-fund sections 02 **133**, 03 **7**, 04 **1,125**. All eight state/fund CSV files were fully streamed and had **zero malformed column-count rows**.

**Vital accounting hazard:** The file `MIS-RIS_2024012.csv` contains **multiple 2024 reporting periods** (`2024001` onward, plus a `0000000` special row), despite being distributed as December 2024. These look like cumulative monthly snapshots, but that interpretation and the source's year-to-date actual column must be **verified against the official 2024 manual before calculating anything**. Simply summing 1,697,495 data rows would almost certainly overstate expenditure by counting multiple months' snapshots. State-budget rows must be filtered and independently reconciled to the Ministry's final accounts.

The 2024 state fund `FINSF01` contains budget type codes `2` (196 rows), `3` (1,260 rows), and `0` (one row), along with function paragraphs and `ZU_ROZKZ` amounts. Their 2024 meanings need official codebook validation. Again, **download/profiling is not a verified COFOG attribution or discretionary budget authority**. No amounts or managers have been inferred from names.

## Measured 2024 original-extract period distribution (26 October 2026)

The updated source profiler completed in [Actions #40247441179](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40247441179) with **158/158 tests PASS** and four Ministry ZIPs inspected. The downloaded [source metadata artifact](https://github.com/SnakiterWasTaken/taxpayer-receipt/actions/runs/40247441179/artifacts/12618854314) provides actual `periodRowCounts`, not synthetic estimates.

| Primary original source section | 2024 December period `2024012` | Other recorded periods | Special `0000000` |
|---|---:|---|---:|
| FINM201 municipalities/regions | 1,367,957 | None | 1 |
| FINM201_MC Prague | 14,622 | None | 1 |
| MIS-RIS state organisations | 137,388 | 2024001–2024011, 1,560,106 combined | 1 |
| FINSF01 state funds | 1,456 | None | 1 |

**State MIS-RIS monthly period counts:** January 140,889; February 140,191; March 146,526; April 147,249; May 141,364; June 141,562; July 152,547; August 137,939; September 137,279; October 137,292; November 137,268; December 137,388. Thus the state file comprises 1,697,495 records, but only 137,388 are **December-coded**. These are row counts, **not** monetary amounts. The December-coded slice is not yet certified as annual outturn: a 2024 extract-field codebook, full dimensional row identity and budget execution/transfer reconciliation remain prerequisites. No named institution expenditure or ranking is inferred.

## Decision authority: what remains unresolved

**Do not rank a named budget manager yet.** Prague's separate extract must be checked for overlap with other reporting entities. The Czech Ministry of Finance [changed FIN 2-12 M effective 1 January 2026](https://mf.gov.cz/cs/rozpoctova-politika/uzemni-rozpocty/legislativa-a-metodicka-podpora-uzemnich-rozpoctu/2026/nova-struktura-financniho-vykazu-fin-2-12-m-od-1-l-62745), adding counterparty identifiers for many transfers. This new 2026 partner information must **not** be presumed present in the 2024 extract. Official [2024 public-budget function/transfer totals](cz-2024-cash-reconciliation.md) and the [2024 state-budget chapter outturns](countries/cz-budget-chapters-2024.md) remain separate accounting sources until a reconciliation is demonstrated.

Next: verify the 2024 budget type/purpose code dictionaries; check reporting-organisation overlaps (especially Prague), obtain official FIN 1-12 OSS and SF ZIPs, reconcile budget paragraphs and internal transfers, verify 2024 legal allocation/discretion, and only then quantify the largest **genuinely controlling** institution.

## Repeatable evidence standard for the other 26 EU states

For **each** state/year/function, record: (1) original public finance official catalogue, release, scope and licensing; (2) actual download, hash, row counts, period/organisational codes; (3) original 2024 income/expense and functional classification; (4) organisation identity, nested local jurisdictions and possible duplicate government bodies; (5) independently validated national and local outturns; (6) a source-backed COFOG bridge; (7) transfer reconciliation and cash-versus-ESA differences; (8) year-effective legal powers for policymaking, budget approval, allocation and execution; (9) the comparable numerator/denominator and audited **largest** decision-maker claim; (10) failed attempts, retests and missing-value statuses.

The existing [EU27 Eurostat sector sweep](eu27-authority-sweep.md) covers **all 27** at the sector accounting level; it **does not certify institution-level control**. Only Czechia has progressed to these original local-government FIN archives in this stage. The other 26 are pending equivalent individually verified raw official files—not categorically without public information.
