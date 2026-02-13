@echo off
echo ========================================
echo   Multi-Restaurant POS - Deployment
echo ========================================
echo.

echo Step 1: Logging in to Vercel...
echo Please complete the login in your browser...
vercel login

echo.
echo Step 2: Deploying Frontend to Vercel...
cd frontend
vercel --prod
cd ..

echo.
echo ========================================
echo   Frontend Deployed!
echo ========================================
echo.
echo Next steps:
echo 1. Copy your Vercel URL from above
echo 2. Deploy backend to Railway: https://railway.app/new
echo 3. Set environment variables (see deploy.md)
echo 4. Test on your phone!
echo.
pause
