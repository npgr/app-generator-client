var app = require('app')
var BrowserWindow = require('browser-window')
var fs = require('fs')
const ipcMain = require('electron').ipcMain;

app.on('ready', function() {

//--- Main Window
	var mainWindow = new BrowserWindow({
		width: 1020,
		height: 700,
		y: 50,
		//show: false,
		//frame: false  //frameless window
	})
	//mainWindow.openDevTools()
	
	
	mainWindow.on('closed', function() {
		mainWindow = null;
		//newAppWindow.close()
	});
	/*newAppWindow.on('closed', function() {
		newAppWindow = null;
	});*/
	
	//mainWindow.loadURL('file://'+__dirname+'/main.html')
	mainWindow.loadURL('http://localhost:1337')
	
	ipcMain.on('new-app', function(event, arg) {
		var newAppWindow = new BrowserWindow({
		width: 600,
		height: 400,
		y: 50,
		show: false,
		//frame: false  //frameless window
		})
		newAppWindow.loadURL('file://'+__dirname+'/pages/newApp.html?app='+arg)
		newAppWindow.show();
	});
	
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

