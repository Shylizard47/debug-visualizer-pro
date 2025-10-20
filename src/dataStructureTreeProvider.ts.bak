import * as vscode from 'vscode';
import { DataStructureDetector, DataStructureInfo, DataStructureType } from './dataStructureDetector';

export class DataStructureTreeProvider implements vscode.TreeDataProvider<DataStructureItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DataStructureItem | undefined | null | void> = new vscode.EventEmitter<DataStructureItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DataStructureItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private debugSession: vscode.DebugSession | undefined;
    private detector: DataStructureDetector;

    constructor(detector: DataStructureDetector) {
        this.detector = detector;
    }

    setDebugSession(session: vscode.DebugSession | undefined) {
        this.debugSession = session;
        this.detector.setDebugSession(session);
        this.refresh();
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DataStructureItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: DataStructureItem): Promise<DataStructureItem[]> {
        if (!this.debugSession) {
            return [new DataStructureItem(
                'No active debug session',
                'Start debugging to see data structures',
                vscode.TreeItemCollapsibleState.None
            )];
        }

        if (!element) {
            // Root level - show detected data structures
            return this.getDataStructures();
        }

        // Get children of a specific data structure
        return this.getDataStructureElements(element);
    }

    private async getDataStructures(): Promise<DataStructureItem[]> {
        try {
            const dataStructures = await this.detector.detectDataStructures();
            
            if (dataStructures.length === 0) {
                return [new DataStructureItem(
                    'No data structures found',
                    'Variables in scope don\'t match known data structure patterns',
                    vscode.TreeItemCollapsibleState.None
                )];
            }

            return dataStructures.map(ds => {
                const label = `${ds.name} (${ds.type})${ds.size !== undefined ? ` [${ds.size}]` : ''}`;
                return new DataStructureItem(
                    label,
                    ds.type,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    ds,
                    {
                        command: 'dataVisualizer.show',
                        title: 'Visualize Data Structure',
                        arguments: [ds]
                    }
                );
            });
        } catch (error) {
            return [new DataStructureItem(
                'Error detecting data structures',
                `${error}`,
                vscode.TreeItemCollapsibleState.None
            )];
        }
    }

    private async getDataStructureElements(element: DataStructureItem): Promise<DataStructureItem[]> {
        if (!this.debugSession || !element.dataStructure?.variablesReference) {
            return [];
        }

        try {
            const variables = await this.debugSession.customRequest('variables', {
                variablesReference: element.dataStructure.variablesReference
            });

            const children: DataStructureItem[] = [];

            for (const variable of variables.variables) {
                const childItem = new DataStructureItem(
                    `${variable.name}: ${variable.value}`,
                    variable.type || 'unknown',
                    variable.variablesReference > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                    undefined,
                    undefined,
                    variable.variablesReference
                );
                children.push(childItem);
            }

            return children;
        } catch (error) {
            return [new DataStructureItem(
                'Error loading elements',
                `${error}`,
                vscode.TreeItemCollapsibleState.None
            )];
        }
    }
}

export class DataStructureItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly dataStructure?: DataStructureInfo,
        public readonly command?: vscode.Command,
        public readonly variablesReference?: number
    ) {
        super(label, collapsibleState);

        this.tooltip = `${this.label}: ${this.description}`;
        this.description = description;
        
        // Set icons based on data structure type
        if (dataStructure) {
            this.iconPath = this.getIconForDataStructure(dataStructure.type);
            this.contextValue = 'dataStructure';
        } else {
            this.iconPath = new vscode.ThemeIcon('symbol-property');
            this.contextValue = 'dataStructureElement';
        }
    }

    private getIconForDataStructure(type: DataStructureType): vscode.ThemeIcon {
        switch (type) {
            case DataStructureType.Array:
                return new vscode.ThemeIcon('symbol-array');
            case DataStructureType.List:
                return new vscode.ThemeIcon('list-ordered');
            case DataStructureType.Stack:
                return new vscode.ThemeIcon('list-flat');
            case DataStructureType.Queue:
                return new vscode.ThemeIcon('arrow-right');
            case DataStructureType.Tree:
            case DataStructureType.BST:
                return new vscode.ThemeIcon('symbol-class');
            case DataStructureType.Graph:
                return new vscode.ThemeIcon('graph');
            case DataStructureType.HashMap:
                return new vscode.ThemeIcon('symbol-object');
            case DataStructureType.Set:
                return new vscode.ThemeIcon('symbol-enum');
            case DataStructureType.Vector:
                return new vscode.ThemeIcon('symbol-array');
            case DataStructureType.Deque:
                return new vscode.ThemeIcon('list-unordered');
            default:
                return new vscode.ThemeIcon('symbol-misc');
        }
    }
}