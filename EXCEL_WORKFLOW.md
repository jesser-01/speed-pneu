# 📊 Excel Daily Workflow - Automated Data Management

This guide explains how to update your tire inventory data every day using **Excel files** with **automatic conversion** to JSON.

## 🚀 Quick Daily Process (3 steps!)

### Step 1: Edit Your Excel File
1. Open `public/data.xlsx` in Excel, Google Sheets, or LibreOffice Calc
2. Update the tire inventory with latest stock numbers
3. Save the file (Ctrl+S)

### Step 2: Commit Your Changes
```bash
git add public/data.xlsx
git commit -m "Daily update: $(date +%Y-%m-%d)"
```

### Step 3: Push to GitHub
```bash
git push
```

**That's it!** ✨ Everything else happens automatically:
- GitHub detects the Excel file change
- Runs automatic conversion (Excel → JSON)
- Updates `products.json` automatically
- Your website instantly reflects the new data!

---

## 🔄 What Happens Automatically

```
You edit data.xlsx in Excel
        ↓
Save the file
        ↓
Commit & push to GitHub
        ↓
GitHub Actions triggers
        ↓
Automatically converts Excel → JSON
        ↓
Updates products.json
        ↓
Website loads new data
        ↓
Dashboard shows latest inventory ✓
```

---

## 📋 Excel File Format

The `public/data.xlsx` file should have these columns:

| Column | Format | Example |
|--------|--------|---------|
| **DIMENSION** | Text | 205/55R16 |
| **MARQUE** | Text | GOODYEAR |
| **RÉFÉRENCE** | Text | GD205/55R16 |
| **STOCK TOTAL** | Number | 15 |
| **AOUINA** | Number | 5 |
| **DIBOU** | Number | 8 |
| **ARIANA** | Number | 2 |
| **PRIX (DT)** | Decimal | 280.00 |

### Column Order
- **Column order doesn't matter** - the converter auto-detects by name
- **Extra columns are ignored** - only the above are processed
- **Empty rows are skipped** - no errors

### Example Excel Row:
```
DIMENSION    | MARQUE   | RÉFÉRENCE    | STOCK TOTAL | AOUINA | DIBOU | ARIANA | PRIX (DT)
205/55R16    | GOODYEAR | GD205/55R16  | 15          | 5      | 8     | 2      | 280.00
```

---

## 🎯 How to Edit Your Excel File

### Option 1: Microsoft Excel (Recommended)
1. Open `public/data.xlsx` with Excel
2. Click on cells and edit directly
3. Press Enter after each change
4. Save: Ctrl+S
5. Commit and push

### Option 2: Google Sheets (Free Online)
1. Upload `data.xlsx` to Google Drive
2. Open in Google Sheets
3. Edit directly
4. Download as Excel (.xlsx)
5. Replace `public/data.xlsx` with downloaded file
6. Commit and push

### Option 3: LibreOffice Calc (Free Desktop)
1. Open `data.xlsx` with LibreOffice
2. Edit values directly
3. Save: File → Save (keep .xlsx format)
4. Commit and push

### Option 4: Add New Products
You can add new rows directly in Excel:
```
Row 1:  DIMENSION  | MARQUE  | RÉFÉRENCE | STOCK TOTAL | AOUINA | DIBOU | ARIANA | PRIX (DT)
Row 2:  205/55R16  | GOODYEAR| GD...     | 15          | 5      | 8     | 2      | 280
Row 3:  215/60R16  | MICHELIN| MI...     | 8           | 3      | 2     | 3      | 320
Row 4:  ...        | ...     | ...       | ...         | ...    | ...   | ...    | ...
```

---

## ✅ Verification Steps

### 1. Check GitHub Actions
- Go to your repo → "Actions" tab
- Look for "Auto-Convert Excel Data on Push"
- Should show ✓ (green checkmark)

### 2. Check Converted File
- Go to `public/products.json` in your GitHub repo
- Should be auto-updated after your push

### 3. Check Live Website
- Visit your website
- Click "🔄 Actualiser" button in header
- Should show "Source: 📊 Excel Auto"
- New data should appear immediately

---

## 📝 Git Command Shortcuts

### Windows Batch File
Create a file named `daily-update.bat` in your project folder:

```batch
@echo off
echo Updating tire inventory from Excel...
git add public/data.xlsx
git commit -m "Daily update: %date%"
git push
echo.
echo ✓ Data updated and pushed to GitHub!
echo ✓ Automatic conversion starting...
pause
```

Then just **double-click the file** every day!

### Windows PowerShell
Or create `daily-update.ps1`:

```powershell
git add public/data.xlsx
git commit -m "Daily update: $(Get-Date -Format 'yyyy-MM-dd')"
git push
Write-Host "✓ Data updated and pushed!"
```

Run with: `powershell.exe -ExecutionPolicy Bypass -File daily-update.ps1`

---

## 🐛 Troubleshooting

### Issue: GitHub Actions Failed
**Solution:**
1. Check Actions tab for error message
2. Verify Excel file format is .xlsx (not .xls or .csv)
3. Ensure all required columns exist
4. Check for special characters in data

### Issue: Website Not Showing New Data
**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Click "🔄 Actualiser" button on website
3. Clear browser cache
4. Check if `products.json` was updated on GitHub

### Issue: Excel File Not Recognized
**Solution:**
1. Save as `.xlsx` format (not .xls, .csv, or .ods)
2. Verify columns exactly match:
   ```
   DIMENSION, MARQUE, RÉFÉRENCE, STOCK TOTAL, 
   AOUINA, DIBOU, ARIANA, PRIX (DT)
   ```
3. Ensure no typos in column names
4. Check file is not corrupted (try saving as new file)

### Issue: Data Looks Wrong
**Solution:**
1. Verify numbers are in numeric columns (not text)
2. Check PRIX (DT) has decimal format
3. Ensure STOCK columns have integers
4. Remove any formatting (colors, bold) if causing issues

---

## 🔐 Manual Local Conversion (Alternative)

If you want to convert locally before pushing:

### Interactive Conversion
```bash
npm run convert:excel
```
Prompts you to select sheet and output location

### Command Line Conversion
```bash
node excel-converter.js public/data.xlsx public/products.json
```

### List Available Sheets
```bash
npm run list:sheets public/data.xlsx
```

---

## 📊 Real-World Example

**Morning Scenario:**
1. You receive new stock report from warehouse
2. Open Excel file: `public/data.xlsx`
3. Update quantities for 205/55R16 GOODYEAR:
   - Old: Stock Total = 6, Aouina = 2
   - New: Stock Total = 15, Aouina = 5
4. Update Dibou from 0 to 8 (new shipment arrived)
5. Save Excel (Ctrl+S)
6. In terminal: `git add public/data.xlsx && git commit -m "Daily update" && git push`
7. GitHub Actions automatically converts
8. Customers see new inventory on website instantly!

---

## 💡 Pro Tips

### 1. Use Excel Formulas
Calculate totals in Excel before pushing:
```excel
= SUM(AOUINA + DIBOU + ARIANA)
```

### 2. Multiple Updates Per Day
You can push multiple times per day:
```bash
# Morning update
git add public/data.xlsx
git commit -m "Morning stock update"
git push

# Afternoon update
git add public/data.xlsx
git commit -m "Afternoon stock update"
git push
```

### 3. Backup Your Data
Keep local backups:
```bash
copy public/data.xlsx public/data-backup.xlsx
```

### 4. Freeze Header Row (Excel)
To keep headers visible while scrolling:
- Select row 2
- View → Freeze Panes
- Prevents accidental header edits

### 5. Data Validation (Excel)
Add drop-down lists for brands:
- Select MARQUE column
- Data → Validation
- List: `GOODYEAR, MICHELIN, BRIDGESTONE, etc.`

### 6. Conditional Formatting (Excel)
Highlight low stock items:
- Select STOCK TOTAL column
- Conditional Format → Color Scale
- See at-a-glance which items are low

---

## 🚨 Important Rules

1. **Keep file as .xlsx** - Don't change format
2. **Don't rename columns** - Keep exact names
3. **Keep one sheet active** - Converter uses first sheet
4. **Git commits required** - Push to trigger conversion
5. **Use numeric data types** - Not text
6. **Save before committing** - File must be saved locally

---

## 🎓 Understanding the Process

```
┌─────────────────────────────────────────────────────┐
│         Your Excel File (data.xlsx)                 │
│  ┌───────────────────────────────────────────────┐  │
│  │ DIMENSION │ MARQUE  │ RÉFÉRENCE │ STOCK TOTAL│  │
│  │ 205/55R16 │ GOODYEAR│ GD205/55  │ 15        │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓ (git push)
        ┌───────────────────────────────┐
        │  GitHub Receives data.xlsx    │
        │  Triggers Auto-Convert Action │
        └───────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│   Converts to JSON (products.json)                  │
│  {                                                   │
│    "dimension": "205/55R16",                        │
│    "marque": "GOODYEAR",                            │
│    "stock_total": 15                                │
│  }                                                   │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────────────────────┐
        │  Website Loads products.json  │
        │  Dashboard Shows New Data     │
        └───────────────────────────────┘
```

---

## 📞 Support & Learning

- **GitHub Actions Docs:** https://docs.github.com/actions
- **Excel Format:** Microsoft Office (.xlsx) reference
- **JSON Format:** JavaScript Object Notation standard

---

**Your First Update:** Follow the quick 3-step process above! 🚀

**Need Help?** Check the error messages in GitHub Actions tab → Details
