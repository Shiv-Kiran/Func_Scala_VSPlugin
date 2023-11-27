// commands.js
const vscode = require('vscode');
// import lineDecorations from './lineDecor';
const {lineDecorations} = require('./lineDecor');
const {RefactorPanelViewProvider} = require('./refactorPanel');
const {globalRefactorings} = require('./extension');
const { getRefactorings } = require('./createFeature');
const {} = require

function registerCommands(context) {
  const refactorProvider = new RefactorPanelViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider("refactorPanel", refactorProvider));


  context.subscriptions.push(vscode.commands.registerCommand('option1CommandId',async (...args)  => {
    const refactorings = await getRefactorings(); 
    
    vscode.window.showInformationMessage('Option 1 selected');
    const [document, range, additionalParameter] = args; 
    console.log("args ", args);
    const lineNumber = range.start.line;
    
    const editor = vscode.window.activeTextEditor;


    if (editor && lineDecorations.has(lineNumber)) {

      const {decorationType, refactorJson} = lineDecorations.get(lineNumber);
      console.log(refactorJson, decorationType);
      // get all the lines from lineDecorations 
      lineDecorations.delete(lineNumber); // Remove the entry from the map
      var code, ref, note, lineNo; 
 
      var  lines = lineDecorations.keys();
      // make lines an array 
      var lines1 = Array.from(lines);
      // create range array of lines 
      var arr = []; 
      var refactJson = [];
      
      refactorings.forEach(line_ => {

         code = line_["code"];
         ref = line_["ref"];
         note = line_["note"];
        
         lineNo = parseInt(line_["lineNo"]);
         if(lineNo === lineNumber){
          refactJson = line_;;
        }
        // Check if LineNo is present in lines1
        if(lines1.includes(lineNo)){

        const line = editor.document.lineAt(lineNo); 
        const range = new vscode.Range(line.range.start, line.range.end);
    
        lineDecorations.set(lineNo, {decorationType, line_});
        const hoverMessage = new vscode.MarkdownString();
        hoverMessage.appendMarkdown(`**Functional Code Suggestion  at Line  ${lineNo +1} **\n`);
    
    
        hoverMessage.isTrusted = true;
        hoverMessage.supportHtml = true;
    
        // hoverMessage.appendMarkdown(`[Open SideBar](command:extension.openSidebar) \n`);
        
        hoverMessage.appendCodeblock(code, 'Scala');
        hoverMessage.appendMarkdown('**Replace with**\n');
    
        hoverMessage.appendCodeblock(ref, 'javascript');
        hoverMessage.appendMarkdown('**Note**\n');
        hoverMessage.appendMarkdown(note);
        
    
        hoverMessage.appendMarkdown('Note: Above code may contain erros do check\n');
        arr.push({range, hoverMessage });
        }
      });
      editor.setDecorations(decorationType, arr); // Remove the decoration for that line
      // decorationType.dispose(); // Clean up the decorationType
    const newCode = refactJson["ref"]; // This is where you get or define the new code to insert

    const origCode = refactJson["code"];
    const noteC = refactJson["note"];
    lineNo = refactJson["lineNo"];
    console.log("commands", origCode, newCode, lineNo, noteC);

    await vscode.commands.executeCommand('extension.openSidebar');
    await refactorProvider.updateSelectedText(lineNo, origCode, newCode);


    const result = await vscode.window.showInformationMessage(
      `**Do you want the changes to your code ** \n
      This is the change \n
      ${newCode} \n \n \n to 
      ${origCode} \n
      `,
      'Accept',
      'Reject',
    );
    if( result === 'Accept'){
      vscode.commands.executeCommand('workbench.action.reloadWindow');
    }

    // const edit = new vscode.WorkspaceEdit();
    // edit.replace(document.uri, range, newCode);
    // vscode.workspace.applyEdit(edit);
    
    vscode.window.showInformationMessage('Code has been refactored.');

    }
    else {
      vscode.window.showInformationMessage('No refactoring available');
    }


  }));

  context.subscriptions.push(vscode.commands.registerCommand('option2CommandId', (...args) => {
    vscode.window.showInformationMessage('Option 2 selected');
  }));

  // ... register more commands as needed
}

module.exports = {
  registerCommands
};
