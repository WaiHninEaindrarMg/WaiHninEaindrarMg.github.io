@echo off
chcp 65001 >nul
echo ============================================================================
echo   Deploying Portfolio Website to https://waihnineaindrarmg.github.io
echo   Repository: https://github.com/WaiHninEaindrarMg/WaiHninEaindrarMg.github.io
echo ============================================================================
echo.
cd /d "%~dp0"

git status >nul 2>&1
if errorlevel 1 (
    git init -b main
    git config user.name "Wai Hnin Eaindrar Mg"
    git config user.email "waihnineaindrarmg@gmail.com"
)

git add -A
git commit -m "Deploy bilingual AI Engineer & Researcher portfolio website" 2>nul

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/WaiHninEaindrarMg/WaiHninEaindrarMg.github.io.git
) else (
    git remote set-url origin https://github.com/WaiHninEaindrarMg/WaiHninEaindrarMg.github.io.git
)

echo Pushing to GitHub branch 'main'...
git branch -M main
git push -u origin main

echo.
echo ============================================================================
echo   If push succeeded, your site will be live in 1-2 minutes at:
echo   https://waihnineaindrarmg.github.io
echo ============================================================================
pause
