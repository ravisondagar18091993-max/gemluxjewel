# Demo PDP Product Import

Import this file in **Shopify Admin → Products → Import** to create demo products with full PDP-style variants:

- **File:** `data/demo-pdp-product.csv`

## Products included

| Handle | Title | Variants | Price (from) |
|--------|-------|----------|--------------|
| `nature-inspired-dutch-marquise-demo` | Nature Inspired Engagement Ring Using Dutch Marquise Diamond (Demo) | 275 | $994.00 |
| `0-5-carat-round-moissanite-solitaire-demo` | 0.5 Carat Round Moissanite Solitaire Ring With Side Stones (Demo) | 275 | $129.00 |
| `emerald-bezel-solitaire-ring-demo` | Emerald Cut Bezel Solitaire Engagement Ring (Demo) | 275 | $1,895.00 |

**825 total variant rows** across 3 demo products, each covering:
  - Metal Type: Silver, Gold, Platinum
  - Karat: Standard (Silver/Platinum), 10K / 14K / 18K (Gold)
  - Metal Color: Standard (Silver/Platinum), White / Yellow / Rose Gold
  - Diamond Size: 1.00, 1.70, 2.00, 3.00, 4.00
  - Ring Size: 5–9

## Option names (must match exactly)

1. Metal Type  
2. Karat  
3. Metal Color  
4. Diamond Size  
5. Ring Size  

Products **without** variants still show the full picker UI in demo mode (visual only; add to cart uses the default variant).

## After import

1. Add product images in admin  
2. Set compare-at price if needed  
3. Assign template: default `product`  
