## Official statistics cache

Run `npm run data:refresh` to generate `eu-spending.json` from Eurostat's `gov_10a_exp` JSON-stat API.

The file is intentionally not bundled in this source archive: these statistics must be generated from the live official dataset and validated before display. The published GitHub Pages workflow regenerates it before deployment. If a snapshot is unavailable, the browser can request the same source directly via Eurostat's CORS-enabled public API.

Do not manually fill missing values or treat incomplete country-years as complete. Data provenance and limitations are documented in `docs/methodology.md`.
