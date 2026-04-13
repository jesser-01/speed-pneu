#!/usr/bin/env node

/**
 * Interactive Converter CLI
 * More user-friendly tool for converting tire data to JSON
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.clear();
  console.log(`
╔════════════════════════════════════════════════════════════╗
║    TIRE PRODUCT DATA CONVERTER - Interactive Mode           ║
╚════════════════════════════════════════════════════════════╝
  `);

  const inputPath = await question('Enter path to your CSV file: ');

  if (!fs.existsSync(inputPath)) {
    console.error('✗ File not found!');
    rl.close();
    return;
  }

  const outputPath = await question('Enter output JSON filename (default: converted.json): ') || 'converted.json';

  console.log('\n📋 Reading file...');
  
  // Read and parse file
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);

  // Detect delimiter
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';

  // Parse headers
  const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());
  
  console.log('Headers detected:', headers.join(' | '));

  // Map headers to standard names
  const headerMap = {};
  headers.forEach(h => {
    if (h.includes('dimension')) headerMap[h] = 'dimension';
    else if (h.includes('marque')) headerMap[h] = 'marque';
    else if (h.includes('reference') || h.includes('référence')) headerMap[h] = 'reference';
    else if (h.includes('stock') && h.includes('total')) headerMap[h] = 'stock_total';
    else if (h.includes('aouina')) headerMap[h] = 'stock_aouina';
    else if (h.includes('dibou')) headerMap[h] = 'stock_dibou';
    else if (h.includes('ariana')) headerMap[h] = 'stock_ariana';
    else if (h.includes('prix') || h.includes('price')) headerMap[h] = 'prix';
  });

  // Convert data
  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    const product = {};

    headers.forEach((header, index) => {
      const mappedName = headerMap[header];
      const value = values[index];

      if (mappedName && value) {
        if (mappedName.includes('stock') || mappedName === 'stock_total') {
          product[mappedName] = parseInt(value) || 0;
        } else if (mappedName === 'prix') {
          product[mappedName] = parseFloat(value) || 0;
        } else {
          product[mappedName] = value;
        }
      }
    });

    if (product.dimension && product.marque) {
      products.push(product);
    }
  }

  // Save JSON
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log(`
✓ Conversion successful!
✓ Products converted: ${products.length}
✓ Output saved to: ${outputPath}

Sample of first product:
${JSON.stringify(products[0], null, 2)}
  `);

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
});
