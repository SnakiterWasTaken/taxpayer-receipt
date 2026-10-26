# EU-27 interactive map — provenance and limits

The map is a **navigation aid**, not a territorial/legal or financial classification. It changes the currently selected EU member state in the same official Eurostat dataset used by the former country dropdown. The selected spending year and all financial values retain their existing definitions and validation.

## Artwork and source licences

- **Borders:** [Natural Earth Admin-0 Countries, 1:10m](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/) via [datasets/geo-countries](https://github.com/datasets/geo-countries) (Open Data Commons Public Domain Dedication and License 1.0 / Natural Earth public domain). Original coordinates were locally projected and simplified into 27 country SVG contours in `src/eu-map-geometry.js`. Source: `data/countries.geojson`, with the 27 Eurostat member codes matched to country polygons; its Greek ISO `GR` corresponds to Eurostat UI `EL`.
- **Flags:** [lipis/flag-icons](https://github.com/lipis/flag-icons/tree/main/flags/4x3), MIT Licence. One national SVG flag per member is bundled locally in `assets/flags`. The original MIT attribution and full licence text are retained in `assets/flags/LICENSE`. No remote flag service, tracker or geocoding API is needed at page load.

Flags appear **clipped within** their corresponding geographic silhouettes only for the selected, hovered or keyboard-focused country. Unselected countries have a monochrome contour. Accessibility text identifies every country, even without reliance on colour.

## Geographic limits

- Simplified contours are **schematic** and do not resolve contested borders, maritime jurisdictions or sovereignty claims. Do not use for navigation, legal boundaries or territorial conclusions.
- The displayed viewport covers geographic Europe and Cyprus; remote overseas territories and some islands outside this crop are not drawn. Country **spending totals are unaffected** and continue to follow Eurostat's country coverage.
- Tiny states such as Luxembourg and Malta are difficult to hit precisely on narrow touchscreens. The selector provides clearly labelled small-country shortcuts and an ordinary accessible country list. Use these to select any EU state without needing pixel-precision map taps.
- Map paths are navigation silhouettes, not a new economic data source. No pan/zoom/network map service has been introduced.

## Acceptance

Retain 27 distinct country shapes; verify all codes against `src/config.js`; ensure the selected flag/outline, status text, optional list and URL agree on the country; verify keyboard Enter/Space and touch; confirm 320–430px viewport page containment; and preserve all existing source/audit safeguards for the chart.
