@echo off
echo ========================================
echo FIXING DEPLOYMENT ISSUES
echo ========================================
echo.

echo Step 1: Backing up files...
copy package.json package.json.backup
copy hardhat.config.js hardhat.config.js.backup
echo Done!
echo.

echo Step 2: Using simple CommonJS versions...
copy package-simple.json package.json
copy hardhat-simple.config.js hardhat.config.js
echo Done!
echo.

echo Step 3: Cleaning old dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Done!
echo.

echo Step 4: Installing fresh dependencies...
call npm install
echo Done!
echo.

echo ========================================
echo FIX COMPLETE!
echo ========================================
echo.
echo Now run: npm run deploy
echo.
pause
