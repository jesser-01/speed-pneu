#!/usr/bin/env node

/**
 * Interactive Excel Converter CLI
 * More user-friendly tool for converting tire data from Excel to JSON
 */

import readline from 'readline';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { parseExcelFile as parseExcel, listSheets } from './excel-converter.js';

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
║    EXCEL TO JSON CONVERTER - Interactive Mode               ║
║    Tire Product Data Conversion Utility                     ║
╚════════════════════════════════════════════════════════════╝
  `);

  const inputPath = await question('📁 Enter path to your Excel file (.xlsx): ');

  if (!fs.existsSync(inputPath)) {
    console.error('✗ File not found!');
    rl.close();
    return;
  }

  // List available sheets
  const sheets = listSheets(inputPath);
  console.log('\n📋 Available sheets:');
  sheets.forEach((sheet, i) => {
    console.log(`   ${i + 1}. ${sheet}`);
  });

  let selectedSheet = sheets[0];
  if (sheets.length > 1) {
    const sheetChoice = await question(`\nEnter sheet number (default: 1): `);
    const sheetIndex = (parseInt(sheetChoice) || 1) - 1;
    if (sheetIndex >= 0 && sheetIndex < sheets.length) {
      selectedSheet = sheets[sheetIndex];
    }
  }

  const outputPath = await question('\n💾 Enter output JSON filename (default: products.json): ') || 'products.json';

  console.log('\n⏳ Processing...\n');
  
  try {
    // Parse Excel file
    const products = parseExcel(inputPath, selectedSheet);

    // Save to JSON
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

    console.log(`✓ Conversion successful!
✓ Sheet: "${selectedSheet}"
✓ Products converted: ${products.length}
✓ Output saved to: ${outputPath}

Sample of first product:
${JSON.stringify(products[0], null, 2)}
    `);

    // Ask if they want to copy to public folder
    const copyToPublic = await question('\nCopy to public/products.json? (y/n): ');
    if (copyToPublic.toLowerCase() === 'y') {
      fs.copyFileSync(outputPath, 'public/products.json');
      console.log('✓ Copied to public/products.json');
    }

  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
  }

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
});
