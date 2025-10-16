# Debug Visualizer Pro

A universal VS Code extension that provides clean, JGrasp-style visualization for **all data structures** across **all programming languages** during debugging.

## 🌟 Features

### Universal Data Structure Support
- **Trees**: Binary Trees, BSTs, AVL, Red-Black, B-Trees, Tries
- **Arrays & Lists**: Arrays, Vectors, LinkedLists, ArrayLists  
- **Stacks & Queues**: LIFO/FIFO structures, Deques, Priority Queues
- **Graphs**: Directed/Undirected, Adjacency Lists/Matrix, Networks
- **Hash Structures**: Hash Maps, Hash Sets, Hash Tables
- **Advanced**: Sets, Heaps, Disjoint Sets, Segment Trees

### Multi-Language Support  
- **C/C++**: STL containers, custom structures, pointers
- **Java**: Collections Framework, custom classes
- **Python**: Built-in types (list, dict, set), custom objects
- **JavaScript/TypeScript**: Arrays, Objects, Maps, Sets
- **C#**: .NET collections, custom structures  
- **Go**: Slices, Maps, custom structs
- **Rust**: Vec, HashMap, BTreeMap, custom types

### JGrasp-Style Visualization
- 🎯 **Clean Hierarchical Layout** - No physics simulation, proper positioning
- 🔍 **Minimal Clutter** - Only actual data elements (no preemptive nodes)
- 🎨 **Theme Integration** - Matches VS Code color schemes
- 📏 **Automatic Scaling** - Fits any data structure size
- 💾 **Export Capability** - Save as high-quality PNG images

## Quick Start

1. **Install Dependencies** (requires Node.js):
   ```bash
   npm install
   ```

2. **Compile the Extension**:
   ```bash
   npm run compile
   ```

3. **Launch Extension Development**:
   - Press `F5` to open a new VS Code window with the extension loaded
   - Start debugging a C++ program with BST data structures
   - Use `Ctrl+Shift+P` and search for "Show BST Visualization"

## Usage

### During C++ Debugging

1. Set breakpoints in your C++ code that uses Binary Search Trees
2. Start debugging with F5
3. When execution pauses at a breakpoint:
   - Open Command Palette (`Ctrl+Shift+P`)
   - Run "Show BST Visualization" 
   - The extension will automatically detect BST variables and display them

### Supported Data Structures by Language

#### C/C++
```cpp
// Trees & BSTs
struct TreeNode { int data; TreeNode* left; TreeNode* right; };
TreeNode* root;

// STL Containers  
std::vector<int> vec;
std::list<int> lst;
std::stack<int> stk;
std::queue<int> que;
std::map<string, int> map;
std::set<int> set;

// Arrays
int arr[100];
int* dynamicArray;
```

#### Java
```java
// Collections Framework
ArrayList<Integer> list;
LinkedList<String> linkedList;
Stack<Integer> stack;
Queue<String> queue;
HashMap<String, Integer> map;
TreeMap<String, Integer> treeMap;
HashSet<Integer> set;

// Custom Classes
class TreeNode { int val; TreeNode left, right; }
```

#### Python
```python
# Built-in Types
my_list = [1, 2, 3, 4]
my_dict = {'key': 'value'}
my_set = {1, 2, 3}
my_tuple = (1, 2, 3)

# Custom Classes
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

#### JavaScript/TypeScript
```javascript
// Built-in Types
let array = [1, 2, 3, 4];
let object = {key: 'value'};
let map = new Map();
let set = new Set();

// Custom Classes
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

## Development Setup

### Prerequisites

- **Node.js** (v16 or later)
- **npm** package manager  
- **VS Code** (v1.74.0 or later)

### Installation

1. **Clone or download** this extension project
2. **Install Node.js** from [nodejs.org](https://nodejs.org/) if not already installed
3. **Install dependencies**:
   ```bash
   cd "path/to/Debug Visualizer Pro"
   npm install
   ```

### Building

- **Compile**: `npm run compile`
- **Watch mode**: `npm run watch` (auto-recompiles on file changes)
- **Package**: `npm run package` (creates .vsix file for distribution)

### Testing

1. **Open the project** in VS Code
2. **Press F5** to launch Extension Development Host
3. **Test with sample C++ code**:
   ```cpp
   #include <iostream>
   
   struct TreeNode {
       int data;
       TreeNode* left;
       TreeNode* right;
   };
   
   int main() {
       TreeNode* root = new TreeNode{50, nullptr, nullptr};
       root->left = new TreeNode{30, nullptr, nullptr};
       root->right = new TreeNode{70, nullptr, nullptr};
       
       // Set breakpoint here and start debugging
       return 0;
   }
   ```

## Architecture

### Core Components

- **`extension.ts`** - Main extension entry point and command registration
- **`bstTreeDataProvider.ts`** - Debug session integration and BST detection  
- **`bstVisualizationPanel.ts`** - Webview panel with JGrasp-style rendering

### Visualization Features

- **Hierarchical Layout Algorithm** - Clean tree positioning without physics simulation
- **Automatic Node Detection** - Finds BST variables from debug session
- **Theme Integration** - Uses VS Code's color variables for consistent appearance
- **Export Functionality** - Save visualizations as PNG images

## Customization

### Layout Parameters

Edit `bstVisualizationPanel.ts` to adjust:

```javascript
const NODE_WIDTH = 40;           // Node circle diameter
const NODE_HEIGHT = 40;          // Node circle height  
const LEVEL_HEIGHT = 80;         // Vertical spacing between levels
const MIN_HORIZONTAL_SPACING = 60; // Minimum horizontal node spacing
```

### Styling

The webview uses CSS custom properties that automatically match VS Code themes:

- `--vscode-editor-background`
- `--vscode-editor-foreground` 
- `--vscode-button-background`
- `--vscode-panel-border`

## Comparison with Other Extensions

| Feature | BST Debug Visualizer Pro | Typical Debug Visualizers |
|---------|-------------------------|---------------------------|
| Layout | Clean hierarchical (JGrasp-style) | Physics-based, cluttered |
| Node Creation | Only actual BST nodes | Preemptive node creation |
| Performance | Fast, minimal overhead | Can be slow with large trees |
| Integration | Seamless C++ debug integration | Often requires manual setup |
| Export | PNG export built-in | Limited export options |

## Troubleshooting

### Extension Not Activating

- Ensure you're debugging a C++ program (`debugType == 'cppdbg'`)
- Check that BST variables are in scope at the breakpoint
- Verify extension is installed and enabled

### No BST Variables Detected

- Variable names should contain keywords: `root`, `tree`, `node`
- Or variable types should contain: `Node`, `Tree`
- Ensure variables are pointers with `variablesReference > 0`

### Compilation Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild TypeScript
npm run compile
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make changes** and test thoroughly
4. **Submit a pull request** with detailed description

## License

MIT License - see LICENSE file for details.

## Changelog

### v0.0.1 (Initial Release)
- ✨ JGrasp-style hierarchical tree visualization
- 🔗 VS Code debugger integration for C++ BST structures  
- 💾 PNG export functionality
- 🎨 VS Code theme support
- 📊 Tree statistics display