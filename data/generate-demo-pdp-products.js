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
    price: 129.00,
    compare: 275.00,
    body: '<p>Demo moissanite solitaire for PDP variant UI.</p>',
    bodyOnFirstRowOnly: true,
  },
  {
    handle: 'emerald-bezel-solitaire-ring-demo',
    title: 'Emerald Cut Bezel Solitaire Engagement Ring (Demo)',
    skuPrefix: 'DEMO-EMZ-BEZ',
    price: 1895.00,
    compare: 2495.00,
    body: '<p>Demo emerald bezel solitaire for PDP variant UI.</p>',
    bodyOnFirstRowOnly: true,
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

function addRow(lines, product, metal, karat, color, diamond, ring, isFirstRow) {
  let sku;
  if (karat === 'Standard') {
    sku = `${product.skuPrefix}-${metal}-${diamond}-${ring}`;
  } else {
    sku = `${product.skuPrefix}-Gold-${karat}-${color.replace(/ /g, '')}-${diamond}-${ring}`;
  }

  const body = product.bodyOnFirstRowOnly ? (isFirstRow ? product.body : '') : product.body;

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
      body,
      'TRUE',
    ])
  );
}

const lines = [];

for (const product of PRODUCTS) {
  let isFirstRow = true;
  for (const diamond of DIAMOND_SIZES) {
    for (const ring of RING_SIZES) {
      addRow(lines, product, 'Silver', 'Standard', 'Standard', diamond, ring, isFirstRow);
      isFirstRow = false;
      addRow(lines, product, 'Platinum', 'Standard', 'Standard', diamond, ring, isFirstRow);
      isFirstRow = false;
    }
  }

  for (const karat of GOLD_KARATS) {
    for (const color of GOLD_COLORS) {
      for (const diamond of DIAMOND_SIZES) {
        for (const ring of RING_SIZES) {
          addRow(lines, product, 'Gold', karat, color, diamond, ring, isFirstRow);
          isFirstRow = false;
        }
      }
    }
  }
}

fs.appendFileSync(csvPath, lines.join(''));
console.log(`Appended ${lines.length} rows (${lines.length / PRODUCTS.length} variants x ${PRODUCTS.length} products)`);
