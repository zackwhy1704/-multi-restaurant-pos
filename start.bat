@echo off
echo ========================================
echo   Multi-Restaurant POS System
echo ========================================
echo.
echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
