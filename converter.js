/**
 * Data Converter - Converts CSV or tabular data to JSON format
 * Usage: node converter.js input.csv output.json
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Function to convert CSV to JSON
function convertCSVToJSON(csvFilePath, outputFilePath) {
  const products = [];
  const fileStream = fs.createReadStream(csvFilePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let headers = [];
  let lineNumber = 0;

  rl.on('line', (line) => {
    lineNumber++;
    
    // Skip empty lines
    if (!line.trim()) return;

    // Parse the line (handle both comma and semicolon delimiters)
    const values = line.split(/[,;]\s*/).map(v => v.trim());

    if (lineNumber === 1) {
      // First line is headers
      headers = values.map(h => h.toLowerCase().replace(/\s+/g, '_'));
    } else {
      // Convert data row
      const product = {};
      
      values.forEach((value, index) => {
        const key = headers[index];
        if (key) {
          // Map column names to JSON keys
          switch (key) {
            case 'dimension':
              product.dimension = value;
              break;
            case 'marque':
              product.marque = value;
              break;
            case 'référence':
            case 'reference':
              product.reference = value;
              break;
            case 'stock_total':
            case 'stock total':
              product.stock_total = parseInt(value) || 0;
              break;
            case 'aouina':
              product.stock_aouina = parseInt(value) || 0;
              break;
            case 'dibou':
              product.stock_dibou = parseInt(value) || 0;
              break;
            case 'ariana':
              product.stock_ariana = parseInt(value) || 0;
              break;
            case 'prix_(dt)':
            case 'prix':
            case 'price':
              product.prix = parseFloat(value) || 0;
              break;
          }
        }
      });

      // Only add if we have at least dimension and marque
      if (product.dimension && product.marque) {
        products.push(product);
      }
    }
  });

  rl.on('close', () => {
    // Save to JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(products, null, 2));
    console.log(`✓ Conversion complete!`);
    console.log(`✓ Converted ${products.length} products`);
    console.log(`✓ Output saved to: ${outputFilePath}`);
  });

  rl.on('error', (err) => {
    console.error('Error reading file:', err);
  });
}

// Function to convert from clipboard/paste format
function convertFromPaste(inputText, outputFilePath) {
  const lines = inputText.split('\n').map(l => l.trim()).filter(l => l);
  const products = [];
  let headers = [];

  lines.forEach((line, index) => {
    // Skip empty lines
    if (!line.trim()) return;

    // Parse the line
    const values = line.split(/\t|,|;/).map(v => v.trim());

    if (index === 0) {
      // First line is headers
      headers = values.map(h => h.toLowerCase().replace(/\s+|[()]/g, '_').replace(/_{2,}/g, '_'));
    } else {
      const product = {};
      
      values.forEach((value, colIndex) => {
        const key = headers[colIndex];
        if (key && value) {
          // Normalize key names
          if (key.includes('dimension')) product.dimension = value;
          else if (key.includes('marque')) product.marque = value;
          else if (key.includes('reference') || key.includes('référence')) product.reference = value;
          else if (key.includes('stock') && key.includes('total')) product.stock_total = parseInt(value) || 0;
          else if (key.includes('aouina')) product.stock_aouina = parseInt(value) || 0;
          else if (key.includes('dibou')) product.stock_dibou = parseInt(value) || 0;
          else if (key.includes('ariana')) product.stock_ariana = parseInt(value) || 0;
          else if (key.includes('prix') || key.includes('price')) product.prix = parseFloat(value) || 0;
        }
      });

      // Only add valid products
      if (product.dimension && product.marque) {
        products.push(product);
      }
    }
  });

  // Save to JSON
  fs.writeFileSync(outputFilePath, JSON.stringify(products, null, 2));
  console.log(`✓ Conversion complete!`);
  console.log(`✓ Converted ${products.length} products`);
  console.log(`✓ Output saved to: ${outputFilePath}`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          TIRE PRODUCT DATA CONVERTER                        ║
╚════════════════════════════════════════════════════════════╝

Usage:
  node converter.js <input.csv> [output.json]

Example:
  node converter.js data.csv products.json

Supported formats:
  - CSV (comma or semicolon separated)
  - TSV (tab separated)
  - Data with headers: DIMENSION, MARQUE, RÉFÉRENCE, STOCK TOTAL, AOUINA, DIBOU, ARIANA, PRIX (DT)

If no output file is specified, 'converted.json' will be used.
  `);
} else {
  const inputFile = args[0];
  const outputFile = args[1] || 'converted.json';

  if (!fs.existsSync(inputFile)) {
    console.error(`✗ Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`Converting ${inputFile} to ${outputFile}...`);
  convertCSVToJSON(inputFile, outputFile);
}

module.exports = { convertCSVToJSON, convertFromPaste };
