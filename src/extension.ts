// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { env } from 'process';
import { homedir } from 'os';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "mendsast" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand('mendsast.scan', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello Scan from MendSAST!');
		if (!fs.existsSync(homedir() + '\\mendsastcli.exe')) {
			//vscode.window.showErrorMessage('The mendsastcli.exe scanner was not found in your home directory.  Please click on the button below to download it.',"download link");
			const msgopts: vscode.MessageOptions = {detail: 'Please click on the button below to download it.', modal: true};
			const download = "Download Windows SAST scanner";
			vscode.window.showErrorMessage('The mendsastcli.exe scanner was not found in your home directory.',msgopts,download).then(selection => {
				if (selection === download) {
					vscode.env.openExternal(vscode.Uri.parse("https://downloads-sast.mend.io/sast-cli/windows/mendsastcli.exe"));
				}
			});		
			
		  } else {
			if (!fs.existsSync(homedir() + '\\mendsastcli-config.json')) {
				const msgopts: vscode.MessageOptions = {detail: 'Please click on the button below to have mendsastcli create this file for you with your input.', modal: true};
				const configure = "Configure mendsastcli";
				vscode.window.showErrorMessage('The mendsastcli-config.json file was not found in your home directory.',msgopts,configure).then(selection => {
					if (selection === configure) {
						let terminalOptions: vscode.TerminalOptions = {name: 'Configure mendsastcli', shellPath: 'powershell', shellArgs: '-noExit -Command & {"~\\mendsastcli.exe"}'};
						let sastterm = vscode.window.createTerminal(terminalOptions);
						sastterm.show();
				
					} 
				});		

			}
			else {
				const task = new vscode.Task({ type: 'powershell' }, vscode.TaskScope.Workspace, 'Mend SAST', 'mend.io',
					new vscode.ShellExecution(homedir() + '\\mendsastcli.exe', 
					["--dir", "."],
				));
				vscode.tasks.executeTask(task);
			} 
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
