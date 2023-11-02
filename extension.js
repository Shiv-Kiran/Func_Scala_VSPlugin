// Everything is written in Node.js. So you have to use require. 
const vscode = require('vscode');
const callbackForCommand = require('./callScala');   // using import causes errors
const {featureCallback, featureDisposable, setLineDecorations} = require('./createFeature');

// This function runs on setup. Whenever the app is initialized it starts. 
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	
	console.log('Congratulations, your extension "to-func-scala" is now active!');

	let disposable = vscode.commands.registerCommand('to-func-scala.refactorCode', function () {
		
		const start = Date.now();
		console.log("entered callback function 1");
		callbackForCommand(start);
		const end = Date.now();
		const time = end - start;
		console.log("Time taken for callback: ", time);
		vscode.window.showInformationMessage('Hello World from OOP to functional Scala!');
		
	});
	// setLineDecorations();


	// context.subscriptions.push(featureDisposable);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
