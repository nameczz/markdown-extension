// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
process.env.name_dir_from = "site";
const vscode = require("vscode");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
  html: true,
});
const md2md = require("md2md");
const path = require("path");
require("./style.scss");
require("./layout.scss");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

console.log("Vscode Markdown Preview With fragments and variables");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const lightTheme = vscode.Uri.file(
    path.join(context.extensionPath, "./dist/main.css")
  ).with({ scheme: "vscode-resource" });

  const darkTheme = vscode.Uri.file(
    path.join(context.extensionPath, "./cobalt.css")
  ).with({ scheme: "vscode-resource" });
  // const link = (
  //   <link rel="stylesheet" type="text/css" href="{{styleSrc}}"></link>
  // );
  // console.log(styleSrc);
  context.subscriptions.push(
    vscode.commands.registerCommand("markdownPreview.start", () => {
      const file = vscode.window.activeTextEditor.document.fileName;
      const root = vscode.workspace.rootPath;
      process.env.PATH_ROOT = root;
      console.log(file, vscode.workspace.rootPath);
      // Create and show a new webview
      const panel = vscode.window.createWebviewPanel(
        "markdown", // Identifies the type of the webview. Used internally
        "Markdown Preview", // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show in different panel
        {} // Webview options. More on these later.
      );

      file && setHtml(panel, file, darkTheme);
      // when text editor change
      vscode.window.onDidChangeActiveTextEditor((e) => {
        console.log("open");
        console.log(e);
        if (e._documentData._languageId !== "markdown") {
          return;
        }
        setHtml(panel, e._documentData._document.fileName, darkTheme);
      });

      vscode.workspace // when saved text document
        .onDidSaveTextDocument((e) => {
          console.log("saved");
          console.log(e);

          setHtml(panel, e.fileName, darkTheme);
        });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("markdownPreview.light", () => {
      const file = vscode.window.activeTextEditor.document.fileName;
      const root = vscode.workspace.rootPath;
      process.env.PATH_ROOT = root;
      // console.log(file, vscode.workspace.rootPath);
      // Create and show a new webview
      const panel = vscode.window.createWebviewPanel(
        "markdown", // Identifies the type of the webview. Used internally
        "Markdown Light", // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show in different panel
        {} // Webview options. More on these later.
      );

      file && setHtml(panel, file, lightTheme);
      // when text editor change
      vscode.window.onDidChangeActiveTextEditor((e) => {
        console.log("open");
        console.log(e);
        if (e._documentData._languageId !== "markdown") {
          return;
        }
        setHtml(panel, e._documentData._document.fileName, lightTheme);
      });
      vscode.workspace // when saved text document
        .onDidSaveTextDocument((e) => {
          console.log("saved");
          console.log(e);

          setHtml(panel, e.fileName, lightTheme);
        });
    })
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function getName(absPath) {
  const arr = absPath.split(path.sep);
  return `Preview ${arr[arr.length - 1]}`;
}

function getContent(absPath) {
  try {
    // console.log(md2md.markdownToString(absPath));
    return md2md.markdownToString(absPath);
  } catch (error) {
    vscode.window.showErrorMessage("md2md error");
    return "md2md error";
  }
}

function setHtml(panel, absPath, theme) {
  const content = `<link rel="stylesheet" type="text/css" href="${theme}"></link> 
  <div class="doc-post-container">
  ${md.render(getContent(absPath))}
  </div>
  `;

  // console.log(content);
  panel.webview.html = content;
  panel.title = getName(absPath);
}
module.exports = {
  activate,
  deactivate,
};
