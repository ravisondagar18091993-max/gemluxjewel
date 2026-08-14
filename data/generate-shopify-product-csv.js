const fs = require('fs');
const path = require('path');

const templatePath = path.join('C:', 'Users', 'ravis', 'Downloads', 'product_template.csv');
const outputPath = path.join(__dirname, 'demo-pdp-product.csv');

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

const METALS = ['Silver', 'Gold', 'Platinum'];
const DIAMONDS = ['1.00', '1.70', '2.00', '3.00', '4.00'];
const RINGS = ['5', '6', '7', '8', '9'];

const PRODUCTS = [
  {
    handle: 'nature-inspired-dutch-marquise-demo',
    title: 'Nature Inspired Engagement Ring Using Dutch Marquise Diamond (Demo)',
    description: '<p>Demo engagement ring for PDP variant UI testing.</p>',
    type: 'Engagement Ring',
    tags: 'demo, pdp, engagement-ring',
    price: '994.00',
    compare: '1421.00',
    skuPrefix: 'DEMO-NIDR',
  },
  {
    handle: '0-5-carat-round-moissanite-solitaire-demo',
    title: '0.5 Carat Round Moissanite Solitaire Ring With Side Stones (Demo)',
    description: '<p>Demo moissanite solitaire for PDP variant UI testing.</p>',
    type: 'Engagement Ring',
    tags: 'demo, pdp, moissanite',
    price: '129.00',
    compare: '275.00',
    skuPrefix: 'DEMO-MOI05',
  },
  {
    handle: 'emerald-bezel-solitaire-ring-demo',
    title: 'Emerald Cut Bezel Solitaire Engagement Ring (Demo)',
    description: '<p>Demo emerald bezel solitaire for PDP variant UI testing.</p>',
    type: 'Engagement Ring',
    tags: 'demo, pdp, emerald',
    price: '1895.00',
    compare: '2495.00',
    skuPrefix: 'DEMO-EMZBEZ',
  },
];

const rows = [templateHeader.join(',')];

for (const product of PRODUCTS) {
  let isFirst = true;

  for (const metal of METALS) {
    for (const diamond of DIAMONDS) {
      for (const ring of RINGS) {
        const row = emptyRow();
        const sku = `${product.skuPrefix}-${metal}-${diamond.replace('.', '')}-${ring}`;

        setCol(row, 'URL handle', product.handle);
        setCol(row, 'Option1 name', 'Metal Type');
        setCol(row, 'Option1 value', metal);
        setCol(row, 'Option2 name', 'Diamond Size');
        setCol(row, 'Option2 value', diamond);
        setCol(row, 'Option3 name', 'Ring Size');
        setCol(row, 'Option3 value', ring);
        setCol(row, 'SKU', sku);
        setCol(row, 'Price', product.price);
        setCol(row, 'Compare-at price', product.compare);
        setCol(row, 'Charge tax', 'TRUE');
        setCol(row, 'Inventory tracker', 'shopify');
        setCol(row, 'Inventory quantity', '25');
        setCol(row, 'Continue selling when out of stock', 'DENY');
        setCol(row, 'Requires shipping', 'TRUE');
        setCol(row, 'Fulfillment service', 'manual');
        setCol(row, 'Gift card', 'FALSE');

        if (isFirst) {
          setCol(row, 'Title', product.title);
          setCol(row, 'Description', product.description);
          setCol(row, 'Vendor', 'Gemluxjewels.com');
          setCol(row, 'Type', product.type);
          setCol(row, 'Tags', product.tags);
          setCol(row, 'Published on online store', 'TRUE');
          setCol(row, 'Status', 'Active');
          isFirst = false;
        }

        rows.push(joinCsvLine(row));
      }
    }
  }
}

fs.writeFileSync(outputPath, `${rows.join('\n')}\n`, 'utf8');
console.log(`Wrote ${rows.length - 1} variant rows for ${PRODUCTS.length} products to ${outputPath}`);
