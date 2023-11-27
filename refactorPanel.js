const vscode = require('vscode');
// import vscode from 'vscode';
const {replaceTextAtLine } = require( './helper.js');


class RefactorPanelViewProvider {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
    this.webviewView = undefined;
  }

  resolveWebviewView(webviewView, context, token) {
    this.webviewView = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    

    // HTML for the webview with accept and reject buttons
    
    webviewView.webview.html = this.getInitialHtmlForWebview();
    // webviewView.webview.html
    

    // Handle messages from the webview
    // Can make changes of editor here itself. 
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'accept':
          this.acceptChange(message);
          break;
        case 'reject':
          this.rejectChange(message);
          break;
      }

      webviewView.webview.html = this.getInitialHtmlForWebview();
    }, undefined, context.subscriptions);
  }

  getInitialHtmlForWebview() {
    // HTML content with a container to display the selected text
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Side Panel</title>
      </head>
      <body>
      <h1>Side Panel</h1>
        <div id="selected-text-container">Refactoring will be shown here</div>
      </body>
      </html>
    `;
  }


  acceptChange(message) {

    const editor = vscode.window.activeTextEditor;
    console.log(message);
    const orig = message.text1;
    const refact = message.text2;
    const lineNo = parseInt(message.lineNo);
    console.log("Refactor Panel", orig, refact, lineNo)
    
    replaceTextAtLine(editor, lineNo, orig, refact);
    console.log('Accepted with text1:', message.text1, 'and text2:', message.text2);
    


    vscode.window.showInformationMessage( 'accept' );
  }

  rejectChange(message) {
    console.log('Accepted with text1:', message.text1, 'and text2:', message.text2);
    vscode.window.showInformationMessage( 'aslfkjd' );
    
  }

  updateSelectedText(lineNo, text1, text2) {
    vscode.commands.executeCommand('extension.openSidebar');
    if (this.webviewView) {
      this.webviewView.webview.html = this.getHtmlForWebview(this.webviewView.webview, lineNo, text1, text2);
    }
    // wait for accept or reject response from the user 
    // if accept then call the acceptChange() function
    // if reject then call the rejectChange() function
    // return the response 




  }

  getHtmlForWebview(webview,lineNo, text1, text2) {
    // Return the HTML content including the selected text
   
    const encodedText1 = JSON.stringify(text1);
    const encodedText2 = JSON.stringify(text2);
    const nonce = getNonce();
    lineNo = parseInt(lineNo);
   
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Side Panel</title>
    </head>
    <body>
      <div>
      <label for="Orig Code">Orig Code at ${lineNo +1}</label>
      <textarea id="input1" rows="4" cols="50">${text1}</textarea>

      </div>
      <div>
        <label for="Refactored Code">Refactored Code:</label>
        <textarea  id="input2" rows="4" cols="50">${text2}</textarea>
      </div>
      <button onclick="handleAccept()">Accept</button>
      <button onclick="handleReject()">Reject</button>

      <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();

        function handleAccept() {
          // const text1 = document.getElementById('input1').value;
          const text1 = ${encodedText1};
          const text2 = document.getElementById('input2').value;
          const lineNo = ${lineNo};
          vscode.postMessage({ command: 'accept', lineNo,text1, text2 });
        }

        function handleReject() {
          vscode.postMessage({ command: 'reject' });
        }
      </script>
    </body>
    </html>
  `;
  }
  
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = {RefactorPanelViewProvider};