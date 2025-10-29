@echo off
REM Educational Vulnerability Scanner - Stop All Services
REM Run this script to stop both backend and frontend services

echo ============================================
echo   Educational Vulnerability Scanner
echo   Stop All Services
echo ============================================
echo.

echo Stopping all services...
echo.

REM Stop Backend
echo Stopping Flask backend server...
taskkill /FI "WINDOWTITLE eq Educational Vulnerability Scanner - Backend" /F >nul 2>&1
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq python.exe" /v ^| findstr /i "src\main.py"') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Check if backend was stopped
timeout /t 2 /nobreak >nul
tasklist /fi "imagename eq python.exe" /v | findstr /i "src\main.py" >nul 2>&1
if %errorLevel% equ 0 (
    echo [WARNING] Could not stop all backend processes
    echo You may need to manually close the Python windows
) else (
    echo [OK] Backend server stopped successfully
)
echo.

REM Stop Frontend
echo Stopping frontend application...

REM Kill Vite dev server
taskkill /FI "WINDOWTITLE eq Educational Vulnerability Scanner - Frontend" /F >nul 2>&1
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /v ^| findstr /i "vite"') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Kill Electron process
taskkill /IM electron.exe /F >nul 2>&1

REM Check if frontend processes were stopped
timeout /t 2 /nobreak >nul
tasklist /fi "imagename eq electron.exe" >nul 2>&1
set electron_running=%errorLevel%
tasklist /fi "imagename eq node.exe" /v | findstr /i "vite" >nul 2>&1
set node_running=%errorLevel%

if %electron_running% equ 0 (
    echo [WARNING] Could not stop Electron process
) else (
    echo [OK] Electron app stopped successfully
)

if %node_running% equ 0 (
    echo [WARNING] Could not stop all Node.js processes
    echo You may need to manually close the Node.js windows
) else (
    echo [OK] Frontend dev server stopped successfully
)

echo.
echo ============================================
echo Service shutdown complete
echo.
echo If any processes are still running, you can use
echo Task Manager to close them manually.
echo ============================================
pause