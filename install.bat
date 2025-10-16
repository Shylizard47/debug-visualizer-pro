@echo off
echo Installing Debug Visualizer Pro Extension...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart VS Code and run this script again
    echo.
    pause
    exit /b 1
)

echo Node.js found! Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Compiling TypeScript...
npm run compile

if %errorlevel% neq 0 (
    echo ERROR: Failed to compile!
    pause
    exit /b 1
)

echo.
echo ================================
echo SUCCESS! Extension is ready!
echo ================================
echo.
echo To test the extension:
echo 1. Press F5 in VS Code
echo 2. Start debugging any program
echo 3. Use Ctrl+Shift+P and search for "Show Data Structure"
echo.
echo To push to GitHub:
echo 1. git init
echo 2. git add .
echo 3. git commit -m "Initial commit"
echo 4. git remote add origin https://github.com/Shylizard47/debug-visualizer-pro.git
echo 5. git push -u origin main
echo.
pause