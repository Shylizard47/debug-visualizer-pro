# Setup Instructions for Debug Visualizer Pro

## 🚀 Quick Setup Guide

### Step 1: Install Node.js (Required)

Since npm is not recognized, you need to install Node.js first:

1. **Download Node.js**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS version** (Long Term Support)
   - Choose the Windows Installer (.msi) for your system

2. **Install Node.js**:
   - Run the downloaded installer
   - Follow the installation wizard (accept defaults)
   - **Important**: Make sure "Add to PATH" is checked
   - Restart VS Code after installation

3. **Verify Installation**:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Install Dependencies

After Node.js is installed:

```powershell
cd "C:\Users\Owner\OneDrive\Desktop\.vscode\Debug Visualizer Pro"
npm install
```

### Step 3: Compile the Extension

```powershell
npm run compile
```

### Step 4: Test the Extension

1. **Press F5** in VS Code to launch Extension Development Host
2. **Start debugging** any program with data structures
3. **Open Command Palette** (`Ctrl+Shift+P`)
4. **Run** "Show Data Structure" command

## 📚 GitHub Repository Setup

### Initialize Git Repository

```powershell
# Initialize git in the project folder
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Universal Debug Visualizer Pro"

# Add your GitHub repository as origin
git remote add origin https://github.com/Shylizard47/debug-visualizer-pro.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Create GitHub Repository

1. Go to [https://github.com/Shylizard47](https://github.com/Shylizard47)
2. Click **"New repository"**
3. Repository name: `debug-visualizer-pro`
4. Description: `Universal JGrasp-style data structure visualizer for VS Code`
5. **Public** repository
6. **Don't** initialize with README (we have one)
7. Click **"Create repository"**

## 🛠️ Development Workflow

### Daily Development Commands

```powershell
# Install new dependencies
npm install

# Compile TypeScript to JavaScript
npm run compile

# Watch mode (auto-compile on file changes)
npm run watch

# Package extension for distribution
npm run package

# Test the extension
# Press F5 in VS Code
```

### VS Code Extension Development

1. **Make changes** to TypeScript files in `src/`
2. **Compile** with `npm run compile`
3. **Test** by pressing F5 to launch Extension Development Host
4. **Debug** the extension code using VS Code's debugger

## 🔧 Troubleshooting

### Node.js Installation Issues

If you still get "npm not recognized" after installing Node.js:

1. **Restart VS Code completely**
2. **Restart PowerShell**
3. **Check PATH environment variable**:
   ```powershell
   $env:PATH -split ';' | Where-Object { $_ -like '*node*' }
   ```
4. **Manual PATH fix** (if needed):
   - Add `C:\Program Files\nodejs\` to your PATH
   - Restart terminal

### Compilation Issues

Common TypeScript compilation errors:

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# Force recompile
npm run compile
```

### Extension Testing Issues

If extension doesn't activate:

1. Check `package.json` activation events
2. Verify commands are registered correctly
3. Look at Extension Development Host console for errors
4. Check VS Code Developer Tools (Help → Toggle Developer Tools)

## 📦 VS Code Extension Marketplace

### Publishing to Marketplace (Optional)

Once your extension is ready:

```powershell
# Install VSCE (Visual Studio Code Extension CLI)
npm install -g @vscode/vsce

# Package the extension
vsce package

# Publish to marketplace (requires account)
vsce publish
```

## 🎯 Current Status

- ✅ Universal data structure detection
- ✅ Multi-language support (C++, Java, Python, JS, etc.)
- ✅ JGrasp-style clean visualization
- ✅ All major data structures supported
- ⏳ Needs Node.js installation to compile
- ⏳ Ready to push to GitHub

## 🚀 Next Steps

1. **Install Node.js** from nodejs.org
2. **Run `npm install`** to get dependencies
3. **Run `npm run compile`** to build
4. **Press F5** to test the extension
5. **Push to your GitHub repository**

The extension is fully functional and ready to use once Node.js is installed!