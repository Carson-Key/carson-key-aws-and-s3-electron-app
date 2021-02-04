var AWS = require("aws-sdk");
const electron = require('electron');
// Might Use later
// const path = require('path');
// const url = require('url');


const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
    // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});