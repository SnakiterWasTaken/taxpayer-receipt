# EUROMOD integration experiment — validation only

**State:** Interface and release-monitoring tools implemented. **No real EUROMOD simulation or Czech model parity has yet been established.** Nothing here automatically alters `src/tax/cz.js`, publishes new tax thresholds, or is used in live taxpayer estimates.

Official sources: [JRC download portal](https://euromod-web.jrc.ec.europa.eu/download-euromod/), [Python connector documentation](https://ec-jrc.github.io/JRC-EUROMOD-software-source-code/notebooks/getstarted.html), [EUROMOD conventions](https://euromod-web.jrc.ec.europa.eu/resources/modelling-conventions), [model XML format](https://euromod-web.jrc.ec.europa.eu/sites/default/files/2024-01/Help_file_I6.0%2B_0.pdf).

## Components and licensing

- **Software connector/executable:** EUPL-1.2 open-source components, separate installer EULA. Not bundled here; read upstream terms before installation/redistribution.
- **Coded country policy model:** CC BY 4.0, downloaded from JRC. Not bundled or auto-downloaded by this repository.
- **Training data:** freely distributed with public model packages; public training data are not confidential EU-SILC microdata. Never commit private EU-SILC data.
- The model includes `XMLParam/CZ.xml` (historical EUROMOD XML format), `XMLParam/CZ_DataConfig.xml`, and `Input/CZ_training_data.txt` in its extracted package. Confirm the specific model's format before executing tools. The newer experimental EM4 format may differ from the classic XML layout.

The September 2026 beta `J2.54+` includes 2026 systems; the February 2026 stable `J2.0+` covers through 2025. These are the initial reference versions in `data/euromod/release-baseline.json`.

## First validation step: comparing official policy versions

Download **two official country model releases**, confirm SHA256, and extract them or point to their ZIP archives:

```sh
python3 scripts/euromod/model_diff.py --country CZ \
  --old /path/to/J2.0+_model.zip --new /path/to/J2.54+_model.zip \
  --output /tmp/euromod-cz-diff.json
```

The diff focuses on the model's Czech country XML and identifies altered XML nodes and values. This is a **structural change report, not a mapping of changes to Czech legislation**. Model corrections, ordering changes, or revised identifiers also create differences. Unknown model packaging causes an explicit error; there is no fallback to fabricated rules.

## Second step: run the real Czech policy system against JRC training data

Install a compatible EUROMOD engine following JRC instructions, and use the public Python connector:

```sh
python3 -m pip install euromod pandas
python3 scripts/euromod/run_training.py \
  --model /path/to/extracted/euromod-model-root \
  --years 2024 2025 2026 \
  --output /tmp/euromod-training-probe.json
```

The script actually calls `Model(model_root).countries['CZ'].systems['CZ_2024'].run(...)` for each requested year, using `CZ_training_data`. It checks core output columns `ils_taxin` and `ils_sicee` and records only non-personal aggregate metadata. Failure to install or execute EUROMOD reports **not completed**. On macOS, use a compatible virtual machine or other supported environment if necessary.

This probe **does not show parity** with our live full-year wage estimator: EUROMOD training cases vary in employment, family situation, credits and benefits, and its income outputs are generally **monthly**, not annual. The website takes an **annual CZK gross** figure. Comparing them blindly produces bogus discrepancies.

## Third step: reviewed household benchmark (not yet executed)

1. Using JRC's hypothetical household tool or a documented, fully specified training-row transformation, create exact comparable input cases (employment pay, household members, ages, eligibility, region, all other income zero). Verify the model's input income unit and conversion to **monthly** pay.
2. Run the same cases under `CZ_2024`, `CZ_2025`, `CZ_2026` and inspect standard outputs: `ils_taxin` for income tax, `ils_sicee` for *combined* employee social/health insurance where modelled, `ils_sicer` employer SIC, `ils_dispy` for disposable income. Family/child tax bonuses require a **country-specific output mapping**; do not infer from `ils_dispy` alone.
3. Convert verified outputs to **CZK/year**, record the model release SHA256, training/scenario definition, explicit output variables, and human review. Start from `data/euromod/cz-benchmarks.template.json` but do not commit it as a validated reference.
4. Run:

```sh
node scripts/euromod/compare_cz.mjs \
  --input /path/to/reviewed-cz-cases.json \
  --output /tmp/cz-euromod-comparison.json
```

No default data is provided. The CLI **rejects** missing evidence and synthetic fixtures (except explicitly during unit tests). A difference requires investigation; EUROMOD may simulate a broader set of benefits and use a different timing convention than our Czech salary estimator. Neither model is treated as infallible.

## Monitoring releases

`.github/workflows/euromod-release-watch.yml` checks the JRC public download page weekly. On a **new model version**, it opens a deduplicated GitHub issue for review. It does not infer changes to individual tax rates, detect same-version corrections, auto-approve a model, or auto-update live calculations.

Run locally:

```sh
python3 scripts/euromod/release_watch.py --output /tmp/latest-euromod-releases.json
```

If the upstream page structure changes or is unavailable, the workflow **fails visibly**, rather than declaring the unchanged model current. Review the version baseline only after a model has been assessed. Specific mid-year changes to domestic tax laws still require national-source monitoring beyond EUROMOD's policy snapshots.

## Release readiness gate

A country's rules may be updated only when: official government legislation has been checked, applicable dates are represented, an approved country-specific input/output mapping exists, JRC results have been independently compared to our engine using representative households, mismatches are understood, and regression tests pass. Any public change is reviewed in a pull request. This experimental integration never deploys policy changes by itself.
