import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('json-formatter.openFormatter', () => {
    const panel = vscode.window.createWebviewPanel(
      'jsonFormatter',
      'JSON Formatter',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    const htmlPath = path.join(context.extensionPath, 'media', 'formatter.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    panel.webview.html = htmlContent;
  });

  context.subscriptions.push(disposable);

  // Auto open on activation
  vscode.commands.executeCommand('json-formatter.openFormatter');
}

export function deactivate() {}
