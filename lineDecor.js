const vscode = require('vscode');


const decorationType = vscode.window.createTextEditorDecorationType({
    overviewRulerLane: vscode.OverviewRulerLane.Right, // Display on the right side of the editor
    light: {
        // Define the icon for light themes
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        overviewRulerColor: 'rgba(255, 0, 0, 0.7)'
    },
    dark: {
        // Define the icon for dark themes
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        overviewRulerColor: 'rgba(0, 255, 0, 0.7)'
    }
});

const decorationOptions = {
    range: new vscode.Range(new vscode.Position(764, 0), new vscode.Position(764, 0)),
    renderOptions: {
      after: {
        contentText: '✨',
        color: 'yellow'
      }
    }
  };

const decorationType2 = vscode.window.createTextEditorDecorationType({});


function showCodeChangeOptions(lineNumber) {
    console.log("showCodeChangeOptions ", lineNumber);
    vscode.window.showQuickPick(['Accept', 'Reject'], {
        placeHolder: 'Choose an action for code changes on line ' + lineNumber
    }).then(selection => {
        if (selection === 'Accept') {
            // Perform the code acceptance action
            // You can implement this according to your requirements
            vscode.window.showInformationMessage('Code changes accepted for line ' + lineNumber);
        } else if (selection === 'Reject') {
            // Perform the code rejection action
            // You can implement this according to your requirements
            vscode.window.showInformationMessage('Code changes rejected for line ' + lineNumber);
        }
    });
}

function showContextMenu() {
    const items = [
      { label: 'Option 1', action: () => console.log('Option 1 selected') },
      { label: 'Option 2', action: () => console.log('Option 2 selected') }
    ];
    vscode.window.showQuickPick(items).then(item => {
      if (item) {
        item.action();
      }
    });
  }

const decorateLines = async (refactorings) => {

    // vscode.window.onDidChangeTextEditorSelection(event => {
    //     if (event.textEditor === vscode.window.activeTextEditor) {

    //       const lineNumber = event.selections[0].start.line;
    //       if (lineNumber === 764) { // 0-based index, so line 765 is index 764
    //         // Trigger your context menu here, or show a quick pick as a workaround
            
    //         showContextMenu();
    //       }
    //     }
    //   });

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // addDecorations(editor);
        applyDecorations(editor, refactorings);
        // console.log("entered decorateLines")
        // // Define the range for the line where code changes are possible (replace with your line number)
        // const lineNumber = 765; // Replace with the actual line number
        // const lineRange = editor.document.lineAt(lineNumber - 1).range;

        // // Create a decoration with the defined decoration type
        // const decoration = {
        //     range: lineRange,
        //     hoverMessage: 'Possible code changes here', // Tooltip message
        //     renderOptions: {
        //         after: {
        //             contentText: '⚠️', // Unicode or custom icon
        //             onClick: () => showCodeChangeOptions(lineNumber), // Callback function when icon is clicked
        //         },
        //     },
        // };

        // Apply the decoration to the editor
        // editor.setDecorations(decorationType, [decoration]);
        // editor.setDecorations(decorationType2, [decorationOptions]);
    }

};

class LineSpecificCodeActionProvider {
  provideCodeActions(document, range, context, token) {
    // Here, you would check if the range is within line 765
    
    // provide code actions for set of lines = [764, 765, 766, 767, 768, 769, 770]

    if (lineDecorations.has(range.start.line) ) { // 0-based index, so line 765 is index 764
      // Create an array to hold your code actions
    vscode.commands.executeCommand('extension.openSidebar');

      const actions = [];

      // Create a code action for each option you want to provide
      actions.push(this.createCodeAction(`Refactor at ${range.start.line}`, 'option1CommandId', [document, range, range.start.line]));
      actions.push(this.createCodeAction('Option 2 for line 765', 'option2CommandId', [document, range, 'additionalParameter2']));
      

      // ... add more options as needed

      return actions;
    }

    // If not line 765, you can decide to return undefined or an empty array
    return [];
  }

  createCodeAction(title, commandId, args) {
    const action = new vscode.CodeAction(title, vscode.CodeActionKind.RefactorInline);
    action.command = { command: commandId, title: title, arguments: args };
    return action;
  }
}
const iconPath = 'C:/Users/bshiv/Downloads/refactor.jpg';

const lineDecorations = new Map();



function applyDecorations(editor, lines) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    // Define your gutter icon here
    gutterIconPath: vscode.Uri.file(iconPath),
    gutterIconSize: 'contain', 
    isWholeLine: true,
    overviewRulerColor: 'red',
    overviewRulerLane: vscode.OverviewRulerLane.Left,

    before: {
      // margin: '0 0 0 4em', // Adjust the margin as needed
      contentText: '➤', // The text or symbol you want to appear on the right
      color: 'rgba(0,255,0,0.5)' // Set your desired color and opacity
    },
    backgroundColor: 'rgba(0, 255, 0, 0.6)', // Red background with 20% opacity

  });


  // create decoration for each line 
  const range = new vscode.Range(new vscode.Position(764, 0), new vscode.Position(764, 0)); // Line numbers are 0-based

  var arr = [];
  lines.forEach(line_ => {
    const code = line_["code"];
    const ref = line_["ref"];
    const note = line_["note"];
    
    const lineNo = parseInt(line_["lineNo"]);
    const line = editor.document.lineAt(lineNo); 
    const range = new vscode.Range(line.range.start, line.range.end);

    lineDecorations.set(lineNo, {decorationType, code});
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
  });
  editor.setDecorations(decorationType, arr);
}

const lineCodeAction = vscode.languages.registerCodeActionsProvider(
    { scheme: 'file', language: 'scala' }, // Replace 'yourLanguageId' with the relevant language


    new LineSpecificCodeActionProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.Refactor]
    }
  )


module.exports = {decorateLines, lineCodeAction, lineDecorations};