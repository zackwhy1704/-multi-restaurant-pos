@echo off
echo ========================================
echo   Push to GitHub Repository
echo ========================================
echo.
echo Repository: https://github.com/zackwhy1704/-multi-restaurant-pos
echo.
echo FIRST TIME SETUP:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Name: "POS Deployment"
echo 4. Check "repo" (all checkboxes under repo)
echo 5. Click "Generate token" at bottom
echo 6. COPY the token (you won't see it again!)
echo.
pause
echo.
echo Now pushing to GitHub...
echo.

cd C:\Users\zheng\multi-restaurant-pos
git remote remove origin 2>nul
git remote add origin https://github.com/zackwhy1704/-multi-restaurant-pos.git
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo If successful, your code is now on GitHub!
echo Next: Deploy to Vercel and Railway
echo.
pause
