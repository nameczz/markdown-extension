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
const fs = require("fs");
require("./style.scss");
require("./layout.scss");
require("./menu.scss");

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

  // json menu preview
  context.subscriptions.push(
    vscode.commands.registerCommand("menu.preview", () => {
      const file = vscode.window.activeTextEditor.document.fileName;
      const root = vscode.workspace.rootPath;
      process.env.PATH_ROOT = root;
      // console.log(file, vscode.workspace.rootPath);
      // Create and show a new webview
      const panel = vscode.window.createWebviewPanel(
        "json", // Identifies the type of the webview. Used internally
        "Menu Preview", // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show in different panel
        {} // Webview options. More on these later.
      );

      file && jsonMenuToHtml(panel, file, lightTheme);
      // when text editor change
      vscode.window.onDidChangeActiveTextEditor((e) => {
        console.log("open");
        console.log(e);
        if (e._documentData._languageId !== "json") {
          return;
        }
        jsonMenuToHtml(panel, e._documentData._document.fileName, lightTheme);
      });
      vscode.workspace // when saved text document
        .onDidSaveTextDocument((e) => {
          console.log("saved");
          console.log(e);

          jsonMenuToHtml(panel, e.fileName, lightTheme);
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

function jsonMenuToHtml(panel, absPath, theme) {
  const content = fs.readFileSync(absPath);
  const list = JSON.parse(content);
  const arr = generateMenu(list.menuList)();
  sortMenu(arr);

  console.log(arr);
  panel.webview.html = `<link rel="stylesheet" type="text/css" href="${theme}"></link> <div class="menu-container">
    ${generageMenuDom(arr)}
  </div>`;
  panel.title = getName(absPath);
}

const generateMenu = (list) => {
  // get all labels , make sure will generate menu from top to bottom
  const labelKeys = Object.keys(list[0])
    .filter((v) => v.includes("label"))
    .sort((a, b) => a[a.length - 1] - b[b.length - 1]);
  let index = 0;
  return function innerFn(formatMenu = []) {
    let copyMenu = JSON.parse(JSON.stringify(formatMenu));
    const parentLabel = index ? labelKeys[index - 1] : "";

    if (index && !parentLabel) {
      return copyMenu;
    }
    const generatePath = (doc) => {
      if (doc.id.includes("benchmarks")) {
        return `/docs/${doc.id}`;
      }

      const { label1, label2, label3 } = doc || {};

      let parentPath = "";
      if (label1) {
        parentPath += `${label1}/`;
      }
      if (label2) {
        parentPath += `${label2}/`;
      }
      if (label3) {
        parentPath += `${label3}/`;
      }
      return `/docs/yourversion/${parentPath}${doc.id}`;
    };
    // find top menu by current label
    const topMenu = list.filter((v) => {
      if (!labelKeys[index] || !v[labelKeys[index]]) {
        return index > 0 ? (v[parentLabel] ? true : false) : true;
      }
      return false;
    });

    topMenu.forEach((v) => {
      const item = {
        ...v,
        children: [],
        showChildren: false,
        isActive: false,
        isLast: !labelKeys[index + 1],
        path: generatePath(v),
      };
      if (index === 0) {
        copyMenu.push(item);
      } else {
        const parent = findItem("id", v[parentLabel], copyMenu);
        parent && parent.children.push(item);
      }
    });

    index++;
    return innerFn(copyMenu);
  };
};

const sortMenu = (list) => {
  list.sort((a, b) => {
    return a.order - b.order;
  });
  list.forEach((v) => {
    if (v.children && v.children.length) {
      sortMenu(v.children);
    }
  });
};

const findItem = (key, value, arr) => {
  let find = undefined;
  arr.forEach((v) => {
    if (find) return;
    if (v[key] === value) {
      find = v;
    } else if (v.children && v.children.length) {
      find = findItem(key, value, v.children);
    }
  });
  return find;
};

const generageMenuDom = (list, className = "") => {
  return list.map(
    (doc) => `
  <div class='${className}'>
    <div class="menu_name-wrapper">
      <span class="text">
        ${doc.title} - ${doc.path}
      </span>
    </div>
    <div class="menu-child-wrapper open">
      ${
        doc.children && doc.children.length
          ? generageMenuDom(doc.children, "menu-child")
          : ""
      }
    </div>
  </div>
`
  );
};
module.exports = {
  activate,
  deactivate,
};
