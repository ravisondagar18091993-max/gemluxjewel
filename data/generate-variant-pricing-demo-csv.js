const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'demo-pdp-product.csv');
const outputPath = path.join(__dirname, 'demo-pdp-variant-pricing.csv');

function splitCsvLine(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cols.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cols.push(current);
  return cols;
}

function joinCsvLine(cols) {
  return cols
    .map((value) => {
      const string = value == null ? '' : String(value);
      if (/[",\n\r]/.test(string)) {
        return `"${string.replace(/"/g, '""')}"`;
      }
      return string;
    })
    .join(',');
}

const templateHeader = splitCsvLine(fs.readFileSync(templatePath, 'utf8').split(/\r?\n/)[0]);
const colIndex = Object.fromEntries(templateHeader.map((name, index) => [name, index]));

function emptyRow() {
  return Array(templateHeader.length).fill('');
}

function setCol(row, name, value) {
  if (colIndex[name] == null) return;
  row[colIndex[name]] = value == null ? '' : String(value);
}

const METALS = [
  'Silver',
  'Platinum',
  '10K White Gold',
  '10K Yellow Gold',
  '10K Rose Gold',
  '14K White Gold',
  '14K Yellow Gold',
  '14K Rose Gold',
  '18K White Gold',
  '18K Yellow Gold',
  '18K Rose Gold',
];

const DIAMONDS = ['1.00', '1.70', '2.00', '3.00', '4.00'];
const RINGS = ['5', '6', '7', '8', '9'];

const METAL_BASE = {
  Silver: 1495,
  Platinum: 1995,
  '10K White Gold': 1695,
  '10K Yellow Gold': 1645,
  '10K Rose Gold': 1665,
  '14K White Gold': 1995,
  '14K Yellow Gold': 1945,
  '14K Rose Gold': 1965,
  '18K White Gold': 2295,
  '18K Yellow Gold': 2245,
  '18K Rose Gold': 2265,
};

const DIAMOND_ADD = {
  '1.00': 0,
  '1.70': 200,
  '2.00': 450,
  '3.00': 900,
  '4.00': 1400,
};

const PRODUCT = {
  handle: 'engagement-ring-variant-pricing-demo',
  title: 'Engagement Ring — Variant Pricing Demo',
  description:
    '<p>Demo product with unique prices for Silver, Platinum, and each gold karat/color (White, Yellow, Rose).</p>',
  type: 'Engagement Ring',
  tags: 'demo, pdp, variant-pricing',
  skuPrefix: 'DEMO-VRP',
};

function priceFor(metal, diamond) {
  const base = METAL_BASE[metal];
  const add = DIAMOND_ADD[diamond];
  return base + add;
}

function compareFor(price) {
  return Math.round(price * 1.32);
}

function skuFor(metal, diamond, ring) {
  const metalCode = metal
    .replace(/\s+/g, '')
    .replace('K', 'K')
    .replace('Gold', 'G')
    .replace('Silver', 'Silver')
    .replace('Platinum', 'Plat');
  const diamondCode = diamond.replace('.', '');
  return `${PRODUCT.skuPrefix}-${metalCode}-${diamondCode}-${ring}`;
}

const rows = [templateHeader.join(',')];
let isFirst = true;

for (const metal of METALS) {
  for (const diamond of DIAMONDS) {
    for (const ring of RINGS) {
      const row = emptyRow();
      const price = priceFor(metal, diamond);
      const compare = compareFor(price);

      setCol(row, 'URL handle', PRODUCT.handle);
      setCol(row, 'Option1 name', 'Metal Type');
      setCol(row, 'Option1 value', metal);
      setCol(row, 'Option2 name', 'Diamond Size');
      setCol(row, 'Option2 value', diamond);
      setCol(row, 'Option3 name', 'Ring Size');
      setCol(row, 'Option3 value', ring);
      setCol(row, 'SKU', skuFor(metal, diamond, ring));
      setCol(row, 'Price', price.toFixed(2));
      setCol(row, 'Compare-at price', compare.toFixed(2));
      setCol(row, 'Charge tax', 'TRUE');
      setCol(row, 'Inventory tracker', 'shopify');
      setCol(row, 'Inventory quantity', '25');
      setCol(row, 'Continue selling when out of stock', 'DENY');
      setCol(row, 'Requires shipping', 'TRUE');
      setCol(row, 'Fulfillment service', 'manual');
      setCol(row, 'Gift card', 'FALSE');

      if (isFirst) {
        setCol(row, 'Title', PRODUCT.title);
        setCol(row, 'Description', PRODUCT.description);
        setCol(row, 'Vendor', 'Gemluxjewels.com');
        setCol(row, 'Type', PRODUCT.type);
        setCol(row, 'Tags', PRODUCT.tags);
        setCol(row, 'Published on online store', 'TRUE');
        setCol(row, 'Status', 'Active');
        isFirst = false;
      }

      rows.push(joinCsvLine(row));
    }
  }
}

fs.writeFileSync(outputPath, `${rows.join('\n')}\n`, 'utf8');
console.log(`Wrote ${rows.length - 1} variants to ${outputPath}`);
