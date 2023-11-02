// Everything is written in Node.js. So you have to use require. 
const vscode = require('vscode');
const callbackForCommand = require('./callScala');   // using import causes errors
const {featureCallback, featureDisposable, setLineDecorations} = require('./createFeature');

// This function runs on setup. Whenever the app is initialized it starts. 
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "to-func-scala" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// featureCallback();

	let disposable = vscode.commands.registerCommand('to-func-scala.refactorCode', function () {
		// The code you place here will be executed every time your command is execute

		// Display a message box to the user
		//vscode.window.showInformationMessage("About to run callback");
		// callbackForCommand();
		vscode.window.showInformationMessage('Hello World from OOP to functional Scala!');
		//console.log("we are now done with the running");
	});
	setLineDecorations();


	// context.subscriptions.push(featureDisposable);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
