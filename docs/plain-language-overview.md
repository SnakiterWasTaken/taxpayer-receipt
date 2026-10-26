# Plain-language country overview — editorial and data contract

The site answers **where public money typically goes, how that compares internationally and what trends deserve scrutiny**. It is not a transaction audit. [V1 release gates](v1-release-readiness.md) apply.

## User-facing order

1. **Interactive donut/pie, above the fold** for the selected country and spending year. Each slice states the COFOG function and share on hover/focus and opens the matching breakdown on activation. All categories must remain discoverable without a pointer.
2. **Ten individual breakdowns**, largest first: everyday-language category meaning, percentage, and optional country-specific evidence about public authorities. Do **not** label a ministry as the unique global owner of a COFOG function. Ministries and operational responsibility vary by country; central, regional, local and social-security bodies may share responsibility. If official country-specific authority has not been verified, show **not verified**, not a guessed ministry.
3. **Top three categories**, followed by small, sourced observations drawn from the same comparison-year dataset. This is not a judgement of efficiency.
4. **Financial pressure context**: an approachable, clearly separate row of sourced national indicators, with periods and interpretation limits. Candidate indicators: debt-to-GDP, annual deficit/surplus as a share of GDP, interest expenditure as a share of revenue, inflation and purchasing-power trend. Each card must say what the number can and **cannot** demonstrate. Inflation and income data already exist; **do not invent** debt, deficit or interest data without verified cross-country sources.
5. **Popular claims, checked**: country-specific *fact-check cards* added only where evidence and a precise claim exist. Empty countries should show an honest unavailable/research-pending state or omit the card—not a generic accusation that the country's public believes a claim.

## Non-agenda editorial selection

No COFOG subcategory, ministry, demographic group or budget line receives a permanent topical spotlight simply because its share is large, trending upward or available in Eurostat. The standard ten divisions and three largest spending categories remain neutral and consistent EU-wide.

**At a glance** may show the same universal, verifiable indicators for every country (for example, inflation and household purchasing power), but must not automatically single out old-age benefits, immigration, fraud or any other politically disputed topic.

**Dive deeper** can feature a country-specific subject only after a human review documents:

- the **exact country and expenditure year**;
- a dated, credible source demonstrating that the subject is part of a substantive local public debate (not mere online popularity or editorial speculation);
- an independent statistical/public-finance source establishing the numbers and accounting basis;
- a brief, plain-language explanation that describes what can and cannot be concluded, with an explicit review date.

Eligibility is **fail-closed** in `src/local-debate-topics.js`: the reviewed registry is empty until qualifying evidence has been collected. Absent a verified entry, the entire country-specific Dive deeper section is hidden. One country's debate must not bleed into another country or reporting year. Data *availability* does not confer prominence, and there are no hard-coded topical thresholds or assumed negative implications.

Previously public **“Where do pensions fit?”** detail is no longer a universal card, automatic at-a-glance observation or cross-country comparison row. Verified Eurostat GF1002/GF1003 data and their [independent methodology](pension-transparency.html) remain intact for future evidence-gated explanations. Their shares are subsets of Social protection, never extra money or proof that spending is excessive. Do not selectively spotlight a different special topic as its replacement.

## Fact-check card contract

Each claim requires: `country`, `claim`, `claimPeriod`, `explanation` (one to three plain-language sentences), `verdict` (supported / unsupported / misleading / uncertain), `evidence` (official audit/statistics and independent fact-check where available), `sourceDates`, `metricScope`, `reviewedAt` and `limitations`. Never equate 'not measured' with zero.

**High-risk interpretation traps:**

- *Migration and public finances*: fiscal effect is not one uniform 'immigrant deficit'; distinguish time period, age and employment profiles, tax revenue, services, legal migration categories and geographic levels. Without comparable estimates, report **insufficient evidence**, not a nationality-based claim.
- *Tax fraud / evasion*: a **VAT gap** is not total tax fraud. It can include insolvency, errors, timing, avoidance and deliberate evasion. Do not divide an estimated tax gap by all state revenue or call it total lost tax receipts without a validated model and denominator.
- *Deficits and debt*: annual deficit is a **flow**, public debt a **stock**, different from spending shares and distinct from pension actuarial liabilities. Show year and definition.

**Editorial gate:** A card without a source-qualified country-specific statement, denominator and source date cannot be published as a fact check. Avoid sensational framing and implying unsupported causation. Prefer at most three relevant claims per country, revisiting only when sources materially change.

## Practical V1 limit

V1 ships the interactive spending overview, source-backed EU comparison and category explanations. Full EU27 migration/deficit/tax-evasion fact-check research is **not** a launch blocker. Add data cards incrementally in a reviewed schema, beginning with evidence-rich pilots. Financial risk cards that rely on new data must first pass national/EU source consistency checks.
