#!/usr/bin/env pwsh
# Quick Deployment Script for Mutual Aid Network

Write-Host "`n🚀 MUTUAL AID NETWORK - DEPLOYMENT SCRIPT`n" -ForegroundColor Cyan

# Step 1: Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project directory verified" -ForegroundColor Green

# Step 2: Check for errors
Write-Host "`n📋 Checking for TypeScript errors..." -ForegroundColor Yellow
$errors = npm run build 2>&1 | Select-String "error"
if ($LASTEXITCODE -ne 0 -and $errors) {
    Write-Host "❌ Build errors found. Please fix them first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ No build errors" -ForegroundColor Green

# Step 3: Build the project
Write-Host "`n🔨 Building frontend for production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build successful" -ForegroundColor Green

# Step 4: Check if dist folder exists
if (!(Test-Path "dist")) {
    Write-Host "❌ Error: dist folder not created" -ForegroundColor Red
    exit 1
}

$distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "✅ Build output: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green

# Step 5: Check Git status
Write-Host "`n📦 Checking Git status..." -ForegroundColor Yellow
git status --short
$hasChanges = git status --short
if ($hasChanges) {
    Write-Host "`n⚠️  You have uncommitted changes." -ForegroundColor Yellow
    $commit = Read-Host "Do you want to commit and push? (y/n)"
    
    if ($commit -eq "y") {
        Write-Host "`nCommitting changes..." -ForegroundColor Yellow
        git add .
        $message = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($message)) {
            $message = "Production deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
        git commit -m $message
        
        Write-Host "`nPushing to remote..." -ForegroundColor Yellow
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Changes pushed successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Push failed" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

# Step 6: Display deployment info
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "🎉 BUILD COMPLETE - READY FOR DEPLOYMENT!" -ForegroundColor Green
Write-Host "="*60 + "`n" -ForegroundColor Cyan

Write-Host "📍 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Deploy Backend to Render:" -ForegroundColor White
Write-Host "   → Go to https://render.com" -ForegroundColor Gray
Write-Host "   → New Web Service → Connect your repo" -ForegroundColor Gray
Write-Host "   → Set Root Directory: backend" -ForegroundColor Gray
Write-Host "   → Start Command: npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Deploy Frontend to Vercel:" -ForegroundColor White
Write-Host "   → Go to https://vercel.com" -ForegroundColor Gray
Write-Host "   → Import your repo" -ForegroundColor Gray
Write-Host "   → Framework: Vite" -ForegroundColor Gray
Write-Host "   → Build Command: npm run build" -ForegroundColor Gray
Write-Host "   → Output Directory: dist" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Set Environment Variables:" -ForegroundColor White
Write-Host "   Backend (Render):" -ForegroundColor Gray
Write-Host "     DATABASE_URL=<your-postgres-url>" -ForegroundColor Gray
Write-Host "     JWT_SECRET=<random-secret-key>" -ForegroundColor Gray
Write-Host "     CLIENT_URL=<your-vercel-url>" -ForegroundColor Gray
Write-Host "   Frontend (Vercel):" -ForegroundColor Gray
Write-Host "     VITE_API_URL=<your-render-backend-url>" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""

# Step 7: Open deployment guide
$openGuide = Read-Host "Open deployment guide? (y/n)"
if ($openGuide -eq "y") {
    if (Test-Path "DEPLOYMENT_GUIDE.md") {
        Start-Process "DEPLOYMENT_GUIDE.md"
    }
}

Write-Host "`n===== DEPLOYMENT PREPARATION COMPLETE =====`n" -ForegroundColor Green
