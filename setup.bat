@echo off
echo 🎥 Personal Creator Website Setup
echo ================================
echo.
echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found!
echo.
echo Starting interactive setup...
node setup.js
echo.
echo Setup complete! Press any key to exit.
pause >nul