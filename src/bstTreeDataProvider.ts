import * as vscode from 'vscode';

export interface BSTNode {
    value: string;
    left?: BSTNode;
    right?: BSTNode;
    address?: string;
}

export class BSTTreeDataProvider implements vscode.TreeDataProvider<BSTNodeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BSTNodeItem | undefined | null | void> = new vscode.EventEmitter<BSTNodeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BSTNodeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private debugSession: vscode.DebugSession | undefined;
    private rootNode: BSTNode | undefined;

    constructor() {}

    setDebugSession(session: vscode.DebugSession | undefined) {
        this.debugSession = session;
        this.refresh();
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BSTNodeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: BSTNodeItem): Promise<BSTNodeItem[]> {
        if (!this.debugSession) {
            return [];
        }

        if (!element) {
            // Root level - look for BST root variables
            const rootNodes = await this.findBSTRootNodes();
            return rootNodes;
        }

        // Get children of a specific node
        return this.getNodeChildren(element);
    }

    private async findBSTRootNodes(): Promise<BSTNodeItem[]> {
        if (!this.debugSession) {
            return [];
        }

        try {
            // Get current stack frame variables
            const stackTrace = await this.debugSession.customRequest('stackTrace', { threadId: 1 });
            if (!stackTrace || !stackTrace.stackFrames || stackTrace.stackFrames.length === 0) {
                return [];
            }

            const frameId = stackTrace.stackFrames[0].id;
            const scopes = await this.debugSession.customRequest('scopes', { frameId });
            
            const rootNodes: BSTNodeItem[] = [];

            for (const scope of scopes.scopes) {
                const variables = await this.debugSession.customRequest('variables', { 
                    variablesReference: scope.variablesReference 
                });

                for (const variable of variables.variables) {
                    // Look for pointer variables that might be BST roots
                    if (this.isPotentialBSTRoot(variable)) {
                        const nodeItem = new BSTNodeItem(
                            variable.name,
                            variable.value,
                            vscode.TreeItemCollapsibleState.Collapsed,
                            variable.variablesReference
                        );
                        rootNodes.push(nodeItem);
                    }
                }
            }

            return rootNodes;
        } catch (error) {
            console.error('Error finding BST root nodes:', error);
            return [];
        }
    }

    private isPotentialBSTRoot(variable: any): boolean {
        // Check if variable looks like a BST node pointer
        const name = variable.name.toLowerCase();
        const type = variable.type?.toLowerCase() || '';
        
        return (
            variable.variablesReference > 0 && (
                name.includes('root') ||
                name.includes('tree') ||
                name.includes('node') ||
                type.includes('node') ||
                type.includes('tree')
            )
        );
    }

    private async getNodeChildren(element: BSTNodeItem): Promise<BSTNodeItem[]> {
        if (!this.debugSession || !element.variablesReference) {
            return [];
        }

        try {
            const variables = await this.debugSession.customRequest('variables', {
                variablesReference: element.variablesReference
            });

            const children: BSTNodeItem[] = [];

            for (const variable of variables.variables) {
                const name = variable.name.toLowerCase();
                
                // Look for left and right child pointers, and data/value fields
                if (name === 'left' || name === 'right' || name === 'data' || name === 'value') {
                    if (variable.variablesReference > 0) {
                        // This is a pointer to another node
                        const childItem = new BSTNodeItem(
                            `${name}: ${variable.value}`,
                            variable.value,
                            vscode.TreeItemCollapsibleState.Collapsed,
                            variable.variablesReference
                        );
                        children.push(childItem);
                    } else {
                        // This is a data value
                        const childItem = new BSTNodeItem(
                            `${name}: ${variable.value}`,
                            variable.value,
                            vscode.TreeItemCollapsibleState.None
                        );
                        children.push(childItem);
                    }
                }
            }

            return children;
        } catch (error) {
            console.error('Error getting node children:', error);
            return [];
        }
    }
}

export class BSTNodeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly value: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly variablesReference?: number,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        this.tooltip = `${this.label}: ${this.value}`;
        this.description = this.value;
        
        // Set icons based on node type
        if (label.toLowerCase().includes('root')) {
            this.iconPath = new vscode.ThemeIcon('symbol-class');
        } else if (label.toLowerCase().includes('left')) {
            this.iconPath = new vscode.ThemeIcon('arrow-left');
        } else if (label.toLowerCase().includes('right')) {
            this.iconPath = new vscode.ThemeIcon('arrow-right');
        } else if (label.toLowerCase().includes('data') || label.toLowerCase().includes('value')) {
            this.iconPath = new vscode.ThemeIcon('symbol-numeric');
        } else {
            this.iconPath = new vscode.ThemeIcon('symbol-property');
        }

        this.contextValue = 'bstNode';
    }
}