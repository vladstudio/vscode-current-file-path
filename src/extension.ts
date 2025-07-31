import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'currentFilePath.copyPath';
    context.subscriptions.push(statusBarItem);

    const copyCommand = vscode.commands.registerCommand('currentFilePath.copyPath', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            vscode.env.clipboard.writeText(filePath);
            vscode.window.showInformationMessage('File path copied to clipboard');
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
        const filePath = activeEditor.document.uri.fsPath;
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