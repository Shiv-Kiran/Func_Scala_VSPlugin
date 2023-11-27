// create a side panel which takes input and replies with some message in the side bar 

// import vscode 
const vscode = require('vscode');

const panel = vscode.window.createWebviewPanel(
  'catCoding',
  'Cat Coding',
  vscode.ViewColumn.One,
  {}
);

// And set its HTML content
panel.webview.html = getWebviewContent();

// Create HTML content with text box and button with rely box 

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>
            Cat Coding
        </title>
    </head>
    <body>
        <input type="text" id="input" value="Enter your code here" />
        <button id="button">Send</button>
        <div id="reply"></div>
        <script>
            const vscode = acquireVsCodeApi();
            const input = document.getElementById('input');
            const button = document.getElementById('button');
            const reply = document.getElementById('reply');
            button.onclick = () => {
                const message = input.value;
                vscode.postMessage(message);
            };
            window.addEventListener('message', event => {
                const message = event.data;
                reply.innerHTML = message;
            });
        </script>
    </body>
    </html>`;
}
