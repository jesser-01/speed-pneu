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
    # Step 0: Check and configure Git
    Write-Host "[0/3] Checking Git configuration..." -ForegroundColor Yellow
    
    $gitName = & git config --global user.name 2>$null
    if ([string]::IsNullOrEmpty($gitName)) {
        Write-Host "Git user name not configured." -ForegroundColor Yellow
        $gitName = Read-Host "Enter your name (or press Enter for default)"
        if ([string]::IsNullOrEmpty($gitName)) {
            $gitName = "Tire Inventory User"
        }
        & git config --global user.name $gitName
        Write-Host "✓ Git name set to: $gitName" -ForegroundColor Green
    }
    
    $gitEmail = & git config --global user.email 2>$null
    if ([string]::IsNullOrEmpty($gitEmail)) {
        Write-Host "Git email not configured." -ForegroundColor Yellow
        $gitEmail = Read-Host "Enter your email (or press Enter for default)"
        if ([string]::IsNullOrEmpty($gitEmail)) {
            $gitEmail = "inventory@local"
        }
        & git config --global user.email $gitEmail
        Write-Host "✓ Git email set to: $gitEmail" -ForegroundColor Green
    }
    
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
