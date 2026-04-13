@echo off
setlocal enabledelayedexpansion

REM Daily tire inventory update script
REM Just double-click this file every day to update and sync

cd /d "%~dp0"

echo.
echo ====================================================
echo   DAILY TIRE INVENTORY UPDATE
echo ====================================================
echo.

REM Check if node is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if git is installed
where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Configure git user if not already configured
echo [0/3] Checking Git configuration...
for /f "delims=" %%A in ('git config --global user.name 2^>nul') do set GITNAME=%%A
if "!GITNAME!"=="" (
    echo.
    echo WARNING: Git user not configured!
    echo Please enter your name (or press Enter for default):
    set /p GITNAME="Your name: "
    if "!GITNAME!"=="" set GITNAME=Tire Inventory User
    git config --global user.name "!GITNAME!"
    echo Git name set to: !GITNAME!
)

for /f "delims=" %%A in ('git config --global user.email 2^>nul') do set GITEMAIL=%%A
if "!GITEMAIL!"=="" (
    echo.
    echo Please enter your email (or press Enter for default):
    set /p GITEMAIL="Your email: "
    if "!GITEMAIL!"=="" set GITEMAIL=inventory@local
    git config --global user.email "!GITEMAIL!"
    echo Git email set to: !GITEMAIL!
)

REM Convert Excel to JSON
echo [1/3] Converting Excel to JSON...
call node excel-converter.js public/data.xlsx public/products.json
if errorlevel 1 (
    echo.
    echo ERROR: Conversion failed!
    pause
    exit /b 1
)

REM Commit changes
echo.
echo [2/3] Committing changes...
call git add public/data.xlsx public/products.json
call git commit -m "Daily update: %date%"

REM Check for git errors (but allow if nothing to commit)
if errorlevel 2 (
    echo ERROR: Commit failed!
    pause
    exit /b 1
)

REM Push to GitHub
echo.
echo [3/3] Pushing to GitHub...
call git push
if errorlevel 1 (
    echo ERROR: Push failed! Check your internet connection.
    pause
    exit /b 1
)

echo.
echo ====================================================
echo   SUCCESS! Data updated and synced to GitHub
echo ====================================================
echo.
echo Your website will update within seconds.
echo.
pause
