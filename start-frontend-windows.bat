@echo off
REM Educational Vulnerability Scanner - Frontend Startup
REM Run this in a SEPARATE window AFTER starting the backend

echo ============================================
echo   Educational Vulnerability Scanner
echo   Frontend / Electron Application
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js 18+ from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

REM Navigate to frontend directory
cd /d "%~dp0frontend"
if %errorLevel% neq 0 (
    echo [ERROR] Frontend directory not found!
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [WARNING] Dependencies not installed!
    echo Running npm install... (this may take 2-3 minutes)
    echo.
    call npm install
    if %errorLevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully
    echo.
)

echo ============================================
echo Starting Frontend Application...
echo ============================================
echo.
echo The Electron window should open automatically
echo.
echo If the backend is not running, the app will show errors.
echo Make sure you started the backend first!
echo.
echo Backend should be at: http://127.0.0.1:5000
echo.
echo ============================================
echo.

REM Start the frontend
npm run dev

REM If frontend stops, wait before closing
echo.
echo Frontend has stopped.
pause
