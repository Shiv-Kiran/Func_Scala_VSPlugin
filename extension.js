// Everything is written in Node.js. So you have to use require. 
const vscode = require('vscode');
const {callbackForCommand} = require('./callScala');   // using import causes errors
const {featureCallback, featureDisposable, getRefactorings} = require('./createFeature');

const {decorateLines, lineCodeAction} = require('./lineDecor');
const { registerCommands } = require('./commands');
const {ChatProvider, ChatPanelViewProvider} = require('./chatProvider');
const {RefactorPanelViewProvider} = require('./refactorPanel');

// This function runs on setup. Whenever the app is initialized it starts. 
/**
 * @param {vscode.ExtensionContext} context
 */


let globalRefactorings = []; 
function activate(context) {

	let isCommandRunning = false;
	console.log('Congratulations, your extension "to-func-scala" is now active!');

	async function run() {
		globalRefactorings = await getRefactorings();
			decorateLines(globalRefactorings);
	}

	async function handleConcurrency() {
		if (isCommandRunning) {
			vscode.window.showInformationMessage('A command is already running. Please wait.');
			return;
		  }
		  try {
			// Set the flag to indicate that the command is running
			isCommandRunning = true;
		
			const start = Date.now();
		console.log("entered callback function 1");
		// await callbackForCommand(start);
		run();
		const end = Date.now();
		const time = end - start;
		console.log("Time taken for callback: ", time);
		
			vscode.window.showInformationMessage('Command completed.');
		  } catch (error) {
			// Handle any errors
			vscode.window.showErrorMessage(`Command failed: ${error.message}`);
		  } finally {
			// Reset the flag to indicate that the command has finished
			isCommandRunning = false;
		  }
		
		
	}
	let disposable = vscode.commands.registerCommand('to-func-scala.refactorCode',handleConcurrency);

	const refactorProvider = new RefactorPanelViewProvider(context.extensionUri);


	

	// setLineDecorations();


	context.subscriptions.push(featureDisposable);
	context.subscriptions.push(disposable);
	context.subscriptions.push(lineCodeAction);


	registerCommands(context);

	// const chatProvider = new ChatProvider();
	// vscode.window.registerTreeDataProvider('chat-panel', chatProvider);
	const provider = new ChatPanelViewProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("chatPanel", provider));

	// context.subscriptions.push(vscode.window.registerWebviewViewProvider("refactorPanel", refactorProvider));

	context.subscriptions.push(vscode.commands.registerCommand('extension.openSidebar', () => {
		vscode.commands.executeCommand('workbench.view.extension.refactorContainer'); // Use your sidebar's view ID
	  }));

	vscode.commands.registerCommand('chat.start', ChatProvider);

	
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate, 
	globalRefactorings
}
