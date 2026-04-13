#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Daily tire inventory update script
    
.DESCRIPTION
    Converts Excel data to JSON and syncs with GitHub
    
.EXAMPLE
    .\daily-update.ps1
#>

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   DAILY TIRE INVENTORY UPDATE" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Step 0: Configure Git
    Write-Host "[0/3] Setting up Git..." -ForegroundColor Yellow
    & git config --global user.name "Tire Inventory System" 2>$null
    & git config --global user.email "inventory@local" 2>$null
    
    # Step 1: Convert Excel to JSON
    Write-Host "[1/3] Converting Excel to JSON..." -ForegroundColor Yellow
    & node excel-converter.js public/data.xlsx public/products.json
    Write-Host "✓ Conversion successful" -ForegroundColor Green
    
    # Step 2: Commit changes
    Write-Host ""
    Write-Host "[2/3] Committing changes..." -ForegroundColor Yellow
    $date = Get-Date -Format "yyyy-MM-dd"
    & git add public/data.xlsx public/products.json
    & git commit -m "Daily update: $date"
    Write-Host "✓ Commit successful" -ForegroundColor Green
    
    # Step 3: Push to GitHub
    Write-Host ""
    Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
    & git push
    Write-Host "✓ Push successful" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host "   ✓ SUCCESS! Data updated and synced" -ForegroundColor Green
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your website will update within seconds." -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host "====================================================" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
