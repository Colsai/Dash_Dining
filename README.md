# Dash & Dine

A local-first, mobile-friendly restaurant and dish finder for practical DASH-style dining in Rockville, Gaithersburg, Bethesda, and the adjacent North Bethesda/Pike & Rose area.

The starter database is deliberately evidence-aware:

- `Published` means the restaurant published sodium and saturated-fat values for that serving.
- `Official components` means the displayed total was calculated from restaurant-published ingredient values and is shown with `≈` because portions vary.
- `Unknown*` means the dish is supported by an official menu/location page, but complete nutrition was not found. Unknown never means zero and is never labeled a verified fit.
- `Catalog only` means Montgomery County classified the location as a restaurant or carry-out and it has a matching record in the county's current inspection feed, but its menu has not been reviewed. These locations receive no dish or DASH ranking.
- `Directory only` means a current official area or restaurant directory listed the location when reviewed, but its menu and nutrition have not yet been reviewed. These locations also receive no dish or DASH ranking.
- User-entered estimates remain visibly labeled `Estimate`.

The starter database contains **881 restaurant/location records** and **257 reviewed dish records** as of November 8, 2026. It is broad but not guaranteed exhaustive and is not medical advice. Menus, ownership, and preparation change.

The November directory expansion added **68 previously uncovered restaurant locations**: 34 in Bethesda, 25 in Rockville, and 9 in Gaithersburg. These records were compared against the existing catalog by normalized name and address before being added. Two apparent duplicates—Maki Miki/Maki Maki Sushi and Uncle Julio's Rio Grande Cafe/Rio Grande Café—were intentionally not added a second time.

A second deep-coverage pass added **80 more current directory-listed locations**: 53 in Rockville, 14 in North Bethesda/Pike & Rose, and 13 in Gaithersburg/Kentlands/RIO. That brings the official-directory layer to **148 locations**. The pass used the City of Rockville's 2026 Global Bites directory plus the current Pike & Rose, Kentlands Market Square, and RIO dining directories. Three ambiguous same-address/name overlaps—Sweet Bakery, Tacos Tres Amigos, and Nosh Grill House—were conservatively excluded rather than risk duplicate records.

The dish layer includes **203 location-linked records** generated from current official U.S. menu or nutrition evidence for **75 locations** across Subway, Starbucks, Dunkin', Five Guys, Chick-fil-A, First Watch, Wendy's, Panera, sweetgreen, CAVA, Honeygrow, QDOBA, Potbelly, and California Tortilla. Shared chain evidence is explicitly labeled and always requires confirmation that the item is available at the selected local restaurant.

The latest fast-casual review added 27 location-linked dish records across nine local Honeygrow, QDOBA, Potbelly, and California Tortilla locations. QDOBA numeric values come from its September 2026 nutrition guide. Honeygrow entries retain published calories but are marked `Unknown*` because complete sodium and saturated-fat values were not captured; Potbelly and California Tortilla entries are also menu-supported but nutritionally unknown. California Fish Grill was checked but not added because its official location directory did not show a restaurant in Rockville, Gaithersburg, Bethesda, or North Bethesda.

The default search now requires at least **400 meal calories** so a very small side does not outrank a substantial meal simply because its sodium is low. The minimum-calorie slider can be lowered to zero or raised to 800 calories. Sodium and saturated-fat ceilings remain independent filters.

## Run locally

No installation or build step is required.

### Easiest option

Double-click `index.html`. All search, filters, ranking, editing, export, and import features work in a modern browser.

### Local web-server option

From this folder, run one of:

```powershell
python -m http.server 4173
```

or, if Python is available through the Windows launcher:

```powershell
py -m http.server 4173
```

Then open `http://localhost:4173`.

## Edit and persist data

Choose **Edit database** in the header. You can:

- add, edit, and delete restaurants;
- add, edit, and delete dishes;
- leave sodium, saturated fat, and calories blank to preserve “unknown” values;
- distinguish published values, component calculations, estimates, and unknowns;
- export the whole database to JSON;
- import a previous JSON backup; or
- restore the starter data.

Edits are stored in the browser’s `localStorage`, so they persist on that browser/profile but are not synced automatically. Export JSON before clearing browser data or moving computers.

## Data model

Curated restaurants and dishes live in `data.js`; the larger county-sourced discovery layer lives in `catalog.js`; current official-directory additions live in `area-data.js`. The runtime copy lives in `localStorage` under `dash-dine-db-v1`.

The discovery catalog is generated by matching two Montgomery County datasets on normalized restaurant name, address, and ZIP code:

- the older Food Inspection feed, which explicitly classifies each venue as `Restaurant` or `Carry Out`; and
- the current daily HHS inspection feed, used to confirm a matching location and record the latest matched inspection date.

Unmatched, ambiguous, and duplicate locations are excluded. A county inspection record supports the location record; it does not certify the menu, nutrition, current opening status, or DASH suitability.

Each dish has:

- a restaurant relationship;
- menu description;
- nullable sodium, saturated-fat, and calorie values;
- evidence type and verification date;
- source label and URL;
- ordering modifications and tags.

## Deploy later

This project is static HTML/CSS/JavaScript, so it can be deployed without a server:

1. Push this folder to a Git repository.
2. Deploy the folder with GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static host.
3. If you customized data in the browser, export JSON and copy those records into `data.js` before deploying so every visitor receives them.

For multi-user editing or shared persistence, replace `localStorage` with an API and database (for example Cloudflare D1, Supabase/Postgres, or SQLite behind a small server). Keep the current dish schema and validation rules, and add authentication before enabling public writes.

## Files

- `index.html` — accessible page structure and dialogs
- `styles.css` — responsive visual design
- `data.js` — curated restaurant and dish evidence
- `catalog.js` — generated county-sourced restaurant discovery catalog
- `area-data.js` — current official area-directory additions not found in the county layer
- `menu-data.js` — reviewed chain-menu templates expanded into local location records
- `app.js` — filters, ranking, editing, persistence, import/export

## Ranking logic

The “Best fit” sort prioritizes evidence quality, then compares known values with the user’s active sodium, saturated-fat, and minimum-calorie limits. Meals that clear the calorie minimum receive a modest boost, along with good calorie-to-sodium efficiency, vegetable/fiber/whole-grain signals, and actionable ordering modifications. Menu-only unknowns rank after sourced numerical records and never receive a verified-fit label.
