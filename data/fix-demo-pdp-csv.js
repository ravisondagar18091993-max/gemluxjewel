const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'demo-pdp-product.csv');
const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).filter(Boolean);
const header = lines[0];

const COL = {
  handle: 0,
  title: 1,
  option1Name: 2,
  option1Value: 3,
  option2Name: 4,
  option2Value: 5,
  option3Name: 6,
  option3Value: 7,
  option4Name: 8,
  option4Value: 9,
  option5Name: 10,
  option5Value: 11,
  sku: 12,
  price: 13,
  compare: 14,
  body: 15,
  published: 16,
};

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
      const string = String(value ?? '');
      if (/[",\n\r]/.test(string)) {
        return `"${string.replace(/"/g, '""')}"`;
      }
      return string;
    })
    .join(',');
}

function formatPrice(centsLike) {
  const raw = String(centsLike ?? '').trim();
  if (!raw) return '';
  if (raw.includes('.')) return raw;
  const num = Number(raw);
  if (Number.isNaN(num)) return raw;
  return (num / 100).toFixed(2);
}

const seenHandles = new Set();
const fixed = [header];

for (let i = 1; i < lines.length; i += 1) {
  const cols = splitCsvLine(lines[i]);
  const handle = cols[COL.handle];
  const isFirst = !seenHandles.has(handle);

  if (isFirst) {
    seenHandles.add(handle);
  } else {
    cols[COL.title] = '';
    cols[COL.body] = '';
    cols[COL.published] = '';
  }

  cols[COL.price] = formatPrice(cols[COL.price]);
  cols[COL.compare] = formatPrice(cols[COL.compare]);

  fixed.push(joinCsvLine(cols));
}

fs.writeFileSync(csvPath, `${fixed.join('\n')}\n`, 'utf8');
console.log(`Fixed ${fixed.length - 1} rows across ${seenHandles.size} products`);
