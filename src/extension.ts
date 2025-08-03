import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('Activating JSON Tools extension...');

  // Create and register the tree data provider
  const treeDataProvider = new JsonToolsTreeProvider();
  const treeView = vscode.window.createTreeView('json-tools-list', {
    treeDataProvider: treeDataProvider,
    showCollapseAll: false
  });

  // Register formatter command
  const formatterCommand = vscode.commands.registerCommand('jsontools.openFormatter', () => {
    console.log('Opening JSON Formatter...');
    const panel = vscode.window.createWebviewPanel(
      'jsonFormatter',
      'JSON Formatter',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    try {
      const htmlPath = path.join(context.extensionPath, 'media', 'formatter.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      panel.webview.html = htmlContent;
    } catch (error) {
      vscode.window.showErrorMessage('Could not load formatter.html: ' + error);
    }
  });

  // Register comparison command
  const comparisonCommand = vscode.commands.registerCommand('jsontools.openComparison', () => {
    console.log('Opening JSON Comparison...');
    const panel = vscode.window.createWebviewPanel(
      'jsonComparison',
      'JSON Comparison Tool',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    try {
      const htmlPath = path.join(context.extensionPath, 'media', 'comparison.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      panel.webview.html = htmlContent;
    } catch (error) {
      vscode.window.showErrorMessage('Could not load comparison.html: ' + error);
    }
  });

  // Add to subscriptions
  context.subscriptions.push(
    treeView,
    formatterCommand,
    comparisonCommand
  );

  console.log('JSON Tools extension activated successfully!');
}

export function deactivate() {}

class JsonToolsTreeProvider implements vscode.TreeDataProvider<ToolItem> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<ToolItem | undefined | null | void> = new vscode.EventEmitter<ToolItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<ToolItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor() {
    console.log('JsonToolsTreeProvider created');
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ToolItem): vscode.TreeItem {
    console.log('getTreeItem called for:', element.label);
    return element;
  }

  getChildren(element?: ToolItem): Thenable<ToolItem[]> {
    console.log('getChildren called, element:', element ? element.label : 'ROOT');
    
    if (!element) {
      // Return the root items - our two tools
      const tools = [
        new ToolItem(
          'Open JSON Formatter',
          '📐 Format and beautify JSON data',
          vscode.TreeItemCollapsibleState.None,
          'jsontools.openFormatter',
          'bracket'
        ),
        new ToolItem(
          'Compare JSON',
          '🔄 Compare two JSON files side by side',
          vscode.TreeItemCollapsibleState.None,
          'jsontools.openComparison',
          'diff'
        )
      ];
      
      console.log('Returning tools:', tools.map(t => t.label));
      return Promise.resolve(tools);
    }
    
    // No children for leaf items
    return Promise.resolve([]);
  }
}

class ToolItem extends vscode.TreeItem {
  
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly commandId: string,
    public readonly iconName: string
  ) {
    super(label, collapsibleState);
    
    this.tooltip = tooltip;
    this.description = '';
    
    // Set the command that gets executed when clicked
    this.command = {
      command: commandId,
      title: label,
      arguments: []
    };
    
    // Set the icon
    this.iconPath = new vscode.ThemeIcon(iconName);
    
    console.log(`Created ToolItem: ${label} with command: ${commandId}`);
  }
}