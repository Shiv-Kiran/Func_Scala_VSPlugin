const vscode = require('vscode')


//import * as vscode from 'vscode'
const callbackForCommand = () => {

  console.log("entered callback function");
  const editor = vscode.window.activeTextEditor; // This is good, a global var to access the vscode process
  // const documentText = editor.getText(); // This should give you the text in the open file

  // Call Scala program, give documentText as input, throw the output into a file for now
  const exec = require('child_process').exec;
  exec("cd C:/Users/gnana/Desktop/IDEtool/to-func-scala && ecomm.bat", (err, stdout, stderr) => {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (err) {
        console.log('error: ' + err);
    }
  });

  console.log("completed cp.exec");

  /***
  const workspaceEdit = new vscode.WorkspaceEdit(); // Can use this class to perform edits, I believe that you 
 // need the range that needs to be updated (good idea to console.log and see what these objects look like, 
 //   I suspect, (line, startCol, len)

  // Make the updates
  workspaceEdit.replace(document.uri, rangeToReplace, Refactored code);


  vscode.workspace.applyEdit(workspaceEdit).then(() => {
    vscode.window.showInformationMessage(
          'refactoring done!'
        );
    document.save();
  });
  */
};

module.exports = callbackForCommand;
