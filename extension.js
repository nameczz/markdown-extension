// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
const md2md = require("md2md")
// console.log(md2md, md2md.toString())
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

console.log("Vscode Extension");
/**   
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("markdownPreview.start", () => {
      const file = vscode.window.activeTextEditor.document.fileName;
      const root = vscode.workspace.rootPath
      console.log(file, vscode.workspace.rootPath);
      // Create and show a new webview
      const panel = vscode.window.createWebviewPanel(
        "markdown", // Identifies the type of the webview. Used internally
        "Markdown Preview", // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show in different panel
        {} // Webview options. More on these later.
      );

      file && setHtml(panel, file, root);
      // when text editor change
      vscode.window.onDidChangeActiveTextEditor((e) => {
        console.log("open");
        console.log(e);

        setHtml(panel, e._documentData._document.fileName, root);
      });
      // when saved text document
      vscode.workspace.onDidChangeTextDocument((e) => {
        console.log("changed");
        console.log(e);

        setHtml(panel, e.document.fileName, root);
      });
    })
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

function getName(absPath) {
  const arr = absPath.split("/");
  return `Preview ${arr[arr.length - 1]}`;
}

function getContent(absPath, root) {
  const text = md2md.markdownToString(absPath, root).split("---");
  return `${text[text.length - 1]}`;
}

function setHtml(panel, absPath, root) {
  panel.webview.html = md.render(getContent(absPath, root));
  panel.title = getName(absPath);
}
module.exports = {
  activate,
  deactivate,
};
