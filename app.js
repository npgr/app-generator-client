var app = require('app')
var BrowserWindow = require('browser-window')
var fs = require('fs')
var ipcMain = require('electron').ipcMain;

app.on('ready', function() {

//--- Main Window
	var mainWindow = new BrowserWindow({
		width: 1020,
		height: 700,
		y: 50
		//show: false,
		//frame: false  //frameless window
	})
	//mainWindow.openDevTools()
	
	mainWindow.on('closed', function() {
		mainWindow = null;
		//newAppWindow.close()
	});

	//mainWindow.loadURL('file://'+__dirname+'/main.html')
	fs.readFile('./config.json', 'utf-8', function (err, data) {
		//if (err) throw err;
		if (err){ // if config.json does not exist
			// ASK for configuration
			var obj = {
				url: 'http://localhost:1337',
				width: 1000,
				height: 700
			}
			var data = JSON.stringify(obj)
			fs.writeFile('./config.json', text_data, 'utf-8')
		} 
		var config = JSON.parse(data)
		mainWindow.setSize(config.width, config.height)
		mainWindow.loadURL(config.url)
	});
	
	ipcMain.on('new-app', function(event, arg) {
		var newAppWindow = new BrowserWindow({
		width: 600,
		height: 400,
		y: 50,
		show: false
		//frame: false  //frameless window
		})
		newAppWindow.loadURL('file://'+__dirname+'/pages/newApp.html?app='+arg.app+'&port='+arg.port+'&path='+arg.path)
		newAppWindow.show();
	});
	ipcMain.on('start-app', function(event, arg) {
		var startAppWindow = new BrowserWindow({
		width: 520,
		height: 360,
		y: 50,
		show: false
		//frame: false  //frameless window
		})
		startAppWindow.loadURL('file://'+__dirname+'/pages/startApp.html?app='+arg.app+'&port='+arg.port+'&path='+arg.path)
		startAppWindow.show();
	});
	ipcMain.on('create-model', function(event, arg) {
		var createModel = new BrowserWindow({
		width: 360,
		height: 240,
		y: 50,
		show: false
		//frame: false  //frameless window
		})
		createModel.loadURL('file://'+__dirname+'/pages/createModel.html?model='+arg.model+'&path='+arg.path)
		createModel.show();
	});
	ipcMain.on('create-mfunction', function(event, arg) {
		var createMFunc = new BrowserWindow({
		width: 650,
		height: 240,
		y: 50,
		show: false
		//frame: false  //frameless window
		})
		createMFunc.loadURL('file://'+__dirname+'/pages/createMFunction.html?mfunc='+arg.mfunc+'&path='+arg.path)
		createMFunc.show();
	});
})

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

