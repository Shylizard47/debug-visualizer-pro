@echo off
echo Building and running C++ test for Debug Visualizer Pro...

cd /d "%~dp0"
cd test

echo.
echo Compiling main.cpp...
g++ -g -o main.exe main.cpp

if %errorlevel% neq 0 (
    echo.
    echo Compilation failed! Make sure you have g++ installed.
    echo You can install it via:
    echo   - MinGW-w64
    echo   - MSYS2
    echo   - Visual Studio Build Tools
    pause
    exit /b 1
)

echo.
echo Compilation successful!
echo.
echo Now follow these steps to test the Debug Visualizer:
echo.
echo 1. Press F5 to run the Debug Visualizer Pro extension
echo 2. In the new Extension Development Host window:
echo    a. Open the test/main.cpp file
echo    b. Set a breakpoint on line 21 (the cout line)
echo    c. Press F5 to start debugging
echo    d. When it stops at the breakpoint, press Ctrl+Shift+P
echo    e. Type "Debug Visualizer: Show Data Structure"
echo    f. You should see myArray, myHashMap, and root detected!
echo.
echo The test program contains:
echo   - myArray: vector with [10, 20, 30, 40, 50]
echo   - myHashMap: map with apple=5, banana=3
echo   - root: TreeNode with left(30) and right(70) children
echo.
pause