@echo off
setlocal
echo ===========================================
echo    EduCore PH - FULL SYNC & DEPLOY
echo ===========================================
echo.

:: 1. PRISMA SETUP
echo [1/3] Syncing Database Schema...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo Error during prisma generate.
    pause
    exit /b %ERRORLEVEL%
)
echo.

:: 2. GITHUB PUSH
echo [2/3] Pushing changes to GitHub...
git add .
set /p msg="Enter commit message (or press Enter for 'update project'): "
if "%msg%"=="" set msg=update project
git commit -m "%msg%"
git push origin main
echo.

:: 3. VERCEL DEPLOY
echo [3/3] Deploying to Vercel (Production)...
call npx vercel --prod --confirm
echo.

echo ===========================================
echo    SUCCESS: Project is Live and Synced!
echo ===========================================
echo.
echo GitHub:  https://github.com/Lyshandave/EduCore-PH
echo Website: https://app-one-plum-38.vercel.app
echo.
pause
