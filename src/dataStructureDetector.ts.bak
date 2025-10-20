import * as vscode from 'vscode';

export interface DataStructureInfo {
    type: DataStructureType;
    name: string;
    size?: number;
    elements?: any[];
    properties?: Map<string, any>;
    variablesReference?: number;
}

export enum DataStructureType {
    Array = 'array',
    List = 'list',
    Stack = 'stack', 
    Queue = 'queue',
    Tree = 'tree',
    BST = 'bst',
    Graph = 'graph',
    HashMap = 'hashmap',
    Set = 'set',
    Vector = 'vector',
    Deque = 'deque',
    Unknown = 'unknown'
}

export class DataStructureDetector {
    private debugSession: vscode.DebugSession | undefined;

    constructor(debugSession?: vscode.DebugSession) {
        this.debugSession = debugSession;
    }

    setDebugSession(session: vscode.DebugSession | undefined) {
        this.debugSession = session;
    }

    async detectDataStructures(): Promise<DataStructureInfo[]> {
        if (!this.debugSession) {
            return [];
        }

        try {
            const variables = await this.getCurrentVariables();
            const dataStructures: DataStructureInfo[] = [];

            for (const variable of variables) {
                const dsInfo = this.analyzeVariable(variable);
                if (dsInfo.type !== DataStructureType.Unknown) {
                    dataStructures.push(dsInfo);
                }
            }

            return dataStructures;
        } catch (error) {
            console.error('Error detecting data structures:', error);
            return [];
        }
    }

    private async getCurrentVariables(): Promise<any[]> {
        if (!this.debugSession) return [];

        try {
            const stackTrace = await this.debugSession.customRequest('stackTrace', { threadId: 1 });
            if (!stackTrace?.stackFrames?.length) return [];

            const frameId = stackTrace.stackFrames[0].id;
            const scopes = await this.debugSession.customRequest('scopes', { frameId });
            
            const allVariables: any[] = [];
            for (const scope of scopes.scopes) {
                const variables = await this.debugSession.customRequest('variables', { 
                    variablesReference: scope.variablesReference 
                });
                allVariables.push(...variables.variables);
            }

            return allVariables;
        } catch (error) {
            console.error('Error getting variables:', error);
            return [];
        }
    }

    private analyzeVariable(variable: any): DataStructureInfo {
        const name = variable.name;
        const type = variable.type?.toLowerCase() || '';
        const value = variable.value || '';

        // Detect by type patterns
        if (this.isArrayType(type, value)) {
            return this.createDataStructureInfo(DataStructureType.Array, name, variable);
        }
        
        if (this.isVectorType(type, value)) {
            return this.createDataStructureInfo(DataStructureType.Vector, name, variable);
        }

        if (this.isListType(type, value)) {
            return this.createDataStructureInfo(DataStructureType.List, name, variable);
        }

        if (this.isStackType(type, value)) {
            return this.createDataStructureInfo(DataStructureType.Stack, name, variable);
        }

        if (this.isQueueType(type, value)) {
            return this.createDataStructureInfo(DataStructureType.Queue, name, variable);
        }

        if (this.isTreeType(type, value, name)) {
            return this.createDataStructureInfo(DataStructureType.Tree, name, variable);
        }

        if (this.isBSTType(type, value, name)) {
            return this.createDataStructureInfo(DataStructureType.BST, name, variable);
        }

        if (this.isGraphType(type, value, name)) {
            return this.createDataStructureInfo(DataStructureType.Graph, name, variable);
        }

        if (this.isHashMapType(type, value)) {
            return this.createDataStructureInfo(DataStructureType.HashMap, name, variable);
        }

        if (this.isSetType(type, value)) {
            return this.createDataStructureInfo(DataStructureType.Set, name, variable);
        }

        return this.createDataStructureInfo(DataStructureType.Unknown, name, variable);
    }

    private createDataStructureInfo(type: DataStructureType, name: string, variable: any): DataStructureInfo {
        return {
            type,
            name,
            size: this.extractSize(variable.value),
            variablesReference: variable.variablesReference,
            properties: new Map()
        };
    }

    // Type detection methods for different data structures
    private isArrayType(type: string, value: string): boolean {
        return type.includes('[]') || 
               type.includes('array') || 
               (type.includes('*') && value.includes('[')) ||
               /\[\d+\]/.test(value);
    }

    private isVectorType(type: string, value: string): boolean {
        return type.includes('vector') || 
               type.includes('std::vector') ||
               value.includes('vector');
    }

    private isListType(type: string, value: string): boolean {
        return type.includes('list') || 
               type.includes('std::list') ||
               type.includes('linked') ||
               value.includes('list');
    }

    private isStackType(type: string, value: string): boolean {
        return type.includes('stack') || 
               type.includes('std::stack') ||
               value.includes('stack');
    }

    private isQueueType(type: string, value: string): boolean {
        return type.includes('queue') || 
               type.includes('std::queue') ||
               type.includes('deque') ||
               value.includes('queue');
    }

    private isTreeType(type: string, value: string, name: string): boolean {
        const namePattern = /tree|root|node/i;
        const typePattern = /tree|node/i;
        
        return typePattern.test(type) || 
               namePattern.test(name) ||
               (type.includes('*') && namePattern.test(name));
    }

    private isBSTType(type: string, value: string, name: string): boolean {
        const bstPattern = /bst|binary.*search|search.*tree/i;
        
        return bstPattern.test(type) || 
               bstPattern.test(name) ||
               (this.isTreeType(type, value, name) && name.toLowerCase().includes('bst'));
    }

    private isGraphType(type: string, value: string, name: string): boolean {
        const graphPattern = /graph|adjacency|vertex|edge/i;
        
        return graphPattern.test(type) || 
               graphPattern.test(name) ||
               value.includes('adjacency');
    }

    private isHashMapType(type: string, value: string): boolean {
        return type.includes('map') || 
               type.includes('hash') ||
               type.includes('unordered_map') ||
               type.includes('std::map') ||
               value.includes('map');
    }

    private isSetType(type: string, value: string): boolean {
        return type.includes('set') || 
               type.includes('std::set') ||
               type.includes('unordered_set') ||
               value.includes('set');
    }

    private extractSize(value: string): number | undefined {
        // Try to extract size from value string
        const sizeMatch = value.match(/size[=:]?\s*(\d+)/i) || 
                         value.match(/length[=:]?\s*(\d+)/i) ||
                         value.match(/count[=:]?\s*(\d+)/i);
        
        return sizeMatch ? parseInt(sizeMatch[1], 10) : undefined;
    }

    // Language-specific detection methods
    detectLanguageSpecificStructures(language: string, variable: any): DataStructureInfo | null {
        switch (language) {
            case 'cpp':
            case 'c':
                return this.detectCppStructures(variable);
            case 'java':
                return this.detectJavaStructures(variable);
            case 'python':
                return this.detectPythonStructures(variable);
            case 'javascript':
            case 'typescript':
                return this.detectJavaScriptStructures(variable);
            default:
                return null;
        }
    }

    private detectCppStructures(variable: any): DataStructureInfo | null {
        const type = variable.type?.toLowerCase() || '';
        
        // C++ STL containers
        if (type.includes('std::')) {
            if (type.includes('vector')) return this.createDataStructureInfo(DataStructureType.Vector, variable.name, variable);
            if (type.includes('list')) return this.createDataStructureInfo(DataStructureType.List, variable.name, variable);
            if (type.includes('stack')) return this.createDataStructureInfo(DataStructureType.Stack, variable.name, variable);
            if (type.includes('queue')) return this.createDataStructureInfo(DataStructureType.Queue, variable.name, variable);
            if (type.includes('deque')) return this.createDataStructureInfo(DataStructureType.Deque, variable.name, variable);
            if (type.includes('map')) return this.createDataStructureInfo(DataStructureType.HashMap, variable.name, variable);
            if (type.includes('set')) return this.createDataStructureInfo(DataStructureType.Set, variable.name, variable);
        }

        return null;
    }

    private detectJavaStructures(variable: any): DataStructureInfo | null {
        const type = variable.type?.toLowerCase() || '';
        
        // Java collections
        if (type.includes('arraylist')) return this.createDataStructureInfo(DataStructureType.List, variable.name, variable);
        if (type.includes('linkedlist')) return this.createDataStructureInfo(DataStructureType.List, variable.name, variable);
        if (type.includes('stack')) return this.createDataStructureInfo(DataStructureType.Stack, variable.name, variable);
        if (type.includes('queue')) return this.createDataStructureInfo(DataStructureType.Queue, variable.name, variable);
        if (type.includes('hashmap')) return this.createDataStructureInfo(DataStructureType.HashMap, variable.name, variable);
        if (type.includes('hashset')) return this.createDataStructureInfo(DataStructureType.Set, variable.name, variable);
        if (type.includes('treemap')) return this.createDataStructureInfo(DataStructureType.Tree, variable.name, variable);

        return null;
    }

    private detectPythonStructures(variable: any): DataStructureInfo | null {
        const type = variable.type?.toLowerCase() || '';
        const value = variable.value || '';
        
        // Python built-in types
        if (type === 'list' || value.startsWith('[')) return this.createDataStructureInfo(DataStructureType.List, variable.name, variable);
        if (type === 'dict' || value.startsWith('{') && value.includes(':')) return this.createDataStructureInfo(DataStructureType.HashMap, variable.name, variable);
        if (type === 'set' || (value.startsWith('{') && !value.includes(':'))) return this.createDataStructureInfo(DataStructureType.Set, variable.name, variable);
        if (type === 'tuple' || value.startsWith('(')) return this.createDataStructureInfo(DataStructureType.Array, variable.name, variable);

        return null;
    }

    private detectJavaScriptStructures(variable: any): DataStructureInfo | null {
        const type = variable.type?.toLowerCase() || '';
        const value = variable.value || '';
        
        // JavaScript types
        if (type === 'array' || value.startsWith('[')) return this.createDataStructureInfo(DataStructureType.Array, variable.name, variable);
        if (type === 'object' || value.startsWith('{')) return this.createDataStructureInfo(DataStructureType.HashMap, variable.name, variable);
        if (type === 'map') return this.createDataStructureInfo(DataStructureType.HashMap, variable.name, variable);
        if (type === 'set') return this.createDataStructureInfo(DataStructureType.Set, variable.name, variable);

        return null;
    }
}