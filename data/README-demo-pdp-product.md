# Demo PDP product CSV

## Import this file

**File:** `data/demo-pdp-variant-pricing.csv`

Shopify Admin → **Products** → **Import** → choose `demo-pdp-variant-pricing.csv` → **Upload and preview** → **Import products**.

## What it creates

- **Product:** Engagement Ring — Variant Pricing Demo
- **Handle:** `engagement-ring-variant-pricing-demo`
- **Variants:** 275 (11 metals × 5 diamond sizes × 5 ring sizes)

### Options

| Option | Values |
|--------|--------|
| Metal Type | Silver, Platinum, 10K White Gold, 10K Yellow Gold, 10K Rose Gold, 14K White Gold, 14K Yellow Gold, 14K Rose Gold, 18K White Gold, 18K Yellow Gold, 18K Rose Gold |
| Diamond Size | 1.00, 1.70, 2.00, 3.00, 4.00 |
| Ring Size | 5, 6, 7, 8, 9 |

### Theme picker

After import, assign the product to your **gemluxjewel main product** template. The PDP shows:

1. **Silver / Gold / Platinum** tabs first
2. **Gold sub-options** (10K White Gold, etc.) when Gold is selected

## Regenerate CSV

Uses your Shopify sample template for the exact column headers:

```bash
node data/generate-variant-pricing-demo-csv.js "C:\Users\ravis\Downloads\product_template (1).csv"
```

## Import format notes

- **Option names** (`Metal Type`, `Diamond Size`, `Ring Size`) appear **only on the first row**
- **Variant rows** include only option **values** (matches Shopify's `product_template.csv`)
- **275 variants** total — if import fails with a variant limit error, your plan may cap at **100 variants per product** (see smaller demo below)

## If import fails (100 variant limit)

Shopify Basic/standard plans often allow max **100 variants** per product. This demo has **275**.

Options:
1. Use Shopify's expanded variant limit (up to 2000 on eligible stores), or
2. Ask to generate a smaller CSV (e.g. fewer ring sizes)
