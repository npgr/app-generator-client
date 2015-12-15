var app = require('app')
var BrowserWindow = require('browser-window')
var fs = require('fs')
const ipcMain = require('electron').ipcMain;

app.on('ready', function() {

//--- login
	/*var login = new BrowserWindow(
	  {
		width: 330, 
		height: 250, 
		//y: 50,
		frame: false,
		resizable: false
	  }
	)*/
	ipcMain.on('close-login', function() {
		login.close();
		//mainWindow.close();
		//adminWindow.close();
	});
	/*ipcMain.on('valid-admin', function() {
		login.close();
		mainWindow.close();
		adminWindow.loadURL('file://'+__dirname+'/admin.html')
		adminWindow.show();
	});*/
	ipcMain.on('valid-login', function() {
		login.close();
		//adminWindow.close();
		mainWindow.show();
	})
	/*login.on('closed', function() {
		login = null;
	});*/
	//login.openDevTools()
	//login.loadURL('file://'+__dirname+'/login.html')
	
//--- Main Window
	var mainWindow = new BrowserWindow({
		width: 1020,
		height: 700,
		y: 50,
		//show: false,
		//frame: false  //frameless window
	})
	//mainWindow.openDevTools()
	var adminWindow = new BrowserWindow({
		width: 600,
		height: 400,
		y: 50,
		show: false,
		//frame: false  //frameless window
	})
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
	/*adminWindow.on('closed', function() {
		adminWindow = null
	})*/
	
	mainWindow.loadURL('file://'+__dirname+'/main.html')
	
	//mainWindow.loadURL('file://'+__dirname+'/admin.html')
})

