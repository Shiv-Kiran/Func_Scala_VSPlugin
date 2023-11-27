// commands.js
const vscode = require('vscode');
// import lineDecorations from './lineDecor';
const {lineDecorations} = require('./lineDecor');
const {RefactorPanelViewProvider} = require('./refactorPanel');


function registerCommands(context) {
  const refactorProvider = new RefactorPanelViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider("refactorPanel", refactorProvider));


  context.subscriptions.push(vscode.commands.registerCommand('option1CommandId',async (...args)  => {
    
    vscode.window.showInformationMessage('Option 1 selected');
    const [document, range, additionalParameter] = args; 
    console.log("args ", args);
    const lineNumber = range.start.line;
    
    const editor = vscode.window.activeTextEditor;


    if (editor && lineDecorations.has(lineNumber)) {

      const decorationType = lineDecorations.get(lineNumber);
      // get all the lines from lineDecorations 
      lineDecorations.delete(lineNumber); // Remove the entry from the map
      var  lines = lineDecorations.keys();
      // make lines an array 
      var lines1 = Array.from(lines);
      console.log("lines ", lines);
      // create range array of lines 
      var arr = []; 
      
      lines1.forEach(line => {
        console.log(line);
        const range = new vscode.Range(line, 0, line, 0);
        const hoverMessage = new vscode.MarkdownString();
        hoverMessage.appendMarkdown(`**Functional Code Suggestion  at Line  HAHAHA**\n`);
    arr.push({range, hoverMessage });
        // arr.push(range);
      });
      editor.setDecorations(decorationType, arr); // Remove the decoration for that line
      // decorationType.dispose(); // Clean up the decorationType
    }
    // Here 


    const newCode = additionalParameter; // This is where you get or define the new code to insert

    // const action = await vscode.window.showInformationMessage(
    //   `Apply the following refactor?\n\n${newCode}`, 
    //   { modal: true },
    //   'Accept', 
    //   'Reject'
    // );
    const lineNo = 765;
    const origCode = "val x = 1";

    await vscode.commands.executeCommand('extension.openSidebar');
    await refactorProvider.updateSelectedText(lineNo, origCode, newCode);


    const result = await vscode.window.showInformationMessage(
      `**Do you want the changes to your code ** \n
      This is the change \n
      ${newCode} \n \n \n 
      ${newCode} \n
      ${newCode} \n      
      `,
      'Accept',
      'Reject',
    );
    if( result === 'Accept'){
      vscode.commands.executeCommand('workbench.action.reloadWindow');
    }

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, newCode);
    vscode.workspace.applyEdit(edit);
    
    vscode.window.showInformationMessage('Code has been refactored.');

  }));

  context.subscriptions.push(vscode.commands.registerCommand('option2CommandId', (...args) => {
    vscode.window.showInformationMessage('Option 2 selected');
  }));

  // ... register more commands as needed
}

module.exports = {
  registerCommands
};
