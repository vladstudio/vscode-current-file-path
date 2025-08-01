import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'currentFilePath.copyPath';
    context.subscriptions.push(statusBarItem);

    const copyCommand = vscode.commands.registerCommand('currentFilePath.copyPath', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
            const filePath = workspaceFolder 
                ? vscode.workspace.asRelativePath(activeEditor.document.uri, false)
                : activeEditor.document.uri.fsPath;
            vscode.env.clipboard.writeText(filePath);
            statusBarItem.text = '$(check) Copied to clipboard';
            statusBarItem.tooltip = 'File path copied to clipboard';
            setTimeout(() => {
                updateStatusBar();
            }, 3000);
        }
    });
    context.subscriptions.push(copyCommand);

    updateStatusBar();

    vscode.window.onDidChangeActiveTextEditor(() => {
        updateStatusBar();
    });
}

function updateStatusBar() {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor && activeEditor.document.uri.scheme === 'file') {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
        const filePath = workspaceFolder 
            ? vscode.workspace.asRelativePath(activeEditor.document.uri, false)
            : activeEditor.document.uri.fsPath;
        
        statusBarItem.text = `$(file) ${filePath}`;
        statusBarItem.tooltip = `Click to copy: ${filePath}`;
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}