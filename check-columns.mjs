import XLSX from 'xlsx';

const workbook = XLSX.readFile('public/data.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Get headers
const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

console.log('Columns in your Excel file:');
headers.forEach((h, i) => {
  console.log(`  [${i}]: "${h}"`);
});

console.log('\n\nFirst product data:');
const data = XLSX.utils.sheet_to_json(sheet);
if (data.length > 0) {
  console.log(JSON.stringify(data[0], null, 2));
}
