@echo off
REM Daily tire inventory update script
REM Just double-click this file every day to update and sync

cd /d "%~dp0"

echo.
echo ====================================================
echo   DAILY TIRE INVENTORY UPDATE
echo ====================================================
echo.

REM Convert Excel to JSON
echo [1/3] Converting Excel to JSON...
node excel-converter.js public/data.xlsx public/products.json

if errorlevel 1 (
    echo.
    echo ERROR: Conversion failed!
    pause
    exit /b 1
)

REM Commit changes
echo.
echo [2/3] Committing changes...
git add public/data.xlsx public/products.json
git commit -m "Daily update: %date%"

if errorlevel 1 (
    echo ERROR: Commit failed!
    pause
    exit /b 1
)

REM Push to GitHub
echo.
echo [3/3] Pushing to GitHub...
git push

if errorlevel 1 (
    echo ERROR: Push failed!
    pause
    exit /b 1
)

echo.
echo ====================================================
echo   ✓ SUCCESS! Data updated and synced to GitHub
echo ====================================================
echo.
echo Your website will update within seconds.
echo.
pause
