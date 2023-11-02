const vscode = require('vscode')
const fs = require('fs'); // to read and write to files

const featureDisposable =  vscode.languages.registerHoverProvider('scala', {
    provideHover(document, position) {
      // Define the content of the tooltip as a Markdown string
      const tooltipContent = new vscode.MarkdownString();
      tooltipContent.appendMarkdown('**Default Hover Tooltip**\n\n');
      tooltipContent.appendMarkdown('This is a default tooltip for elements in plaintext files.');

      // Define the range where you want the tooltip to appear (e.g., the word at the current cursor position)
      const range = new vscode.Range(position, position);

      // Create and return the hover information
      return new vscode.Hover(tooltipContent, range);
    },
  });

const setLineDecorations = async () => {
    const lineNumber = 19; // Change to your desired line number
	
		// Create a decoration type with custom styles
		const decorationType = vscode.window.createTextEditorDecorationType({
		  backgroundColor: 'rgba(0, 255, 0, 0.6)', // Red background with 20% opacity
		});
    // print all the files in current directory 
    
	// const filePath = 'package.json';
  // const fileContent = fs.readFileSync(filePath, 'utf-8');
  // const cleanedContent = fileContent.replace(/,\s*]/g, ']')

  // give relative path 
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
      for(var i = 0; i < Refactorings.length; i++){
        const code = Refactorings[i]["code"];
        const ref = Refactorings[i]["ref"];
        const note = Refactorings[i]["note"];
        const lineNo = parseInt(Refactorings[i]["lineNo"]);

		    const line = editor.document.lineAt(lineNo); 
          
        const range = new vscode.Range(line.range.start, line.range.end);

          const hoverMessage = new vscode.MarkdownString();
        hoverMessage.appendMarkdown(`**Functional Code Suggestion  at Line  ${lineNo +1} **\n`);
        
        hoverMessage.appendCodeblock(code, 'javascript');
        hoverMessage.appendMarkdown('**Replace with**\n');

        hoverMessage.appendCodeblock(ref, 'javascript');
        hoverMessage.appendMarkdown('**Note**\n');
        hoverMessage.appendMarkdown(note);
        

        hoverMessage.appendMarkdown('Note: Above code may contain erros do check\n');
          
        // insert range, hoverMessage into decorations
        decorations.push({range, hoverMessage});
	
		  // Apply the decorations to the text editor
      
    };
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