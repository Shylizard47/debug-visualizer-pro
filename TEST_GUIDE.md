# Debug Visualizer Pro - Test Setup

## Quick Test Guide

### 🚀 **Option 1: Automated Test (Recommended)**

1. **Run the test script:**
   ```bash
   ./test-extension.bat
   ```

2. **Follow the instructions** that appear to test the extension

### 🛠️ **Option 2: Manual Test Setup**

1. **Open two VS Code windows:**
   - Window 1: This extension project
   - Window 2: For testing the compiled C++ program

2. **In Window 1 (Extension Development):**
   - Press **F5** to run the extension in development mode
   - This opens a new "Extension Development Host" window

3. **In the Extension Development Host window:**
   - Open `test/main.cpp`
   - Set a breakpoint on line 21: `std::cout << "Debug point!" << std::endl;`
   - Press **F5** to start debugging
   - Select the appropriate C++ debugger configuration

4. **When execution stops at the breakpoint:**
   - Press **Ctrl+Shift+P**
   - Type: **"Debug Visualizer: Show Data Structure"**
   - You should see the data structure detection panel!

### 📊 **Expected Results**

The test program contains these data structures that should be detected:

- **`myArray`** - `std::vector<int>` with values [10, 20, 30, 40, 50]
- **`myHashMap`** - `std::map<string, int>` with "apple"→5, "banana"→3  
- **`root`** - `TreeNode*` with tree structure:
  ```
      50
     /  \
    30   70
  ```

### 🎯 **What Should Happen**

1. **Detection Phase:** Extension detects the three data structures
2. **Selection Menu:** Shows a quick-pick with the detected structures
3. **Visualization:** Opens JGrasp-style visualization panels for selected structures
4. **Tree View:** Debug sidebar shows "Data Structures" with expandable nodes

### 🔧 **Prerequisites**

- **C++ Compiler:** g++ (MinGW), clang, or Visual Studio
- **VS Code C++ Extension:** For debugging support
- **Debugger:** gdb, lldb, or Visual Studio debugger

### 🐛 **Troubleshooting**

- **No structures detected:** Ensure breakpoint is hit and variables are in scope
- **Compilation errors:** Check that g++ is installed and in PATH
- **Debug issues:** Install "C/C++" extension for VS Code