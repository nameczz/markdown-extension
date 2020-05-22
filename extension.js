// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const MarkdownIt = require("markdown-it");
const fs = require("fs");
const md = new MarkdownIt();
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

// console.log("Vscode Extension");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("markdownPreview.start", () => {
      const file = vscode.window.activeTextEditor.document.fileName;
      console.log(file);
      // Create and show a new webview
      const panel = vscode.window.createWebviewPanel(
        "markdown", // Identifies the type of the webview. Used internally
        "Markdown Preview", // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show in different panel
        {} // Webview options. More on these later.
      );
      console.log("in");
      file && setHtml(panel, file);
      // when text editor change
      vscode.window.onDidChangeActiveTextEditor((e) => {
        console.log("open");

        console.log(e);
        setHtml(panel, e._documentData._document.fileName);
      });
      // when saved text document
      vscode.workspace.onDidChangeTextDocument((e) => {
        console.log("changed");
        console.log(e);

        setHtml(panel, e.document.fileName);
      });
    })
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function getName(absPath) {
  const arr = absPath.split("/");
  return arr[arr.length - 1];
}

function getContent(absPath) {
  const text = fs.readFileSync(absPath).toString().split("---");
  return `${text[text.length - 1]}`;
}

function setHtml(panel, absPath) {
  panel.webview.html = md.render(getContent(absPath));
  panel.title = getName(absPath);
}
module.exports = {
  activate,
  deactivate,
};
