const electron = require('electron');
const path = require('path');
// Might Use later
// const url = require('url');
const { ipcMain } = require('electron')
var AWS = require("aws-sdk");
var fs = require('fs');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

AWS.config.update({region: 'us-west-2'});

function createWindow() {
    mainWindow = new BrowserWindow({width: 1100, height: 700, webPreferences: {nodeIntegration: true}});
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

// getters
ipcMain.on('getAWSAccessKey', (event, arg) => {
    AWS.config.getCredentials(function(err) {
        if (err) {
            event.reply('getAWSAccessKey-reply', err.stack);
        }
        else {
            event.reply('getAWSAccessKey-reply', AWS.config.credentials.accessKeyId)
        }
    });
})
ipcMain.on('getAWSProfile', (event, arg) => {
    AWS.config.getCredentials(function(err) {
        if (err) {
            event.reply('getAWSProfile-reply', err.stack);
        }
        else {
            event.reply('getAWSProfile-reply', AWS.config.credentials.profile)
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

// setters
ipcMain.on('setAWSCreds', (event, arg) => {
    var credentials = new AWS.SharedIniFileCredentials({profile: arg});
    AWS.config.credentials = credentials;
    AWS.config.getCredentials(function(err) {
        if (err) {
            event.reply('setAWSCreds-reply', err.stack);
        }
        else {
            event.reply('setAWSCreds-reply', AWS.config.credentials.accessKeyId)
        }
    });
})

// upload to s3
ipcMain.on('uploadFileToS3', (event, arg) => {
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: 'cs493-aws-cli', Key: '', Body: ''};
    var file = __dirname + "/../" + arg;

    // Configure the file stream and obtain the upload parameters
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', (err) => {
        event.reply('uploadFileToS3-reply', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3-reply', err);
        } if (data) {
            event.reply('uploadFileToS3-reply', "Upload Success: " + data.Location);
        }
    });
})