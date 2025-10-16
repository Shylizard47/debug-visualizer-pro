import * as vscode from 'vscode';

export class BSTVisualizationPanel {
    public static currentPanel: BSTVisualizationPanel | undefined;
    public static readonly viewType = 'bstVisualization';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (BSTVisualizationPanel.currentPanel) {
            BSTVisualizationPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            BSTVisualizationPanel.viewType,
            'BST Visualization',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media')
                ]
            }
        );

        BSTVisualizationPanel.currentPanel = new BSTVisualizationPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        BSTVisualizationPanel.currentPanel = new BSTVisualizationPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

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
            message => {
                switch (message.command) {
                    case 'refresh':
                        this.refresh();
                        return;
                    case 'exportImage':
                        this.exportImage(message.imageData);
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
            defaultUri: vscode.Uri.file('bst-visualization.png'),
            filters: {
                'PNG Images': ['png']
            }
        });

        if (saveUri) {
            // Convert base64 to buffer and save
            const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            await vscode.workspace.fs.writeFile(saveUri, buffer);
            vscode.window.showInformationMessage('BST visualization exported successfully!');
        }
    }

    public dispose() {
        BSTVisualizationPanel.currentPanel = undefined;

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
        this._panel.title = 'BST Visualization';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BST Debug Visualizer Pro</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }

        .controls {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }

        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        #treeContainer {
            width: 100%;
            height: 600px;
            border: 1px solid var(--vscode-panel-border);
            background-color: var(--vscode-editor-background);
            position: relative;
            overflow: auto;
        }

        .tree-node {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .node-circle {
            width: 40px;
            height: 40px;
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

        .node-circle:hover {
            background-color: var(--vscode-button-hoverBackground);
            transform: scale(1.1);
        }

        .node-line {
            position: absolute;
            background-color: var(--vscode-editor-foreground);
            transform-origin: left center;
        }

        .node-null {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: var(--vscode-input-background);
            border: 1px dashed var(--vscode-input-border);
            opacity: 0.5;
        }

        .error-message {
            text-align: center;
            padding: 40px;
            color: var(--vscode-errorForeground);
            font-size: 14px;
        }

        .info-message {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
            font-size: 14px;
        }

        .tree-info {
            margin-top: 20px;
            padding: 10px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="controls">
        <button onclick="refreshVisualization()">🔄 Refresh</button>
        <button onclick="exportImage()">💾 Export as PNG</button>
        <button onclick="fitToScreen()">🔍 Fit to Screen</button>
        <span style="margin-left: auto; font-size: 12px;">JGrasp-Style BST Visualization</span>
    </div>

    <div id="treeContainer">
        <div class="info-message">
            <div>🌳 BST Debug Visualizer Pro</div>
            <div style="margin-top: 10px; font-size: 12px;">
                Start debugging a C++ program with BST variables to see the tree visualization.
            </div>
        </div>
    </div>

    <div id="treeInfo" class="tree-info" style="display: none;">
        <strong>Tree Information:</strong>
        <div id="treeStats"></div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        // JGrasp-style tree layout parameters
        const NODE_WIDTH = 40;
        const NODE_HEIGHT = 40;
        const LEVEL_HEIGHT = 80;
        const MIN_HORIZONTAL_SPACING = 60;

        let treeData = null;
        let containerWidth = 800;
        let containerHeight = 600;

        function refreshVisualization() {
            vscode.postMessage({ command: 'refresh' });
            // For now, show sample data
            showSampleTree();
        }

        function exportImage() {
            const canvas = document.createElement('canvas');
            const container = document.getElementById('treeContainer');
            
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            
            const ctx = canvas.getContext('2d');
            
            // Fill background
            ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw tree (this would render the current tree)
            drawTreeToCanvas(ctx);
            
            // Convert to base64 and send to extension
            const imageData = canvas.toDataURL('image/png');
            vscode.postMessage({ command: 'exportImage', imageData: imageData });
        }

        function fitToScreen() {
            if (treeData) {
                renderTree(treeData, true);
            }
        }

        function showSampleTree() {
            // Sample BST for demonstration
            const sampleTree = {
                value: 50,
                left: {
                    value: 30,
                    left: { value: 20, left: null, right: null },
                    right: { value: 40, left: null, right: null }
                },
                right: {
                    value: 70,
                    left: { value: 60, left: null, right: null },
                    right: { value: 80, left: null, right: null }
                }
            };
            
            renderTree(sampleTree);
            showTreeInfo(sampleTree);
        }

        function renderTree(tree, fitToScreen = false) {
            const container = document.getElementById('treeContainer');
            container.innerHTML = '';
            
            if (!tree) {
                container.innerHTML = '<div class="error-message">No BST data available</div>';
                return;
            }

            // Calculate tree dimensions using JGrasp-style layout
            const treeLayout = calculateJGraspLayout(tree);
            
            if (fitToScreen) {
                // Scale to fit container
                const scaleX = (container.offsetWidth - 40) / treeLayout.width;
                const scaleY = (container.offsetHeight - 40) / treeLayout.height;
                const scale = Math.min(scaleX, scaleY, 1);
                
                scaleLayout(treeLayout, scale);
            }

            // Render nodes and edges
            renderNodes(container, treeLayout);
            
            treeData = tree;
        }

        function calculateJGraspLayout(tree) {
            if (!tree) return { nodes: [], width: 0, height: 0 };
            
            // Calculate positions using clean hierarchical layout
            const levels = [];
            const positions = new Map();
            
            // First pass: determine levels and count nodes per level
            function assignLevels(node, level = 0) {
                if (!node) return;
                
                if (!levels[level]) levels[level] = [];
                levels[level].push(node);
                
                assignLevels(node.left, level + 1);
                assignLevels(node.right, level + 1);
            }
            
            assignLevels(tree);
            
            // Second pass: calculate horizontal positions
            let maxWidth = 0;
            
            for (let level = 0; level < levels.length; level++) {
                const nodesAtLevel = levels[level];
                const levelWidth = nodesAtLevel.length * MIN_HORIZONTAL_SPACING;
                maxWidth = Math.max(maxWidth, levelWidth);
                
                const startX = (maxWidth - levelWidth) / 2 + MIN_HORIZONTAL_SPACING / 2;
                
                for (let i = 0; i < nodesAtLevel.length; i++) {
                    const node = nodesAtLevel[i];
                    positions.set(node, {
                        x: startX + i * MIN_HORIZONTAL_SPACING,
                        y: 50 + level * LEVEL_HEIGHT,
                        level: level
                    });
                }
            }
            
            return {
                nodes: Array.from(positions.entries()).map(([node, pos]) => ({
                    node: node,
                    x: pos.x,
                    y: pos.y,
                    level: pos.level
                })),
                width: maxWidth + NODE_WIDTH,
                height: levels.length * LEVEL_HEIGHT + NODE_HEIGHT
            };
        }

        function scaleLayout(layout, scale) {
            layout.nodes.forEach(nodePos => {
                nodePos.x *= scale;
                nodePos.y *= scale;
            });
            layout.width *= scale;
            layout.height *= scale;
        }

        function renderNodes(container, layout) {
            // Render edges first (so they appear behind nodes)
            layout.nodes.forEach(nodePos => {
                if (nodePos.node.left) {
                    const leftPos = layout.nodes.find(n => n.node === nodePos.node.left);
                    if (leftPos) {
                        renderEdge(container, nodePos, leftPos);
                    }
                }
                
                if (nodePos.node.right) {
                    const rightPos = layout.nodes.find(n => n.node === nodePos.node.right);
                    if (rightPos) {
                        renderEdge(container, nodePos, rightPos);
                    }
                }
            });
            
            // Render nodes
            layout.nodes.forEach(nodePos => {
                renderNode(container, nodePos.node, nodePos.x, nodePos.y);
            });
        }

        function renderNode(container, node, x, y) {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'tree-node';
            nodeElement.style.left = (x - NODE_WIDTH/2) + 'px';
            nodeElement.style.top = (y - NODE_HEIGHT/2) + 'px';
            
            const circle = document.createElement('div');
            circle.className = 'node-circle';
            circle.textContent = node.value.toString();
            circle.title = \`Value: \${node.value}\`;
            
            nodeElement.appendChild(circle);
            container.appendChild(nodeElement);
            
            // Add click handler for node inspection
            nodeElement.onclick = () => {
                circle.style.background = 'var(--vscode-list-activeSelectionBackground)';
                setTimeout(() => {
                    circle.style.background = 'var(--vscode-button-background)';
                }, 200);
            };
        }

        function renderEdge(container, fromPos, toPos) {
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
            line.style.zIndex = '1';
            
            container.appendChild(line);
        }

        function drawTreeToCanvas(ctx) {
            // This would render the tree to canvas for export
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.fillText('BST Visualization Export', 10, 30);
        }

        function showTreeInfo(tree) {
            const infoDiv = document.getElementById('treeInfo');
            const statsDiv = document.getElementById('treeStats');
            
            const stats = calculateTreeStats(tree);
            
            statsDiv.innerHTML = \`
                <div>Nodes: \${stats.nodeCount}</div>
                <div>Height: \${stats.height}</div>
                <div>Leaves: \${stats.leafCount}</div>
            \`;
            
            infoDiv.style.display = 'block';
        }

        function calculateTreeStats(tree) {
            if (!tree) return { nodeCount: 0, height: 0, leafCount: 0 };
            
            let nodeCount = 0;
            let leafCount = 0;
            
            function traverse(node, level = 0) {
                if (!node) return level;
                
                nodeCount++;
                
                const leftHeight = traverse(node.left, level + 1);
                const rightHeight = traverse(node.right, level + 1);
                
                if (!node.left && !node.right) {
                    leafCount++;
                }
                
                return Math.max(leftHeight, rightHeight);
            }
            
            const height = traverse(tree);
            
            return { nodeCount, height, leafCount };
        }

        // Initialize with sample tree
        window.addEventListener('load', () => {
            showSampleTree();
        });
    </script>
</body>
</html>`;
    }
}