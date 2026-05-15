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

:: Get Node version
for /f "tokens=1 delims=v" %%a in ('node --version') do set NODERAW=%%a
for /f "tokens=1 delims=." %%a in ('node --version') do set NODEMAJOR=%%a
set NODEMAJOR=%NODEMAJOR:v=%

if %NODEMAJOR% LSS 20 (
    echo [ERROR] Node.js version is too old.
    echo Current version:
    node --version
    echo Required: v20 or higher
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo [OK] npm version:
npm --version
echo.

:: Install dependencies
echo [1/2] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed. Try running as Administrator.
    pause
    exit /b 1
)
echo.

:: Start dev server
echo [2/2] Starting development server...
echo.
echo App will open at: http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
