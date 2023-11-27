const vscode = require('vscode');
const {callScalaSnippet} = require('./scalaSnippet.js');


function ChatProvider () {
    const panel = vscode.window.createWebviewPanel(
      'chatPanel', // Identifies the type of the webview. Used internally
      'Chat Panel', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      { enableScripts: true } // Webview options.
    );

    // You can use a local HTML/CSS/JS for the chat interface, or load it from a web server
    panel.webview.html = getWebviewContent();
  };

  function getWebviewContent() {
    // Return HTML/CSS/JS content for your chat
    // You'll need to implement this with actual chat UI logic
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!-- Use a meta tag to ensure the webview's size is fixed -->
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chat Panel</title>
            </head>
            <body>
                <!-- Add your chat UI here -->
                <h1>Chat</h1>
            </body>
            </html>`;
  }

  class ChatPanelViewProvider {
    constructor(extensionUri) {
      this.extensionUri = extensionUri;
    }
  
    resolveWebviewView(webviewView, context, token) {
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [this.extensionUri]
      };
  
      webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

      webviewView.webview.onDidReceiveMessage(async (message) => {
        var output = "Hello There \n This is a test message";
        console.log(message.command, message.text1);
        output = await callScalaSnippet(message.text1);
        // switch (message.command) {
        //   case 'submit':
        //     this.handleSubmit(message);
        //     break;
        // }
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, message.text1, output);
      }, undefined, context.subscriptions);
    
      
    }

  
    getHtmlForWebview(webview,input='', output='') {
      // Use a nonce for inline scripts for security
      const nonce = getNonce();
    //   output = JSON.stringify(output);
      
      return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Function Refactorings</title>
    </head>
    <body>
      <div>
      <label for="Orig Code">Enter Code For Functional Refactoring</label>
      <textarea id="input1" rows="12" cols="50">${input}</textarea>

      </div>
      
      <button onclick="handleSubmit()">Find Refactorings</button>
     
      <div>
      <label for="Orig Code">Possible Refactoring</label>
      <textarea id="input2" rows="25" cols="50">${output}</textarea>
      </div>


      <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();

        function handleSubmit() {
          const text1 = document.getElementById('input1').value;
          vscode.postMessage({ command: 'submit', text1 });
        }

        
      </script>
    </body>
    </html>
  `;
    }

    handleSubmit(message){
        const input = message.text1;
        callScalaSnippet(input);
        



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

module.exports = {ChatProvider, ChatPanelViewProvider};

