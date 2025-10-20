import * as vscode from 'vscode';
import { DataStructureInfo, DataStructureType } from './dataStructureDetector';

export class UniversalVisualizationPanel {
    public static currentPanel: UniversalVisualizationPanel | undefined;
    public static readonly viewType = 'universalVisualization';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _focusType?: string;

    public static createOrShow(extensionUri: vscode.Uri, focusType?: string) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (UniversalVisualizationPanel.currentPanel) {
            UniversalVisualizationPanel.currentPanel._focusType = focusType;
            UniversalVisualizationPanel.currentPanel._panel.reveal(column);
            UniversalVisualizationPanel.currentPanel.refresh();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            UniversalVisualizationPanel.viewType,
            'Data Structure Visualizer',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media')
                ]
            }
        );

        UniversalVisualizationPanel.currentPanel = new UniversalVisualizationPanel(panel, extensionUri, focusType);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        UniversalVisualizationPanel.currentPanel = new UniversalVisualizationPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, focusType?: string) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._focusType = focusType;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState(
            () => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        this._panel.webview.onDidReceiveMessage(
            (message: any) => {
                switch (message.command) {
                    case 'refresh':
                        this.refresh();
                        return;
                    case 'exportImage':
                        this.exportImage(message.imageData);
                        return;
                    case 'changeVisualization':
                        this._focusType = message.type;
                        this.refresh();
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public refresh() {
        this._update();
    }

    private async exportImage(imageData: string) {
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file('data-structure-visualization.png'),
            filters: {
                'PNG Images': ['png']
            }
        });

        if (saveUri) {
            const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            await vscode.workspace.fs.writeFile(saveUri, buffer);
            vscode.window.showInformationMessage('Data structure visualization exported successfully!');
        }
    }

    public dispose() {
        UniversalVisualizationPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.title = 'Data Structure Visualizer';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debug Visualizer Pro</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .controls {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .visualization-selector {
            display: flex;
            gap: 5px;
            margin-right: 20px;
        }

        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.2s;
        }

        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        button.active {
            background-color: var(--vscode-button-secondaryBackground);
        }

        #visualizationContainer {
            width: 100%;
            height: 70vh;
            border: 1px solid var(--vscode-panel-border);
            background-color: var(--vscode-editor-background);
            position: relative;
            overflow: auto;
            border-radius: 4px;
        }

        .data-structure {
            position: absolute;
            transition: all 0.3s ease;
        }

        /* Array/List Visualization */
        .array-container {
            display: flex;
            gap: 2px;
            padding: 20px;
            flex-wrap: wrap;
        }

        .array-element {
            width: 50px;
            height: 40px;
            border: 2px solid var(--vscode-button-foreground);
            background-color: var(--vscode-button-background);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            position: relative;
        }

        .array-index {
            position: absolute;
            top: -20px;
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
        }

        /* Tree Visualization */
        .tree-node {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .node-circle {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background-color: var(--vscode-button-background);
            border: 2px solid var(--vscode-button-foreground);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--vscode-button-foreground);
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .node-line {
            position: absolute;
            background-color: var(--vscode-editor-foreground);
            transform-origin: left center;
            z-index: 1;
        }

        /* Stack/Queue Visualization */
        .stack-container {
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            padding: 20px;
            gap: 2px;
        }

        .queue-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 20px;
            gap: 2px;
        }

        .stack-element, .queue-element {
            width: 100px;
            height: 40px;
            border: 2px solid var(--vscode-button-foreground);
            background-color: var(--vscode-button-background);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            position: relative;
        }

        /* Graph Visualization */
        .graph-node {
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--vscode-button-background);
            border: 3px solid var(--vscode-button-foreground);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            cursor: pointer;
        }

        .graph-edge {
            position: absolute;
            background-color: var(--vscode-editor-foreground);
            height: 2px;
            transform-origin: left center;
        }

        /* Hash Map Visualization */
        .hashmap-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            padding: 20px;
        }

        .hashmap-bucket {
            border: 1px solid var(--vscode-panel-border);
            padding: 10px;
            border-radius: 4px;
        }

        .hashmap-entry {
            background-color: var(--vscode-input-background);
            padding: 5px;
            margin: 2px 0;
            border-radius: 2px;
            font-family: monospace;
        }

        .info-panel {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            border-radius: 0 4px 4px 0;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
        }

        .error-message, .info-message {
            text-align: center;
            padding: 40px;
            font-size: 14px;
        }

        .error-message {
            color: var(--vscode-errorForeground);
        }

        .info-message {
            color: var(--vscode-descriptionForeground);
        }

        .legend {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: var(--vscode-textBlockQuote-background);
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            border: 1px solid var(--vscode-panel-border);
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>🔍 Debug Visualizer Pro</h2>
        <div class="controls">
            <div class="visualization-selector">
                <button id="btnArray" onclick="selectVisualization('array')">Arrays</button>
                <button id="btnTree" onclick="selectVisualization('tree')">Trees</button>
                <button id="btnGraph" onclick="selectVisualization('graph')">Graphs</button>
                <button id="btnStack" onclick="selectVisualization('stack')">Stack/Queue</button>
                <button id="btnHashMap" onclick="selectVisualization('hashmap')">Maps</button>
            </div>
            <button onclick="refreshVisualization()">🔄 Refresh</button>
            <button onclick="exportImage()">💾 Export PNG</button>
            <button onclick="fitToScreen()">🔍 Fit Screen</button>
        </div>
    </div>

    <div id="visualizationContainer">
        <div class="info-message">
            <div>🌟 Universal Data Structure Visualizer</div>
            <div style="margin-top: 10px; font-size: 12px;">
                Start debugging any program to automatically detect and visualize data structures.<br>
                Supports: Arrays, Lists, Trees, Graphs, Stacks, Queues, Hash Maps, Sets, and more!
            </div>
            <div style="margin-top: 15px; font-size: 11px; opacity: 0.7;">
                Languages: C++, Java, Python, JavaScript, C#, Go, Rust, and others
            </div>
        </div>
    </div>

    <div id="infoPanel" class="info-panel" style="display: none;">
        <strong>📊 Data Structure Information:</strong>
        <div id="infoGrid" class="info-grid"></div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentData = null;
        let currentVisualization = '${this._focusType || 'array'}';

        // Visualization parameters
        const ARRAY_ELEMENT_WIDTH = 50;
        const TREE_NODE_SIZE = 45;
        const TREE_LEVEL_HEIGHT = 100;
        const GRAPH_NODE_SIZE = 60;

        function selectVisualization(type) {
            currentVisualization = type;
            updateVisualizationButtons();
            vscode.postMessage({ command: 'changeVisualization', type: type });
            renderCurrentVisualization();
        }

        function updateVisualizationButtons() {
            document.querySelectorAll('.visualization-selector button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.getElementById('btn' + currentVisualization.charAt(0).toUpperCase() + currentVisualization.slice(1)).classList.add('active');
        }

        function refreshVisualization() {
            vscode.postMessage({ command: 'refresh' });
            loadSampleData(); // For now, show sample data
        }

        function exportImage() {
            const canvas = document.createElement('canvas');
            const container = document.getElementById('visualizationContainer');
            
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            
            const ctx = canvas.getContext('2d');
            
            // Fill background
            ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw current visualization
            drawVisualizationToCanvas(ctx);
            
            const imageData = canvas.toDataURL('image/png');
            vscode.postMessage({ command: 'exportImage', imageData: imageData });
        }

        function fitToScreen() {
            renderCurrentVisualization();
        }

        function loadSampleData() {
            const sampleData = {
                array: [10, 23, 45, 67, 89, 12, 34, 56],
                tree: {
                    value: 50,
                    left: {
                        value: 30,
                        left: { value: 20 },
                        right: { value: 40 }
                    },
                    right: {
                        value: 70,
                        left: { value: 60 },
                        right: { value: 80 }
                    }
                },
                stack: [1, 2, 3, 4, 5],
                queue: [1, 2, 3, 4, 5],
                graph: {
                    nodes: ['A', 'B', 'C', 'D'],
                    edges: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['A', 'D']]
                },
                hashmap: {
                    'key1': 'value1',
                    'key2': 'value2',
                    'key3': 'value3'
                }
            };

            currentData = sampleData;
            renderCurrentVisualization();
            showDataInfo();
        }

        function renderCurrentVisualization() {
            const container = document.getElementById('visualizationContainer');
            container.innerHTML = '';

            if (!currentData) {
                container.innerHTML = '<div class="info-message">No data available. Start debugging to see data structures.</div>';
                return;
            }

            switch (currentVisualization) {
                case 'array':
                    renderArray(container, currentData.array);
                    break;
                case 'tree':
                    renderTree(container, currentData.tree);
                    break;
                case 'stack':
                    renderStack(container, currentData.stack);
                    break;
                case 'graph':
                    renderGraph(container, currentData.graph);
                    break;
                case 'hashmap':
                    renderHashMap(container, currentData.hashmap);
                    break;
                default:
                    container.innerHTML = '<div class="error-message">Visualization type not supported yet</div>';
            }
        }

        function renderArray(container, data) {
            if (!data || !Array.isArray(data)) {
                container.innerHTML = '<div class="error-message">No array data available</div>';
                return;
            }

            const arrayContainer = document.createElement('div');
            arrayContainer.className = 'array-container';

            data.forEach((value, index) => {
                const element = document.createElement('div');
                element.className = 'array-element';
                element.textContent = value;
                element.title = \`Index \${index}: \${value}\`;

                const indexLabel = document.createElement('div');
                indexLabel.className = 'array-index';
                indexLabel.textContent = index;
                element.appendChild(indexLabel);

                element.addEventListener('click', () => {
                    element.style.backgroundColor = 'var(--vscode-list-activeSelectionBackground)';
                    setTimeout(() => {
                        element.style.backgroundColor = 'var(--vscode-button-background)';
                    }, 300);
                });

                arrayContainer.appendChild(element);
            });

            container.appendChild(arrayContainer);
        }

        function renderTree(container, tree) {
            if (!tree) {
                container.innerHTML = '<div class="error-message">No tree data available</div>';
                return;
            }

            const layout = calculateTreeLayout(tree);
            renderTreeNodes(container, layout);
        }

        function calculateTreeLayout(tree) {
            const levels = [];
            const positions = new Map();

            function assignLevels(node, level = 0) {
                if (!node) return;
                
                if (!levels[level]) levels[level] = [];
                levels[level].push(node);
                
                assignLevels(node.left, level + 1);
                assignLevels(node.right, level + 1);
            }

            assignLevels(tree);

            let maxWidth = 0;
            for (let level = 0; level < levels.length; level++) {
                const nodesAtLevel = levels[level];
                const levelWidth = nodesAtLevel.length * 100;
                maxWidth = Math.max(maxWidth, levelWidth);

                const startX = 50;
                for (let i = 0; i < nodesAtLevel.length; i++) {
                    const node = nodesAtLevel[i];
                    positions.set(node, {
                        x: startX + i * 100,
                        y: 50 + level * TREE_LEVEL_HEIGHT
                    });
                }
            }

            return { positions, levels };
        }

        function renderTreeNodes(container, layout) {
            // Render edges first
            layout.positions.forEach((pos, node) => {
                if (node.left && layout.positions.has(node.left)) {
                    renderTreeEdge(container, pos, layout.positions.get(node.left));
                }
                if (node.right && layout.positions.has(node.right)) {
                    renderTreeEdge(container, pos, layout.positions.get(node.right));
                }
            });

            // Render nodes
            layout.positions.forEach((pos, node) => {
                const nodeElement = document.createElement('div');
                nodeElement.className = 'tree-node';
                nodeElement.style.left = (pos.x - TREE_NODE_SIZE/2) + 'px';
                nodeElement.style.top = (pos.y - TREE_NODE_SIZE/2) + 'px';

                const circle = document.createElement('div');
                circle.className = 'node-circle';
                circle.textContent = node.value;
                circle.title = \`Node: \${node.value}\`;

                nodeElement.appendChild(circle);
                container.appendChild(nodeElement);

                nodeElement.addEventListener('click', () => {
                    circle.style.backgroundColor = 'var(--vscode-list-activeSelectionBackground)';
                    setTimeout(() => {
                        circle.style.backgroundColor = 'var(--vscode-button-background)';
                    }, 300);
                });
            });
        }

        function renderTreeEdge(container, fromPos, toPos) {
            const line = document.createElement('div');
            line.className = 'node-line';
            
            const deltaX = toPos.x - fromPos.x;
            const deltaY = toPos.y - fromPos.y;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            
            line.style.left = fromPos.x + 'px';
            line.style.top = fromPos.y + 'px';
            line.style.width = length + 'px';
            line.style.height = '2px';
            line.style.transform = \`rotate(\${angle}deg)\`;
            
            container.appendChild(line);
        }

        function renderStack(container, data) {
            if (!data || !Array.isArray(data)) {
                container.innerHTML = '<div class="error-message">No stack data available</div>';
                return;
            }

            const stackContainer = document.createElement('div');
            stackContainer.className = 'stack-container';

            data.forEach((value, index) => {
                const element = document.createElement('div');
                element.className = 'stack-element';
                element.textContent = value;
                element.title = \`Stack level \${data.length - index}: \${value}\`;
                
                if (index === data.length - 1) {
                    element.style.borderColor = 'var(--vscode-list-activeSelectionBackground)';
                    element.style.borderWidth = '3px';
                }

                stackContainer.appendChild(element);
            });

            container.appendChild(stackContainer);
        }

        function renderGraph(container, data) {
            if (!data || !data.nodes || !data.edges) {
                container.innerHTML = '<div class="error-message">No graph data available</div>';
                return;
            }

            const positions = calculateGraphLayout(data.nodes);
            
            // Render edges first
            data.edges.forEach(([from, to]) => {
                const fromPos = positions.get(from);
                const toPos = positions.get(to);
                if (fromPos && toPos) {
                    renderGraphEdge(container, fromPos, toPos);
                }
            });

            // Render nodes
            positions.forEach((pos, node) => {
                const nodeElement = document.createElement('div');
                nodeElement.className = 'graph-node';
                nodeElement.style.left = (pos.x - GRAPH_NODE_SIZE/2) + 'px';
                nodeElement.style.top = (pos.y - GRAPH_NODE_SIZE/2) + 'px';
                nodeElement.textContent = node;
                nodeElement.title = \`Node: \${node}\`;

                container.appendChild(nodeElement);
            });
        }

        function calculateGraphLayout(nodes) {
            const positions = new Map();
            const centerX = 300;
            const centerY = 200;
            const radius = 150;

            nodes.forEach((node, index) => {
                const angle = (index / nodes.length) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                positions.set(node, { x, y });
            });

            return positions;
        }

        function renderGraphEdge(container, fromPos, toPos) {
            const line = document.createElement('div');
            line.className = 'graph-edge';
            
            const deltaX = toPos.x - fromPos.x;
            const deltaY = toPos.y - fromPos.y;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            
            line.style.left = fromPos.x + 'px';
            line.style.top = fromPos.y + 'px';
            line.style.width = length + 'px';
            line.style.transform = \`rotate(\${angle}deg)\`;
            
            container.appendChild(line);
        }

        function renderHashMap(container, data) {
            if (!data || typeof data !== 'object') {
                container.innerHTML = '<div class="error-message">No hash map data available</div>';
                return;
            }

            const hashmapContainer = document.createElement('div');
            hashmapContainer.className = 'hashmap-container';

            Object.entries(data).forEach(([key, value]) => {
                const bucket = document.createElement('div');
                bucket.className = 'hashmap-bucket';
                bucket.innerHTML = \`
                    <strong>Hash: \${hashCode(key) % 8}</strong>
                    <div class="hashmap-entry">\${key} → \${value}</div>
                \`;
                hashmapContainer.appendChild(bucket);
            });

            container.appendChild(hashmapContainer);
        }

        function hashCode(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash);
        }

        function showDataInfo() {
            const infoPanel = document.getElementById('infoPanel');
            const infoGrid = document.getElementById('infoGrid');
            
            if (!currentData) {
                infoPanel.style.display = 'none';
                return;
            }

            const stats = calculateDataStats();
            infoGrid.innerHTML = Object.entries(stats)
                .map(([key, value]) => \`
                    <div class="info-item">
                        <span>\${key}:</span>
                        <span>\${value}</span>
                    </div>
                \`).join('');
            
            infoPanel.style.display = 'block';
        }

        function calculateDataStats() {
            const stats = {};
            
            if (currentData.array) {
                stats['Array Length'] = currentData.array.length;
                stats['Array Sum'] = currentData.array.reduce((a, b) => a + b, 0);
            }
            
            if (currentData.tree) {
                stats['Tree Height'] = calculateTreeHeight(currentData.tree);
                stats['Tree Nodes'] = countTreeNodes(currentData.tree);
            }
            
            return stats;
        }

        function calculateTreeHeight(tree) {
            if (!tree) return 0;
            return 1 + Math.max(
                calculateTreeHeight(tree.left), 
                calculateTreeHeight(tree.right)
            );
        }

        function countTreeNodes(tree) {
            if (!tree) return 0;
            return 1 + countTreeNodes(tree.left) + countTreeNodes(tree.right);
        }

        function drawVisualizationToCanvas(ctx) {
            // This would render the current visualization to canvas for export
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.fillText('Data Structure Visualization Export', 10, 30);
        }

        // Initialize
        window.addEventListener('load', () => {
            updateVisualizationButtons();
            loadSampleData();
        });
    </script>
</body>
</html>`;
    }
}