const vscode = require('vscode')
const fs = require('fs'); // to read and write to files

let webviewPanel;

vscode.commands.registerCommand('extension.openWebview', () => {
    console.log("Webview created")

  if (!webviewPanel && false) {
    webviewPanel = vscode.window.createWebviewPanel(
      'customWebview',
      'My Webview',
      vscode.ViewColumn.One,
      {}
    );
    console.log("Webview created")


    // Set the HTML content for the webview
    webviewPanel.webview.html = getWebviewContent();
    
    // Handle disposal of the webview
    webviewPanel.onDidDispose(() => {
      webviewPanel = undefined;
    });
  }
  vscode.window.showInformationMessage('Hello There');

});

function getWebviewContent() {
  // Return the HTML content for your webview
  return `
    <html>
      <body>
        <h1>My Webview</h1>
        <p>This is the content of the webview.</p>
      </body>
    </html>
  `;
}

let sidebarPanel;

function createSidebar() {
  if (sidebarPanel) {
    // Sidebar already exists, don't create a new one
    return;
  }

  // Create a Webview panel for the sidebar
  sidebarPanel = vscode.window.createWebviewPanel(
    'customSidebar', // Identifies the type of the webview
    'My Sidebar', // Title displayed in the sidebar
    vscode.ViewColumn.One, // Position the sidebar in the view
    {
      enableScripts: true // Enable JavaScript in the webview
    }
  );

  // Set the HTML content for the sidebar
  sidebarPanel.webview.html = getSidebarContent();

  // Handle disposal of the sidebar
  sidebarPanel.onDidDispose(() => {
    sidebarPanel = undefined;
  });
}

function getSidebarContent() {
  // Return the HTML content for your sidebar
  return `
    <html>
      <body>
        <h1>My Sidebar</h1>
        <p>This is the content of the sidebar.</p>
      </body>
    </html>
  `;
}

// Register a command to open the sidebar
vscode.commands.registerCommand('extension.openSidebar', () => {
  createSidebar();
});
let hoverContext = {};
const featureDisposable =  vscode.languages.registerHoverProvider('scala', {
    provideHover(document, position) {
      // Define the content of the tooltip as a Markdown string
      const tooltipContent = new vscode.MarkdownString();
      tooltipContent.appendMarkdown('**Default Hover Tooltip**\n\n');
      tooltipContent.appendMarkdown('This is a default tooltip for elements in plaintext files.');

      // Define the range where you want the tooltip to appear (e.g., the word at the current cursor position)
      const range = new vscode.Range(position, position);

      // Create and return the hover information
      // createChatbox(); 
      const hoverMessage = new vscode.MarkdownString(
        '[Click here](command:extension.openWebview) to visit example.com\n' +
        '[Click there](https://example2.com?param=hello) to visit example2.com'
      );

      // Set isTrusted to allow links to be clickable
      hoverMessage.isTrusted = true;

      return new vscode.Hover(hoverMessage);
      return hoverMessage;
      // return new vscode.Hover(tooltipContent, range);
      // return null;
    },
  });

  vscode.commands.registerCommand('extension.sayHello', (param1) => {
    // Parse the parameters from the URI
    console.log(param1, hoverContext);
    vscode.window.showInformationMessage(`Hello! param1: ${param1}`);

    // const uriParams = new URL(uri.toString());
    // const param1 = uriParams.searchParams.get('param1');
    // const param2 = uriParams.searchParams.get('param2');
  
    // // Use the parameters as needed
    // vscode.window.showInformationMessage(`Hello! param1: ${param1}, param2: ${param2}`);
    
  });


const setLineDecorations = async () => {
	
		// Create a decoration type with custom styles
		const decorationType = vscode.window.createTextEditorDecorationType({
		  backgroundColor: 'rgba(0, 255, 0, 0.6)', // Red background with 20% opacity
		});

  const filePath = vscode.Uri.file(__dirname + '/test.json');

    

    const fileContentBuffer = await vscode.workspace.fs.readFile(filePath);
    const fileContent = Buffer.from(fileContentBuffer).toString('utf-8');
    const cleanedContent = fileContent.replace(/,\s*]/g, ']')

    // console.log('File content:', fileContent);


  try {
      var jsonObject = JSON.parse(cleanedContent);
  } catch (error) {
  console.error('Error parsing JSON:', error);
  }
  
  const Refactorings = jsonObject["refactor"];
		// Get the currently active text editor
		const editor = vscode.window.activeTextEditor;
	
		if (editor) {
		  // Define the range for the decorator
      var decorations = []
      var condCount = 0, loopCount =0; 
      for(var i = 0; i < Refactorings.length; i++){
        const code = Refactorings[i]["code"];
        const ref = Refactorings[i]["ref"];
        const note = Refactorings[i]["note"];
        if(note.includes("cond")){
          condCount++;
        }
        if(note.includes("loop")){
          loopCount++;
        }
        const lineNo = parseInt(Refactorings[i]["lineNo"]);

		    const line = editor.document.lineAt(lineNo); 
          
        const range = new vscode.Range(line.range.start, line.range.end);

          const hoverMessage = new vscode.MarkdownString();
        hoverMessage.appendMarkdown(`**Functional Code Suggestion  at Line  ${lineNo +1} **\n`);

        // Add a Button Object with onclick event

        const button = new vscode.MarkdownString('[Click Hello](command:extension.sayHello?param1=value1&param2=value2)');
        button.isTrusted = true;
        button.supportHtml = true;
        hoverMessage.appendMarkdown(button.value);
        hoverMessage.isTrusted = true;
        hoverMessage.supportHtml = true;
        hoverMessage.appendMarkdown(`<h1>My Webview</h1> 
        <button onclick=(command:extension.sayHello)> Send </button>`);

        hoverMessage.appendMarkdown(`[Click Hello](command:extension.sayHello?param1=${lineNo}) \n`);

        // hoverMessage.appendMarkdown(`[Open SideBar](command:extension.openSidebar) \n`);
        
        hoverMessage.appendCodeblock(code, 'Scala');
        hoverMessage.appendMarkdown('**Replace with**\n');

        hoverMessage.appendCodeblock(ref, 'javascript');
        hoverMessage.appendMarkdown('**Note**\n');
        hoverMessage.appendMarkdown(note);
        

        hoverMessage.appendMarkdown('Note: Above code may contain erros do check\n');
          
        // insert range, hoverMessage into decorations
        decorations.push({range, hoverMessage});
	
		  // Apply the decorations to the text editor
      
    };
    console.log("Refactorings: ", Refactorings.length, "condRefactorings: ", condCount, "loopRefactorings: ", loopCount);
    editor.setDecorations(decorationType, decorations);


    }
  }

const featureCallback = () => {

    
    let decorationType = vscode.window.createTextEditorDecorationType({
        before: {
            contentText: 'Hover for more info!',
        },
    });

    
    
    // Define the line number where you want to add the marker
    const lineNumber = 10;
    let activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor) {
        console.log("Active editor")
        
        const startPosition = new vscode.Position(lineNumber, 0);
        const endPosition = new vscode.Position(lineNumber, 0);
        
        const range = new vscode.Range(startPosition, endPosition);
        
        activeEditor.setDecorations(decorationType, [range]);
    } else{
        console.log("No active editor")
  }

  
}


module.exports = {featureCallback, featureDisposable, setLineDecorations};