@echo off
echo ==========================================
echo EduCore PH - GitHub Push Script
echo ==========================================
echo.
echo 1. Initializing Git...
git init
echo.
echo 2. Adding files...
git add .
echo.
echo 3. Committing changes...
git commit -m "feat: initial commit with Prisma, Railway, and Vercel setup"
echo.
echo 4. Setting branch to main...
git branch -M main
echo.
echo 5. Connecting to GitHub...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Lyshandave/EduCore-PH.git
echo.
echo 6. Pushing to GitHub...
echo (If a popup appears, please login to your GitHub account)
git push -u origin main
echo.
echo ==========================================
echo Task Finished!
echo ==========================================
pause
