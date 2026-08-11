# Demo PDP Product Import

Import this file in **Shopify Admin → Products → Import** to create a product with full DiamondRensu-style variants:

- **File:** `data/demo-pdp-product.csv`
- **Handle:** `nature-inspired-dutch-marquise-demo`
- **275 variants** covering:
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
