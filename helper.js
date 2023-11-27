const vscode = require('vscode')



function replaceTextAtLine1(editor, lineNo, text1, text2) {
  // retrieve the line of text 
  lineNo = lineNo - 1;
  lineNo = lineNo + 1;
  var selectionRange = new vscode.Range(new vscode.Position(0, 0),
  new vscode.Position(editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).text.length));
var text = editor.document.lineAt(editor.document.lineCount - 1).text
// console log length of text 
var tempText = editor.document.lineAt(lineNo-1+1).text
console.log("length of text: ", text.length, editor.document.lineAt(lineNo - 1).text, tempText, tempText.indexOf(text1) )
  // console.log(editor.document.getText(selectionRange))
  
  console.log("replaceTextAtLine ", lineNo, text1, text2);

  var lineText = editor.document.getText(selectionRange);

  const startPos = 0; 
  // console.log(lineNo, text1, text2, lineText, startPos)
  console.log("replaceTextAtLine ", lineNo, text1, text2);
  
    if (startPos >= 0) {
      // text1 found in the line
      const endPos = startPos + text1.length;
      const range = new vscode.Range(lineNo, startPos, lineNo, endPos);
  
      // Create and apply the edit
      const edit = new vscode.WorkspaceEdit();
      edit.replace(editor.document.uri, range, text2);
      console.log("edit ", edit)
      return vscode.workspace.applyEdit(edit);
    } else {
      // text1 not found in the line
      console.log(`Text "${text1}" not found in line ${lineNo + 1}`);
      return Promise.resolve(false);
    }
}

function replaceTextAtLine(editor, lineNo, text1, text2) {
  // conver lineNo to int ;
  console.log(lineNo, text1, text2)
  lineNo = lineNo - 1;
  lineNo = lineNo + 1;
  const document = editor.document;
  const numberOfLines = document.lineCount;
  // text1 = JSON.stringify(text1);
  // text2 = JSON.stringify(text2);

  // Find the start position of text1
  let startPos = new vscode.Position(lineNo, 0);
  let endPos = new vscode.Position(lineNo, 0);
  console.log("replaceTextAtLine ", lineNo, text1, text2, startPos, endPos)
  let found = false;
  console.log(text1);
  for (let i = lineNo; i < Math.min(numberOfLines, lineNo + 2*text1.split('\n').length); i++) {
    const lineText = document.lineAt(i).text;
    console.log("lineText " + i, lineText)

    if (!found) {
      // Look for the start of text1
      console.log("Looking for matching ", lineText, text1.split('\n')[0])
      const index = lineText.indexOf(text1.split('\n')[0]);
      if (index >= 0) {
        startPos = new vscode.Position(i, index);
        endPos = new vscode.Position(i, index + text1.length);
        found = true;
      }
    } else {
      if(text1.split('\n').length > 1){
      // Look for the end of text1
      if (lineText.includes(text1.split('\n').slice(-1)[0])) {
        endPos = new vscode.Position(i, lineText.indexOf(text1.split('\n').slice(-1)[0]) + text1.split('\n').slice(-1)[0].length);
        break;
      }
    }
    }
  }
  console.log(found, " startPOs ", startPos, " endPos ", endPos)
  if (found) {
    // Create and apply the edit
    const range = new vscode.Range(startPos, endPos);
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, text2);
    return vscode.workspace.applyEdit(edit);
  } else {
    console.log(`Text "${text1}" not found starting from line ${lineNo + 1}`);
    return Promise.resolve(false);
  }
}

module.exports = {replaceTextAtLine};