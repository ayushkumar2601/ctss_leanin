@echo off
echo Testing compilation...
echo.
call npm run compile
echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo SUCCESS! Contract compiled!
    echo ========================================
    echo.
    echo Now run: npm run deploy
) else (
    echo ========================================
    echo COMPILATION FAILED
    echo ========================================
    echo Check the error above
)
echo.
pause
