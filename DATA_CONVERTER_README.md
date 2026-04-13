# 📊 Data Converter - User Guide

This tool helps you convert your tire inventory data (CSV, Excel, etc.) into the JSON format used by the Stock Pneus Dashboard.

## 🎯 Quick Start

### Option 1: Interactive CLI (Recommended for beginners)
```bash
node converter-interactive.js
```
Follow the prompts to select your CSV file and get instant conversion.

### Option 2: Command Line Converter
```bash
node converter.js input.csv output.json
```

### Option 3: Web-Based Converter (In the app)
Access the **Import Data** section in your dashboard for a visual converter.

## 📋 Expected Data Format

Your data should include these columns (in any order):
- **DIMENSION** - Tire size (e.g., 205/55R16)
- **MARQUE** - Brand/Manufacturer (e.g., GOODYEAR)
- **RÉFÉRENCE** - Product reference code (e.g., GD205/55R16)
- **STOCK TOTAL** - Total inventory count
- **AOUINA** - Stock at Aouina location
- **DIBOU** - Stock at Dibou location
- **ARIANA** - Stock at Ariana location
- **PRIX (DT)** - Price in Dinars

## ✅ Supported Input Formats

### CSV (Comma-separated)
```
DIMENSION,MARQUE,RÉFÉRENCE,STOCK TOTAL,AOUINA,DIBOU,ARIANA,PRIX (DT)
205/55R16,GOODYEAR,GD205/55R16,6,2,0,4,280
205/55R16,HANKOOK,HK205/55R16,17,4,9,4,260
```

### CSV (Semicolon-separated)
```
DIMENSION;MARQUE;RÉFÉRENCE;STOCK TOTAL;AOUINA;DIBOU;ARIANA;PRIX (DT)
205/55R16;GOODYEAR;GD205/55R16;6;2;0;4;280
```

### TSV (Tab-separated)
```
DIMENSION	MARQUE	RÉFÉRENCE	STOCK TOTAL	AOUINA	DIBOU	ARIANA	PRIX (DT)
205/55R16	GOODYEAR	GD205/55R16	6	2	0	4	280
```

## 📥 How to Use Each Method

### Method 1: Interactive CLI

1. Run the script:
   ```bash
   node converter-interactive.js
   ```

2. Enter the path to your CSV file when prompted:
   ```
   Enter path to your CSV file: data.csv
   ```

3. Enter desired output filename (or press Enter for default):
   ```
   Enter output JSON filename (default: converted.json): products.json
   ```

4. The tool will process and save your data as JSON

### Method 2: Command Line

1. Place your CSV file in the project directory

2. Run the converter:
   ```bash
   node converter.js mydata.csv products.json
   ```

3. Your data is now converted and ready to use!

### Method 3: Web-Based Converter

1. Add this component to your App.jsx (see Integration section)

2. Access the import page in your dashboard

3. Either:
   - Paste your CSV data directly into the textarea
   - Upload a CSV file

4. Click "Convert to JSON"

5. Preview the converted data

6. Either:
   - Download as JSON file
   - Import directly to dashboard

## 🔧 Integration into App

To use the web-based converter in your React app:

```jsx
import DataConverter from './components/DataConverter';

// In your App component:
function App() {
  const [products, setProducts] = useState([]);

  const handleDataImport = (importedData) => {
    setProducts(importedData);
    // Optionally save to your database or API
  };

  return (
    <div>
      <DataConverter onDataImport={handleDataImport} />
      {/* Your other components */}
    </div>
  );
}
```

## 📂 Output Format

All converters will produce JSON like this:

```json
[
  {
    "dimension": "205/55R16",
    "marque": "GOODYEAR",
    "reference": "GD205/55R16",
    "stock_total": 6,
    "stock_aouina": 2,
    "stock_dibou": 0,
    "stock_ariana": 4,
    "prix": 280
  },
  {
    "dimension": "205/55R16",
    "marque": "HANKOOK",
    "reference": "HK205/55R16",
    "stock_total": 17,
    "stock_aouina": 4,
    "stock_dibou": 9,
    "stock_ariana": 4,
    "prix": 260
  }
]
```

## 🚀 Advanced Usage

### Using in Node.js Code

```javascript
const { convertCSVToJSON } = require('./converter.js');

convertCSVToJSON('mydata.csv', 'output.json');
```

### Handling Special Cases

- **Different column names**: The converter auto-detects common variations
- **Missing columns**: Empty values default to 0 for numbers
- **Extra columns**: They are automatically ignored
- **Empty rows**: Skipped automatically

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "File not found" | Check that the file path is correct and file exists |
| No products converted | Ensure first row has proper headers and data rows follow |
| Wrong stock values | Check that stock columns have numeric values (not text) |
| Prices showing as 0 | Ensure price column contains valid numbers |

## 💡 Tips

1. **Keep backups**: Always keep your original CSV file
2. **Test first**: Use the web converter to preview data before full import
3. **Validate**: Check the preview to ensure columns match correctly
4. **Batch imports**: Process large files in smaller chunks if needed
5. **Column order**: Doesn't matter - converter auto-detects columns by name

## 📞 Support

If you encounter issues:

1. Ensure your CSV follows one of the supported formats
2. Check for special characters in dimension or reference fields
3. Verify all required columns are present
4. Try using the interactive CLI for step-by-step guidance

---

**Version**: 1.0.0  
**Last Updated**: April 2026
