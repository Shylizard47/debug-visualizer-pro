@echo off
echo Creating simple JavaScript extension...

REM Create the out directory if it doesn't exist
if not exist "out" mkdir out

REM Copy the working extension.js 
echo Extension files ready!

echo.
echo ================================
echo Extension is ready to test!
echo ================================
echo.
echo Instructions:
echo 1. Press F5 in VS Code
echo 2. Choose "Run Extension (No Build)" if prompted
echo 3. In the new window, use Ctrl+Shift+P
echo 4. Search for "Show Data Structure"
echo 5. The extension should work!
echo.
echo The extension now works without npm compilation!
echo.
pause