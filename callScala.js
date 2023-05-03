const vscode = require('vscode')
const fs = require('fs'); // to read and write to files


const callbackForCommand = () => {
  var text = "nothing";
  console.log("entered callback function");
  const textEditor = vscode.window.activeTextEditor;
  var oritext, selectionRange;

  const selection = textEditor.selection;
  if (selection && !selection.isEmpty) {
    selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
    oritext = textEditor.document.getText(selectionRange);
  }
  else{
    vscode.window.showInformationMessage("You haven't selected anything!");
  }


  fs.writeFile("C:/Users/gnana/Desktop/IDEtool/namrata/src/main/scala/temp_code.txt", oritext, (err) => {
    if (err) throw err;
    console.log('oritext has been saved into file');
  });

// Call Scala program, give documentText as input, throw the output into a file for now
  function goToScala() {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(`cd C:/Users/gnana/Desktop/IDEtool/namrata && sbt --error "run src/main/scala/temp_code.txt" > answers.txt && type answers.txt`,
        (err, stdout, stderr) => {
            text = stdout;
            resolve(stdout);
            if (err) {
                console.log('error: ' + err);
                reject();
            }
        });
    });
  }
  const ans = goToScala();
  ans.then( () => {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.replace(textEditor.document.uri, selectionRange, text);

        vscode.workspace.applyEdit(workspaceEdit).then(() => {
            vscode.window.showInformationMessage('refactoring done!');
            textEditor.document.save();
        });
    })
    .catch(() => {console.log("It got rejected")})

};

module.exports = callbackForCommand;