const electron = require('electron');
// Might Use later
// const path = require('path');
// const url = require('url');
const { ipcMain } = require('electron')
var AWS = require("aws-sdk");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

AWS.config.update({region: 'us-west-2'});

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true}});
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

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.reply('asynchronous-reply', 'async pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'sync pong'
})

ipcMain.on('getAWSCreds', (event, arg) => {
    AWS.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
            // credentials not loaded
        else {
            event.reply('getAWSCreds-reply', AWS.config.credentials.accessKeyId)
        }
    });
})

ipcMain.on('setAWSCreds', (event, arg) => {
    var credentials = new AWS.SharedIniFileCredentials({profile: arg});
    AWS.config.credentials = credentials;
    AWS.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
            // credentials not loaded
        else {
            event.reply('setAWSCreds-reply', AWS.config.credentials.accessKeyId)
        }
    });
})

ipcMain.on('getS3Buckets', (event, arg) => {
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    s3.listBuckets(function(err, data) {
        if (err) {
            event.reply('getS3Buckets-reply', err);
        } else {
            event.reply('getS3Buckets-reply', data.Buckets);
        }
    });
})