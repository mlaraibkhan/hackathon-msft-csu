@echo off
REM Educational Vulnerability Scanner - Windows Startup Script
REM Run this script as Administrator

echo ============================================
echo   Educational Vulnerability Scanner
echo   FOR EDUCATIONAL USE ONLY
echo ============================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script must be run as Administrator!
    echo.
    echo Please:
    echo 1. Right-click on start-windows.bat
    echo 2. Select "Run as Administrator"
    echo 3. Click "Yes" on the UAC prompt
    echo.
    pause
    exit /b 1
)

echo [OK] Running with Administrator privileges
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo.
    echo Please install Python 3.11+ from:
    echo https://www.python.org/downloads/
    echo.
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo [OK] Python found: 
python --version
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

REM Check if nmap is installed
nmap --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Nmap is not installed or not in PATH!
    echo.
    echo Scanning will fail without nmap!
    echo.
    echo Please install Nmap from:
    echo https://nmap.org/download.html
    echo.
    echo Then add to PATH: C:\Program Files (x86)\Nmap
    echo.
    echo Continue anyway? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" exit /b 1
) else (
    echo [OK] Nmap found:
    nmap --version | findstr /C:"Nmap version"
    echo.
)

REM Start backend
echo ============================================
echo Starting Backend Server...
echo ============================================
echo.

cd /d "%~dp0backend"
if %errorLevel% neq 0 (
    echo [ERROR] Backend directory not found!
    pause
    exit /b 1
)

echo Starting Flask backend on http://127.0.0.1:5000
echo Backend logs will appear below...
echo.
echo Press Ctrl+C in this window to stop the backend
echo.
echo ============================================
echo.

REM Start backend in the same window so logs are visible
python src/main.py

REM If backend stops, wait before closing
echo.
echo Backend has stopped.
pause
