# 🚀 Daily Update - Three Options

You have **three easy ways** to update your data every day. Choose the one that works best for you:

---

## Option 1: **One-Click Batch Script** (EASIEST - Recommended)

### For Windows Users:
1. **Double-click** `daily-update.bat` in your project folder
2. It will automatically:
   - Convert Excel → JSON
   - Commit your changes
   - Push to GitHub
   - ✓ Done!

**That's it!** Just double-click the script every day after editing Excel.

---

## Option 2: **PowerShell Script**

### For PowerShell Users:
```powershell
# First time only, allow scripts to run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run daily:
.\daily-update.ps1
```

Or just double-click `daily-update.ps1` if execution policy is already set.

---

## Option 3: **Manual Terminal Commands**

### If you prefer manual control:
```bash
# Convert Excel to JSON
node excel-converter.js public/data.xlsx public/products.json

# Commit and push
git add public/data.xlsx public/products.json
git commit -m "Daily update: $(date +%Y-%m-%d)"
git push
```

---

## ⚙️ Automatic GitHub Actions (In Progress)

GitHub Actions **should** auto-convert when you push. We've improved the workflow, so hopefully this will work now. If it does, you just need to:

1. Edit Excel
2. `git push`
3. ✓ Automatic conversion happens!

---

## 📋 Your Daily Workflow (Recommended)

```
Morning:
1. Open Excel: public/data.xlsx
2. Update tire inventory
3. Save Excel (Ctrl+S)
4. Double-click: daily-update.bat
5. ✓ Website updates automatically!
```

---

## 🎯 Quick Decision Guide

| Scenario | Do This |
|----------|---------|
| **Want it totally automated?** | Push to Git → GitHub Actions converts (once fixed) |
| **Want 1-click easy?** | Double-click `daily-update.bat` daily |
| **Prefer PowerShell?** | Run `daily-update.ps1` daily |
| **Like manual control?** | Run the 3 commands manually |

---

## ✅ Setup (First Time Only)

Make sure your Git is configured:
```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

## 🔧 Troubleshooting

### "daily-update.bat" won't run
- Try running PowerShell instead: `daily-update.ps1`
- Or run commands manually

### "Git not found"
- Install Git from: https://git-scm.com/download/win

### "Node not found"
- Install Node.js from: https://nodejs.org/

---

**Recommended:** Use `daily-update.bat` for simplicity! Just double-click every day. 🚀
