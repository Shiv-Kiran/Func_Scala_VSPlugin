const vscode = require('vscode');


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
    }
  
    getHtmlForWebview(webview) {
      // Use a nonce for inline scripts for security
      const nonce = getNonce();
      
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Chat Panel</title>
        </head>
        <body>
        <h1> Hello There </h1>
          <!-- Add your chat UI HTML here -->
          <script nonce="${nonce}">
            // Add your chat UI JavaScript here
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

module.exports = {ChatProvider, ChatPanelViewProvider};

