const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'demo-pdp-product.csv');
const DIAMOND_SIZES = ['1.00', '1.70', '2.00', '3.00', '4.00'];
const RING_SIZES = ['5', '6', '7', '8', '9'];
const GOLD_KARATS = ['10K', '14K', '18K'];
const GOLD_COLORS = ['White Gold', 'Yellow Gold', 'Rose Gold'];

const PRODUCTS = [
  {
    handle: '0-5-carat-round-moissanite-solitaire-demo',
    title: '0.5 Carat Round Moissanite Solitaire Ring With Side Stones (Demo)',
    skuPrefix: 'DEMO-MOI-05',
    price: 12900,
    compare: 27500,
    body: '<p>Demo moissanite solitaire with full PDP variant options for metal, karat, color, stone size, and ring size.</p>',
  },
  {
    handle: 'emerald-bezel-solitaire-ring-demo',
    title: 'Emerald Cut Bezel Solitaire Engagement Ring (Demo)',
    skuPrefix: 'DEMO-EMZ-BEZ',
    price: 189500,
    compare: 249500,
    body: '<p>Demo emerald bezel solitaire with full PDP variant options for metal, karat, color, diamond size, and ring size.</p>',
  },
];

function esc(value) {
  const string = String(value);
  if (/[",\n]/.test(string)) {
    return `"${string.replace(/"/g, '""')}"`;
  }
  return string;
}

function toRow(cols) {
  return `${cols.map(esc).join(',')}\n`;
}

function addRow(lines, product, metal, karat, color, diamond, ring) {
  let sku;
  if (karat === 'Standard') {
    sku = `${product.skuPrefix}-${metal}-${diamond}-${ring}`;
  } else {
    sku = `${product.skuPrefix}-Gold-${karat}-${color.replace(/ /g, '')}-${diamond}-${ring}`;
  }

  lines.push(
    toRow([
      product.handle,
      product.title,
      'Metal Type',
      metal,
      'Karat',
      karat,
      'Metal Color',
      color,
      'Diamond Size',
      diamond,
      'Ring Size',
      ring,
      sku,
      product.price,
      product.compare,
      product.body,
      'TRUE',
    ])
  );
}

const lines = [];

for (const product of PRODUCTS) {
  for (const diamond of DIAMOND_SIZES) {
    for (const ring of RING_SIZES) {
      addRow(lines, product, 'Silver', 'Standard', 'Standard', diamond, ring);
      addRow(lines, product, 'Platinum', 'Standard', 'Standard', diamond, ring);
    }
  }

  for (const karat of GOLD_KARATS) {
    for (const color of GOLD_COLORS) {
      for (const diamond of DIAMOND_SIZES) {
        for (const ring of RING_SIZES) {
          addRow(lines, product, 'Gold', karat, color, diamond, ring);
        }
      }
    }
  }
}

fs.appendFileSync(csvPath, lines.join(''));
console.log(`Appended ${lines.length} rows (${lines.length / PRODUCTS.length} variants x ${PRODUCTS.length} products)`);
