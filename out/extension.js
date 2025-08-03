"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
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
        const panel = vscode.window.createWebviewPanel('jsonFormatter', 'JSON Formatter', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        try {
            const htmlPath = path.join(context.extensionPath, 'media', 'formatter.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            panel.webview.html = htmlContent;
        }
        catch (error) {
            vscode.window.showErrorMessage('Could not load formatter.html: ' + error);
        }
    });
    // Register comparison command
    const comparisonCommand = vscode.commands.registerCommand('jsontools.openComparison', () => {
        console.log('Opening JSON Comparison...');
        const panel = vscode.window.createWebviewPanel('jsonComparison', 'JSON Comparison Tool', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        try {
            const htmlPath = path.join(context.extensionPath, 'media', 'comparison.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            panel.webview.html = htmlContent;
        }
        catch (error) {
            vscode.window.showErrorMessage('Could not load comparison.html: ' + error);
        }
    });
    // Add to subscriptions
    context.subscriptions.push(treeView, formatterCommand, comparisonCommand);
    console.log('JSON Tools extension activated successfully!');
}
function deactivate() { }
class JsonToolsTreeProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor() {
        console.log('JsonToolsTreeProvider created');
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        console.log('getTreeItem called for:', element.label);
        return element;
    }
    getChildren(element) {
        console.log('getChildren called, element:', element ? element.label : 'ROOT');
        if (!element) {
            // Return the root items - our two tools
            const tools = [
                new ToolItem('Open JSON Formatter', '📐 Format and beautify JSON data', vscode.TreeItemCollapsibleState.None, 'jsontools.openFormatter', 'bracket'),
                new ToolItem('Compare JSON', '🔄 Compare two JSON files side by side', vscode.TreeItemCollapsibleState.None, 'jsontools.openComparison', 'diff')
            ];
            console.log('Returning tools:', tools.map(t => t.label));
            return Promise.resolve(tools);
        }
        // No children for leaf items
        return Promise.resolve([]);
    }
}
class ToolItem extends vscode.TreeItem {
    label;
    tooltip;
    collapsibleState;
    commandId;
    iconName;
    constructor(label, tooltip, collapsibleState, commandId, iconName) {
        super(label, collapsibleState);
        this.label = label;
        this.tooltip = tooltip;
        this.collapsibleState = collapsibleState;
        this.commandId = commandId;
        this.iconName = iconName;
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
//# sourceMappingURL=extension.js.map