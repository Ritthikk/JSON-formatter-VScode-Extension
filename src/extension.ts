import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Register the tree data provider for the sidebar
  const jsonToolsProvider = new JsonToolsProvider();
  vscode.window.registerTreeDataProvider('json-formatter-view', jsonToolsProvider);

  // Register the command to open formatter
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
}

export function deactivate() {}

/**
 * Tree Data Provider for the JSON Tools sidebar
 */
class JsonToolsProvider implements vscode.TreeDataProvider<JsonToolItem> {
  
  getTreeItem(element: JsonToolItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: JsonToolItem): Thenable<JsonToolItem[]> {
    if (!element) {
      // Return root items - only the formatter button now
      return Promise.resolve([
        new JsonToolItem(
          'Open JSON Formatter',
          'Click to open the JSON formatter UI',
          vscode.TreeItemCollapsibleState.None,
          {
            command: 'json-formatter.openFormatter',
            title: 'Open JSON Formatter'
          }
        )
      ]);
    }
    return Promise.resolve([]);
  }
}

/**
 * Tree Item class for individual items in the sidebar
 */
class JsonToolItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = tooltip;
    this.command = command;
    
    // Use bracket icon for the formatter button
    this.iconPath = new vscode.ThemeIcon('bracket');
  }
}
