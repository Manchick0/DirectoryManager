const vscode = require('vscode');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let root = vscode.workspace.getConfiguration("directorymanager").get("rootFolder")

	const disposable = vscode.commands.registerCommand('directorymanager.createFolder', async () => {
		let path = getFolder(root)
		if(await path === undefined || await path === ""){
			vscode.window.showErrorMessage("The name of the folder can't be empty!")
			return
		}

		fs.mkdir(await path, {recursive: true}, (err) => {
			if(err){
				vscode.window.showErrorMessage(`Couldn't create a new folder within ${root}!`)
			} else vscode.window.showInformationMessage(`Successfully created a new folder within ${root}!`);
		})

		let uri = vscode.Uri.file(await path)
		vscode.workspace.updateWorkspaceFolders(0, 0, {uri: uri})
	});

	context.subscriptions.push(disposable);
}

/**
 * @param {string} root 
 */
async function getFolder(root) {
    const userResponse = await vscode.window.showInputBox({ placeHolder: 'Enter the name of your folder...' });
	if(!userResponse){
		return "";
	}
	if(root.endsWith("/")){
		return root + userResponse;
	}
	return root + "/" + userResponse;
}

module.exports = {
	activate
}