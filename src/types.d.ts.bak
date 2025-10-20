// Type declarations for VS Code extension development

declare module 'vscode' {
    export * from 'vscode';
}

// Global Node.js types
declare var console: Console;
declare var Buffer: BufferConstructor;

interface Console {
    log(...data: any[]): void;
    error(...data: any[]): void;
    warn(...data: any[]): void;
    info(...data: any[]): void;
}

interface BufferConstructor {
    from(array: any[]): Buffer;
    from(arrayBuffer: ArrayBuffer): Buffer;
    from(buffer: Buffer): Buffer;
    from(string: string, encoding?: string): Buffer;
}

interface Buffer {
    toString(encoding?: string): string;
}