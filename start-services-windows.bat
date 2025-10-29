@echo off
REM Educational Vulnerability Scanner - Start All Services
REM Run this script as Administrator to start both backend and frontend

echo ============================================
echo   Educational Vulnerability Scanner
echo   Start All Services
echo ============================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script must be run as Administrator!
    echo.
    echo Please:
    echo 1. Right-click on start-services-windows.bat
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

REM Start Backend
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

REM Start backend in a new window
start "Educational Vulnerability Scanner - Backend" cmd /c "python src/main.py"
echo [OK] Backend started in a new window
echo Backend running at http://127.0.0.1:5000
echo.

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start Frontend
echo ============================================
echo Starting Frontend Application...
echo ============================================
echo.

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

REM Start frontend in a new window
start "Educational Vulnerability Scanner - Frontend" cmd /c "npm run dev"
echo [OK] Frontend started in a new window
echo.

echo ============================================
echo All services started successfully!
echo.
echo Backend window title: Educational Vulnerability Scanner - Backend
echo Frontend window title: Educational Vulnerability Scanner - Frontend
echo.
echo To stop all services, run stop-services-windows.bat
echo ============================================
pause