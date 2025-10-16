import * as vscode from 'vscode';
import { DataStructureTreeProvider } from './dataStructureTreeProvider';
import { UniversalVisualizationPanel } from './universalVisualizationPanel';
import { DataStructureDetector } from './dataStructureDetector';

export function activate(context: vscode.ExtensionContext) {
    console.log('Debug Visualizer Pro is now active!');

    // Create the data structure detector
    const detector = new DataStructureDetector();
    
    // Create the tree data provider
    const dataTreeProvider = new DataStructureTreeProvider(detector);
    
    // Register tree view
    const treeView = vscode.window.createTreeView('dataStructureView', {
        treeDataProvider: dataTreeProvider,
        showCollapseAll: true
    });

    // Register commands
    const showVisualizationCommand = vscode.commands.registerCommand('dataVisualizer.show', () => {
        UniversalVisualizationPanel.createOrShow(context.extensionUri);
    });

    const refreshCommand = vscode.commands.registerCommand('dataVisualizer.refresh', () => {
        dataTreeProvider.refresh();
        if (UniversalVisualizationPanel.currentPanel) {
            UniversalVisualizationPanel.currentPanel.refresh();
        }
    });

    const showArrayCommand = vscode.commands.registerCommand('dataVisualizer.showArray', () => {
        UniversalVisualizationPanel.createOrShow(context.extensionUri, 'array');
    });

    const showTreeCommand = vscode.commands.registerCommand('dataVisualizer.showTree', () => {
        UniversalVisualizationPanel.createOrShow(context.extensionUri, 'tree');
    });

    const showGraphCommand = vscode.commands.registerCommand('dataVisualizer.showGraph', () => {
        UniversalVisualizationPanel.createOrShow(context.extensionUri, 'graph');
    });

    const showStackCommand = vscode.commands.registerCommand('dataVisualizer.showStack', () => {
        UniversalVisualizationPanel.createOrShow(context.extensionUri, 'stack');
    });

    // Listen for debug session changes
    const debugSessionListener = vscode.debug.onDidChangeActiveDebugSession((session: vscode.DebugSession | undefined) => {
        if (session) {
            detector.setDebugSession(session);
            dataTreeProvider.setDebugSession(session);
        } else {
            detector.setDebugSession(undefined);
            dataTreeProvider.setDebugSession(undefined);
        }
    });

    // Register webview panel serializer
    vscode.window.registerWebviewPanelSerializer(
        UniversalVisualizationPanel.viewType,
        new UniversalVisualizationPanelSerializer(context.extensionUri)
    );

    context.subscriptions.push(
        treeView,
        showVisualizationCommand,
        showArrayCommand,
        showTreeCommand,
        showGraphCommand,
        showStackCommand,
        refreshCommand,
        debugSessionListener
    );
}

class UniversalVisualizationPanelSerializer implements vscode.WebviewPanelSerializer {
    constructor(private readonly extensionUri: vscode.Uri) {}

    async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        UniversalVisualizationPanel.revive(webviewPanel, this.extensionUri);
    }
}

export function deactivate() {
    console.log('Debug Visualizer Pro deactivated');
}