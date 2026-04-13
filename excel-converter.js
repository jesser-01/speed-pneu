/**
 * Excel to JSON Parser Utility
 * Converts .xlsx files to JSON format for the tire products dashboard
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

/**
 * Parse Excel file and convert to JSON
 * @param {string} filePath - Path to the Excel file
 * @param {string} sheetName - Sheet name (default: first sheet)
 * @returns {Array} Array of product objects
 */
function parseExcelFile(filePath, sheetName = null) {
  try {
    // Read the workbook
    const workbook = XLSX.readFile(filePath);
    
    // Get sheet name (use provided or first sheet)
    const sheet = sheetName || workbook.SheetNames[0];
    
    if (!workbook.SheetNames.includes(sheet)) {
      throw new Error(`Sheet "${sheet}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
    }

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
      defval: '',
      blankrows: false
    });

    // Normalize the data
    const products = jsonData.map(row => {
      const product = {};

      // Map all possible column name variations to standard names
      Object.keys(row).forEach(key => {
        const lowerKey = key.toLowerCase().trim();
        
        if (lowerKey.includes('dimension')) {
          product.dimension = row[key];
        } else if (lowerKey.includes('marque') || lowerKey.includes('brand') || lowerKey.includes('manufacturer')) {
          product.marque = row[key];
        } else if (lowerKey.includes('reference') || lowerKey.includes('référence') || lowerKey.includes('ref')) {
          product.reference = row[key];
        } else if (lowerKey.includes('stock') && lowerKey.includes('total')) {
          product.stock_total = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('aouina') || lowerKey.includes('location') || lowerKey.includes('warehouse1')) {
          product.stock_aouina = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('dibou') || lowerKey.includes('warehouse2')) {
          product.stock_dibou = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('ariana') || lowerKey.includes('warehouse3')) {
          product.stock_ariana = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('prix') || lowerKey.includes('price') || lowerKey.includes('cost')) {
          product.prix = parseFloat(row[key]) || 0;
        }
      });

      return product;
    });

    // Filter out incomplete products
    const validProducts = products.filter(p => p.dimension && p.marque);

    if (validProducts.length === 0) {
      throw new Error('No valid products found in Excel file');
    }

    return validProducts;
  } catch (error) {
    throw new Error(`Error parsing Excel file: ${error.message}`);
  }
}

/**
 * Convert Excel file and save as JSON
 * @param {string} inputPath - Path to Excel file
 * @param {string} outputPath - Path to output JSON file
 * @param {string} sheetName - Sheet name to parse
 */
function convertExcelToJSON(inputPath, outputPath, sheetName = null) {
  try {
    const products = parseExcelFile(inputPath, sheetName);
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
    console.log(`✓ Conversion successful!`);
    console.log(`✓ Products converted: ${products.length}`);
    console.log(`✓ Output saved to: ${outputPath}`);
    return products;
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * List available sheets in Excel file
 * @param {string} filePath - Path to Excel file
 */
function listSheets(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    return workbook.SheetNames;
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return [];
  }
}

// CLI Usage
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         EXCEL TO JSON CONVERTER FOR TIRE PRODUCTS           ║
╚════════════════════════════════════════════════════════════╝

Usage:
  node excel-converter.js <input.xlsx> [output.json] [sheet-name]

Examples:
  node excel-converter.js data.xlsx products.json
  node excel-converter.js data.xlsx products.json "Products"
  node excel-converter.js --list data.xlsx  (List available sheets)

Supported Excel format:
  - .xlsx files with columns:
    DIMENSION, MARQUE, RÉFÉRENCE, STOCK TOTAL, AOUINA, DIBOU, ARIANA, PRIX (DT)

If no output file is specified, 'converted.json' will be used.
  `);
} else if (args[0] === '--list') {
  if (args.length < 2) {
    console.error('Usage: node excel-converter.js --list <file.xlsx>');
    process.exit(1);
  }
  const sheets = listSheets(args[1]);
  if (sheets.length > 0) {
    console.log('Available sheets in', args[1] + ':');
    sheets.forEach((sheet, i) => console.log(`  ${i + 1}. ${sheet}`));
  } else {
    console.error('No sheets found or error reading file');
  }
} else {
  const inputFile = args[0];
  const outputFile = args[1] || 'converted.json';
  const sheetName = args[2] || null;

  if (!fs.existsSync(inputFile)) {
    console.error(`✗ Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`Converting ${inputFile} to ${outputFile}...`);
  convertExcelToJSON(inputFile, outputFile, sheetName);
}

export { parseExcelFile, convertExcelToJSON, listSheets };
