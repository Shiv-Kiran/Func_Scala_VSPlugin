const vscode = require('vscode')
const fs = require('fs'); // to read and write to files
const replaceCodeBlock = require('./replaceText');
const { setLineDecorations } = require('./createFeature');

const callbackForCommand = (time) => {
  var initTime = time; 
  var text = "nothing";
  console.log("entered callback function 1");
  const textEditor = vscode.window.activeTextEditor;
  var oritext, selectionRange;

  const selection = textEditor.selection;
  // if (selection && !selection.isEmpty) {
  //   selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
  //   oritext = textEditor.document.getText(selectionRange);
  // }
  // else{
  //   vscode.window.showInformationMessage("You haven't selected anything!");
  // }
  selectionRange = new vscode.Range(
    new vscode.Position(0, 0),
    new vscode.Position(textEditor.document.lineCount - 1, textEditor.document.lineAt(textEditor.document.lineCount - 1).text.length)
  );
  oritext = textEditor.document.getText(selectionRange);
  vscode.window.showInformationMessage("Text Selection Done");

  fs.writeFile("E:/Semester 7/RnD/IDEtool/namrata/src/main/scala/temp_code.txt", oritext, (err) => {
    if (err) throw err;
    console.log('oritext has been saved into file', oritext.length);
  });

// Call Scala program, give documentText as input, throw the output into a file for now
  function goToScala() {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(`cd /d "E:/Semester 7/RnD/IDEtool/namrata" && sbt --error "run src/main/scala/temp_code.txt" > answers.json && type answers.json`,
        (err, stdout, stderr) => {
            text = stdout;
            console.log("Time just after Exec: ", Date.now() - initTime, "time taken, ", Date.now(), " init time ", initTime);
            resolve(stdout);
            if (err) {
                console.log('error: ' + err);
                reject();
            }
            console.log("Time for Exec : ", Date.now() - time, "time taken");
            time = Date.now();
        });
    });
    
  }
  const ans = goToScala();
  ans.then( async () => {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.replace(textEditor.document.uri, selectionRange, text);
        // replaceCodeBlock(text, oritext)
      // vscode.workspace.applyEdit(workspaceEdit).then(() => {
      //       vscode.window.showInformationMessage('refactoring done!');
      //       textEditor.document.save();
      //   });
      // write text into test.json and then run setLineDecorations
      // const filePath = vscode.Uri.file(__dirname + '/test.json');
      fs.writeFile(__dirname + "/test.json", text, (err) => {
        if (err) throw err;
      setLineDecorations(); 
      console.log((Date.now() - time)/1000.0, "time taken");

      console.log((Date.now() - initTime)/1000.0, "Total Time taken");
      }
      );
      
    })
    .catch(() => {console.log("It got rejected")})

};

module.exports = callbackForCommand;