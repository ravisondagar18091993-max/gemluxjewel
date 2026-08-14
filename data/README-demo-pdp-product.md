# Demo PDP Product Import

Import this file in **Shopify Admin → Products → Import**:

- **File:** `data/demo-pdp-product.csv`
- **Also copied to:** `Downloads/demo-pdp-product.csv`

Uses the same column headers as Shopify’s **product_template.csv** (new import format).

## Products included

| Handle | Title | Variants | Price (from) |
|--------|-------|----------|--------------|
| `nature-inspired-dutch-marquise-demo` | Nature Inspired Engagement Ring Using Dutch Marquise Diamond (Demo) | 75 | $994.00 |
| `0-5-carat-round-moissanite-solitaire-demo` | 0.5 Carat Round Moissanite Solitaire Ring With Side Stones (Demo) | 75 | $129.00 |
| `emerald-bezel-solitaire-ring-demo` | Emerald Cut Bezel Solitaire Engagement Ring (Demo) | 75 | $1,895.00 |

**225 total variant rows** across 3 demo products.

## Variant options (3 — Shopify CSV limit)

Shopify product CSV supports **at most 3 options**. This file uses:

1. **Metal Type** — Silver, Gold, Platinum  
2. **Diamond Size** — 1.00, 1.70, 2.00, 3.00, 4.00  
3. **Ring Size** — 5, 6, 7, 8, 9  

Karat and Metal Color are **not** in the CSV (they exceed the 3-option limit). The PDP still shows the full metal/karat/color UI when those options are missing from the product — gold tabs and swatches appear in demo-style fallback.

## Required fields for products to appear in admin

Each product’s **first row** includes:

- `Status`: **Active**
- `Published on online store`: **TRUE**
- `Vendor`: Gemluxjewels.com

Variant rows repeat `URL handle` only; Title and Description are blank.

## Regenerate the CSV

```bash
node data/generate-shopify-product-csv.js
```

Reads headers from `Downloads/product_template.csv` and writes `data/demo-pdp-product.csv`.

## After import

1. Confirm **3 products** in Products list (filter: All / Active).
2. Add product images in admin.
3. Open a product on the storefront to test the PDP variant picker.

## Import preview should show

- **3 products** (not 225)
- **225 SKUs / variants** total
- Example price: **$994.00**
