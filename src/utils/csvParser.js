/**
 * CSV to JSON Parser Utility
 * Used by the app to automatically convert CSV data files
 */

import { parseFlexibleNumber } from './numberParser';

export function parseCSVData(csvText) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
  
  if (lines.length < 2) {
    throw new Error('Need at least a header row and one data row');
  }

  // Detect delimiter
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';
  
  // Parse headers
  const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());
  
  // Map headers to standard field names
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

  // Convert data rows
  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    const product = {};

    headers.forEach((header, index) => {
      const mappedName = headerMap[header];
      const value = values[index];

      if (mappedName && value) {
        if (mappedName.includes('stock') || mappedName === 'stock_total') {
          product[mappedName] = parseInt(String(value).replace(/\u00A0/g, ' ').trim(), 10) || 0;
        } else if (mappedName === 'prix') {
          product[mappedName] = parseFlexibleNumber(value);
        } else {
          product[mappedName] = value;
        }
      }
    });

    // Only add valid products
    if (product.dimension && product.marque) {
      products.push(product);
    }
  }

  if (products.length === 0) {
    throw new Error('No valid products found in the data');
  }

  return products;
}

export async function fetchAndParseData(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}`);
    }
    
    const text = await response.text();
    return parseCSVData(text);
  } catch (error) {
    console.error(`Error fetching or parsing ${filePath}:`, error);
    throw error;
  }
}
