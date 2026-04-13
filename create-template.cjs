/**
 * Create template Excel file for tire data
 */

const XLSX = require('xlsx');

const data = [
  {
    'DIMENSION': '205/55R16',
    'MARQUE': 'GOODYEAR',
    'RÉFÉRENCE': 'GD205/55R16',
    'STOCK TOTAL': 6,
    'AOUINA': 2,
    'DIBOU': 0,
    'ARIANA': 4,
    'PRIX (DT)': 280
  },
  {
    'DIMENSION': '205/55R16',
    'MARQUE': 'HANKOOK',
    'RÉFÉRENCE': 'HK205/55R16',
    'STOCK TOTAL': 17,
    'AOUINA': 4,
    'DIBOU': 9,
    'ARIANA': 4,
    'PRIX (DT)': 260
  },
  {
    'DIMENSION': '205/55R16',
    'MARQUE': 'FULDA',
    'RÉFÉRENCE': 'FL205/55R16',
    'STOCK TOTAL': 45,
    'AOUINA': 10,
    'DIBOU': 27,
    'ARIANA': 8,
    'PRIX (DT)': 250
  },
  {
    'DIMENSION': '205/55R16',
    'MARQUE': 'AMINE',
    'RÉFÉRENCE': 'AM205/55R16',
    'STOCK TOTAL': 1,
    'AOUINA': 1,
    'DIBOU': 0,
    'ARIANA': 0,
    'PRIX (DT)': 240
  },
  {
    'DIMENSION': '205/55R16',
    'MARQUE': 'DOUBLESTAR',
    'RÉFÉRENCE': 'DS205/55R16',
    'STOCK TOTAL': 4,
    'AOUINA': 4,
    'DIBOU': 0,
    'ARIANA': 0,
    'PRIX (DT)': 230
  },
  {
    'DIMENSION': '205/55R16',
    'MARQUE': 'GOODRIDE',
    'RÉFÉRENCE': 'GR205/55R16',
    'STOCK TOTAL': 1,
    'AOUINA': 0,
    'DIBOU': 0,
    'ARIANA': 1,
    'PRIX (DT)': 250
  },
  {
    'DIMENSION': '205/55R16',
    'MARQUE': 'RADIAL',
    'RÉFÉRENCE': 'RD205/55R16',
    'STOCK TOTAL': 4,
    'AOUINA': 0,
    'DIBOU': 0,
    'ARIANA': 4,
    'PRIX (DT)': 230
  }
];

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

// Set column widths
worksheet['!cols'] = [
  { wch: 12 },
  { wch: 15 },
  { wch: 15 },
  { wch: 13 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 12 }
];

XLSX.writeFile(workbook, 'public/data.xlsx');
console.log('✓ Template Excel file created: public/data.xlsx');
