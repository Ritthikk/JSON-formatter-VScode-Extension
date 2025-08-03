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
    // Register the tree data provider for the sidebar
    const jsonToolsProvider = new JsonToolsProvider();
    vscode.window.registerTreeDataProvider('json-formatter-view', jsonToolsProvider);
    // Register the command to open formatter
    const disposable = vscode.commands.registerCommand('json-formatter.openFormatter', () => {
        const panel = vscode.window.createWebviewPanel('jsonFormatter', 'JSON Formatter', vscode.ViewColumn.One, {
            enableScripts: true
        });
        const htmlPath = path.join(context.extensionPath, 'media', 'formatter.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        panel.webview.html = htmlContent;
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
/**
 * Tree Data Provider for the JSON Tools sidebar
 */
class JsonToolsProvider {
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // Return root items - only the formatter button now
            return Promise.resolve([
                new JsonToolItem('Open JSON Formatter', 'Click to open the JSON formatter UI', vscode.TreeItemCollapsibleState.None, {
                    command: 'json-formatter.openFormatter',
                    title: 'Open JSON Formatter'
                })
            ]);
        }
        return Promise.resolve([]);
    }
}
/**
 * Tree Item class for individual items in the sidebar
 */
class JsonToolItem extends vscode.TreeItem {
    label;
    tooltip;
    collapsibleState;
    command;
    constructor(label, tooltip, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.tooltip = tooltip;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.tooltip = tooltip;
        this.command = command;
        // Use bracket icon for the formatter button
        this.iconPath = new vscode.ThemeIcon('bracket');
    }
}
//# sourceMappingURL=extension.js.map