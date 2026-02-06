@echo off
echo ========================================
echo CLEANING AND DEPLOYING
echo ========================================
echo.

echo Step 1: Cleaning cache and artifacts...
if exist cache rmdir /s /q cache
if exist artifacts rmdir /s /q artifacts
echo Done!
echo.

echo Step 2: Compiling contract...
call npm run compile
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo COMPILATION FAILED!
    echo ========================================
    pause
    exit /b 1
)
echo Done!
echo.

echo Step 3: Deploying to Sepolia...
call npm run deploy
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Copy the contract address above and add it to .env.local
) else (
    echo ========================================
    echo DEPLOYMENT FAILED!
    echo ========================================
)
echo.
pause
