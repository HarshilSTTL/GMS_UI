@echo off
echo ========================================
echo   GMS - Gujarat Grievance Management
echo   Setup Script
echo ========================================
echo.

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is NOT installed.
    echo Please download and install Node.js v20 or higher from:
    echo https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo [OK] npm version:
npm --version
echo.

:: Clean old cache
echo [1/3] Cleaning old cache...
if exist .next rmdir /s /q .next
echo Done.
echo.

:: Install dependencies
echo [2/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed. Try running as Administrator.
    pause
    exit /b 1
)
echo.

:: Start dev server
echo [3/3] Starting development server...
echo.
echo ========================================
echo   App running at: http://localhost:3000
echo   Press Ctrl+C to stop
echo ========================================
echo.
echo Demo Login Credentials:
echo   Officer  : ravi.varma@gujarat.gov.in  / officer123
echo   Admin    : bhupesh.patel@gujarat.gov.in / admin123
echo   CM       : cm.office@gujarat.gov.in    / cm123
echo   Citizen  : Phone 9876543210, OTP shown on screen
echo.
call npm run dev
