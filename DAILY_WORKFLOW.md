# 📅 Daily Workflow Guide - Automated Data Management

This guide explains how to update your tire inventory data every day with **zero manual work** using the automated conversion system.

## 🚀 Quick Daily Process (2 steps only!)

### Step 1: Update Your Data File
1. Open the `data.csv` file in your preferred spreadsheet application (Excel, Google Sheets, LibreOffice, etc.)
2. Update your tire inventory data with the latest stock numbers
3. Save the file

### Step 2: Push to GitHub
```bash
git add public/data.csv
git commit -m "Daily update: $(date +%Y-%m-%d)"
git push
```

**That's it!** ✨ Everything else happens automatically:
- GitHub detects the change
- Runs automatic conversion
- Updates `products.json`
- Your website instantly reflects the new data!

---

## 🔄 What Happens Automatically

```
You update data.csv
        ↓
Push to GitHub
        ↓
GitHub Actions triggers
        ↓
Automatically converts CSV to JSON
        ↓
Updates products.json
        ↓
Website loads new data
        ↓
Dashboard shows latest inventory ✓
```

---

## 📋 Data File Format

The `public/data.csv` file should always have these columns (in any order):

```
DIMENSION,MARQUE,RÉFÉRENCE,STOCK TOTAL,AOUINA,DIBOU,ARIANA,PRIX (DT)
205/55R16,GOODYEAR,GD205/55R16,6,2,0,4,280
```

### Column Definitions:
- **DIMENSION** - Tire size (e.g., 205/55R16)
- **MARQUE** - Brand name (e.g., GOODYEAR)
- **RÉFÉRENCE** - Product reference code (e.g., GD205/55R16)
- **STOCK TOTAL** - Total quantity in inventory
- **AOUINA** - Quantity at Aouina location
- **DIBOU** - Quantity at Dibou location
- **ARIANA** - Quantity at Ariana location
- **PRIX (DT)** - Price in Dinars

---

## 🎯 Three Ways to Edit Your Data

### Option 1: Use Excel or Spreadsheet Software (Recommended)
1. Open `public/data.csv` with Excel/Calc/Sheets
2. Edit values directly
3. Save the file
4. Push to Git

### Option 2: Use a Text Editor
1. Open `public/data.csv` with Notepad, VS Code, etc.
2. Update CSV values manually
3. Save and push

### Option 3: Use Command Line (Linux/Mac/Windows PowerShell)
```bash
# View the file
cat public/data.csv

# Edit with nano (Linux/Mac only)
nano public/data.csv
```

---

## ✅ Verification Steps

### Check if data was processed:

1. **Check GitHub Actions status:**
   - Go to your repo → "Actions" tab
   - Look for the latest run of "Auto-Convert Data on Push"
   - It should show ✓ (green checkmark)

2. **Check if products.json was updated:**
   - Go to `public/products.json` in GitHub
   - The file should have been auto-committed after your data.csv push

3. **View live on your website:**
   - Refresh your website URL
   - Click the "🔄 Actualiser" button in the header
   - New data should appear instantly

---

## 📝 Git Command Shortcuts

Create these Windows batch files (.bat) in your project folder for quick pushes:

**daily-update.bat:**
```batch
@echo off
cd "%~dp0"
git add public/data.csv
git commit -m "Daily update: %date%"
git push
echo.
echo ✓ Data updated and pushed!
pause
```

**Then just double-click it daily!**

---

## 🐛 Troubleshooting

### Issue: GitHub Actions failed
**Solution:** 
1. Check Actions tab for error messages
2. Ensure `public/data.csv` has valid CSV format
3. Verify all required columns are present

### Issue: Website not showing new data
**Solution:**
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Click the "🔄 Actualiser" button on the website
3. Clear browser cache

### Issue: CSV not recognized
**Solution:**
1. Ensure file is saved as `.csv` (not `.xlsx`)
2. Check column headers match exactly:
   ```
   DIMENSION,MARQUE,RÉFÉRENCE,STOCK TOTAL,AOUINA,DIBOU,ARIANA,PRIX (DT)
   ```
3. No extra spaces or different delimiters

---

## 🔐 Security Note

- GitHub Actions token is automatically provided
- Your data.csv is always in your repository (version controlled)
- All changes are tracked in Git history

---

## 📊 Example Daily Update

**Before (old state):**
```csv
205/55R16,GOODYEAR,GD205/55R16,6,2,0,4,280
```

**After (your update):**
```csv
205/55R16,GOODYEAR,GD205/55R16,15,5,8,2,280
↑                                  ↑ Updated stock
```

**Result:**
- ✓ GitHub Actions converts it
- ✓ Website reloads with `stock_total: 15`
- ✓ Dashboard shows new inventory immediately

---

## 🚨 Important Rules

1. **Always keep the headers the same** - Don't rename columns
2. **Use comma as delimiter** - Not semicolon or tabs
3. **Keep the .csv extension** - Not .txt or .excel
4. **Don't delete rows** - Just update values as needed
5. **Git push daily** - So GitHub Actions can process it

---

## 💡 Pro Tips

1. **Mass update with Excel:**
   - Use Find & Replace in Excel for bulk changes

2. **Batch updates at multiple times:**
   - You can push multiple times per day

3. **Revert if mistake:**
   ```bash
   git revert HEAD  # Undo last commit
   git push
   ```

4. **Check what will be pushed:**
   ```bash
   git diff public/data.csv  # See changes before committing
   ```

---

## 🎓 Learning More

- See [DATA_CONVERTER_README.md](./DATA_CONVERTER_README.md) for manual conversion methods
- GitHub Actions documentation: https://docs.github.com/en/actions
- CSV format guide: https://en.wikipedia.org/wiki/Comma-separated_values

---

**Next Update:** Follow the quick 2-step process above! 🚀
