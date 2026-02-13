@echo off
echo ========================================
echo   Deploy Backend Without GitHub
echo ========================================
echo.
echo This will create a ZIP file of your backend.
echo You can upload it directly to Railway!
echo.
pause

cd backend
echo Creating backend.zip...
tar -a -c -f ../backend.zip *
cd ..

echo.
echo ========================================
echo   Backend ZIP created!
echo ========================================
echo.
echo File location: %CD%\backend.zip
echo.
echo Next steps:
echo 1. Go to: https://railway.app
echo 2. Create new project
echo 3. Upload backend.zip
echo 4. Add environment variables
echo.
pause
