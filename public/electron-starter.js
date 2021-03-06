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
    var docClient = new AWS.DynamoDB.DocumentClient();
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var file = __dirname + "/../" + arg.filePath;
    let fileType = path.extname(file)

    if (fileType !== '.mp3') {
        event.reply('uploadFileToS3-reply', 'Please give a mp3 file, not a: ' + fileType);
    } else {
        // call S3 to retrieve upload file to specified bucket
        var uploadParams = {Bucket: 'cs493-aws-cli', Key: '', Body: ''};

        // Configure the file stream and obtain the upload parameters
        var fileStream = fs.createReadStream(file);
        fileStream.on('error', (err) => {
            event.reply('uploadFileToS3-reply', err);
        });
        uploadParams.Body = fileStream;
        if (arg.fileName === "") {
            uploadParams.Key = path.basename(file);
        } else {
            if (path.extname(arg.fileName) !== '.mp3') {
                uploadParams.Key = arg.fileName + ".mp3"
            } else {
                uploadParams.Key = arg.fileName
            }
        }

        // call S3 to retrieve upload file to specified bucket
        s3.upload (uploadParams, (err, data) => {
            if (err) {
                event.reply('uploadFileToS3-reply', err);
            } 
            if (data) {
                var params = {
                    TableName: "music",
                    Item: {
                        pk: "song",
                        sk: path.basename(uploadParams.Key, '.mp3'),
                        id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                        type: "song",
                        attributes: {
                            name: path.basename(uploadParams.Key, '.mp3'),
                            s3ey: data.key,
                        }
                    }
                };
                let albumName

                if (arg.albumName) {
                    albumName = arg.albumName
                } else {
                    albumName = "noAlbum"
                }
                var paramsAlbum = {
                    TableName: "music",
                    Item: {
                        pk: "album#" + albumName,
                        sk: "song#" + path.basename(uploadParams.Key, '.mp3'),
                        id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                        type: "song",
                        attributes: {
                            name: path.basename(uploadParams.Key, '.mp3'),
                            s3ey: data.key,
                        }
                    }
                };

                docClient.put(params, (err, data) => {
                    if (err) {
                        event.reply('uploadFileToS3Choose-reply', err);
                    } else {
                        event.reply('uploadFileToS3Choose-reply', "Song Successfully created");
                    }
                });
                docClient.put(paramsAlbum, (err, data) => {
                    if (err) {
                        event.reply('uploadFileToS3Choose-reply', err);
                    } else {
                        event.reply('uploadFileToS3Choose-reply', "Song#Album Successfully created");
                    }
                });
                event.reply('uploadFileToS3-reply', "Upload Success: " + data.Location);
            }
        });
    }
})

ipcMain.on('uploadFileToS3Choose', (event, arg) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var file = arg.filePath;
    let fileType = path.extname(file)

    if (fileType !== '.mp3') {
        event.reply('uploadFileToS3Choose-reply', 'Please give a mp3 file, not a: ' + fileType);
    } else {
        // call S3 to retrieve upload file to specified bucket
        var uploadParams = {Bucket: 'cs493-aws-cli', Key: '', Body: ''};

        // Configure the file stream and obtain the upload parameters
        var fileStream = fs.createReadStream(file);
        fileStream.on('error', (err) => {
            event.reply('uploadFileToS3Choose-reply', err);
        });
        uploadParams.Body = fileStream;
        if (arg.fileName === "") {
            uploadParams.Key = path.basename(file);
        } else {
            if (path.extname(arg.fileName) !== '.mp3') {
                uploadParams.Key = arg.fileName + ".mp3"
            } else {
                uploadParams.Key = arg.fileName
            }
        }

        // call S3 to retrieve upload file to specified bucket
        s3.upload (uploadParams, (err, data) => {
            if (err) {
                event.reply('uploadFileToS3Choose-reply', err);
            }
            if (data) {
                var params = {
                    TableName: "music",
                    Item: {
                        pk: "song",
                        sk: path.basename(uploadParams.Key, '.mp3'),
                        id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                        type: "song",
                        attributes: {
                            name: path.basename(uploadParams.Key, '.mp3'),
                            s3ey: data.key,
                        }
                    }
                };
                let albumName

                if (arg.albumName) {
                    albumName = arg.albumName
                } else {
                    albumName = "noAlbum"
                }
                var paramsAlbum = {
                    TableName: "music",
                    Item: {
                        pk: "album#" + albumName,
                        sk: "song#" + path.basename(uploadParams.Key, '.mp3'),
                        id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                        type: "song",
                        attributes: {
                            name: path.basename(uploadParams.Key, '.mp3'),
                            s3ey: data.key,
                        }
                    }
                };

                docClient.put(params, (err, data) => {
                    if (err) {
                        event.reply('uploadFileToS3Choose-reply', err);
                    } else {
                        event.reply('uploadFileToS3Choose-reply', "Song Successfully created");
                    }
                });
                docClient.put(paramsAlbum, (err, data) => {
                    if (err) {
                        event.reply('uploadFileToS3Choose-reply', err);
                    } else {
                        event.reply('uploadFileToS3Choose-reply', "Song#Album Successfully created");
                    }
                });
                event.reply('uploadFileToS3-reply', "Upload Success: " + data.Location);
            }
        });
    }
})

ipcMain.on('uploadAlbumToS3', (event, arg) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var folder = arg.folderPath;
    let folderName = arg.folderName

    var albumParams = {
        TableName: "music",
        Item: {
            pk: "album",
            sk: folderName,
            id: "album_" + folderName,
            type: "album",
            attributes: {
                name: folderName
            }
        }
    };
    docClient.put(albumParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Album Successfully created");
        }
    });
    let artistName

    if (arg.artistName) {
        artistName = arg.artistName
    } else {
        artistName = "noArtist"
    }

    var artistParams = {
        TableName: "music",
        Item: {
            pk: "artist#" + artistName,
            sk: "album#" + folderName,
            id: "album_" + folderName,
            type: "album",
            attributes: {
                name: folderName
            }
        }
    };
    docClient.put(artistParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
        }
    });

    fs.readdirSync(folder).forEach(fileName => {
        let fileType = path.extname(fileName)

        if (fileType !== ".mp3") {
            event.reply('uploadFileToS3Choose-reply', 'Please give a mp3 file, not a: ' + fileType);
        } else {
            // call S3 to retrieve upload file to specified bucket
            var uploadParams = {Bucket: 'cs493-aws-cli', Key: '', Body: ''};

            // Configure the file stream and obtain the upload parameters
            var fileStream = fs.createReadStream(folder + "/" + fileName);
            fileStream.on('error', (err) => {
                event.reply('uploadFileToS3Choose-reply', err);
            });

            uploadParams.Body = fileStream;
            uploadParams.Key = folderName + "/" + path.basename(fileName);

            // call S3 to retrieve upload file to specified bucket
            s3.upload (uploadParams, (err, data) => {
                if (err) {
                    event.reply('uploadFileToS3Choose-reply', err);
                } if (data) {
                    var params = {
                        TableName: "music",
                        Item: {
                            pk: "song",
                            sk: path.basename(uploadParams.Key, '.mp3'),
                            id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                            type: "song",
                            attributes: {
                                name: path.basename(uploadParams.Key, '.mp3'),
                                s3ey: data.key,
                            }
                        }
                    };
                    var paramsAlbum = {
                        TableName: "music",
                        Item: {
                            pk: "album#" + folderName,
                            sk: "song#" + path.basename(uploadParams.Key, '.mp3'),
                            id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                            type: "song",
                            attributes: {
                                name: path.basename(uploadParams.Key, '.mp3'),
                                s3ey: data.key,
                            }
                        }
                    };
    
                    docClient.put(params, (err, data) => {
                        if (err) {
                            event.reply('uploadFileToS3Choose-reply', err);
                        } else {
                            event.reply('uploadFileToS3Choose-reply', "Song Successfully created");
                        }
                    });
                    docClient.put(paramsAlbum, (err, data) => {
                        if (err) {
                            event.reply('uploadFileToS3Choose-reply', err);
                        } else {
                            event.reply('uploadFileToS3Choose-reply', "Song#Album Successfully created");
                        }
                    });
                    event.reply('uploadFileToS3Choose-reply', "Upload Success: " + data.Location);
                }
            });
        }
    })
})

ipcMain.on('uploadAlbumToS3Choose', (event, arg) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var folder = path.dirname(arg.folderPath);
    let folderName = arg.folderName

    var albumParams = {
        TableName: "music",
        Item: {
            pk: "album",
            sk: folderName,
            id: "album_" + folderName,
            type: "album",
            attributes: {
                name: folderName
            }
        }
    };
    docClient.put(albumParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Album Successfully created");
        }
    });

    let artistName

    if (arg.artistName) {
        artistName = arg.artistName
    } else {
        artistName = "noArtist"
    }

    var artistParams = {
        TableName: "music",
        Item: {
            pk: "artist#" + artistName,
            sk: "album#" + folderName,
            id: "album_" + folderName,
            type: "album",
            attributes: {
                name: folderName
            }
        }
    };
    docClient.put(artistParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
        }
    });

    fs.readdirSync(folder).forEach(fileName => {
        let fileType = path.extname(fileName)

        if (fileType !== ".mp3") {
            event.reply('uploadFileToS3Choose-reply', 'Please give a mp3 file, not a: ' + fileType);
        } else {
            // call S3 to retrieve upload file to specified bucket
            var uploadParams = {Bucket: 'cs493-aws-cli', Key: '', Body: ''};

            // Configure the file stream and obtain the upload parameters
            var fileStream = fs.createReadStream(folder + "/" + fileName);
            fileStream.on('error', (err) => {
                event.reply('uploadFileToS3Choose-reply', err);
            });

            uploadParams.Body = fileStream;
            uploadParams.Key = folderName + "/" + path.basename(fileName);

            // call S3 to retrieve upload file to specified bucket
            s3.upload (uploadParams, (err, data) => {
                if (err) {
                    event.reply('uploadFileToS3Choose-reply', err);
                } if (data) {
                    var params = {
                        TableName: "music",
                        Item: {
                            pk: "song",
                            sk: path.basename(uploadParams.Key, '.mp3'),
                            id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                            type: "song",
                            attributes: {
                                name: path.basename(uploadParams.Key, '.mp3'),
                                s3ey: data.key,
                            }
                        }
                    };
                    var paramsAlbum = {
                        TableName: "music",
                        Item: {
                            pk: "album#" + folderName,
                            sk: "song#" + path.basename(uploadParams.Key, '.mp3'),
                            id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                            type: "song",
                            attributes: {
                                name: path.basename(uploadParams.Key, '.mp3'),
                                s3ey: data.key,
                            }
                        }
                    };
    
                    docClient.put(params, (err, data) => {
                        if (err) {
                            event.reply('uploadFileToS3Choose-reply', err);
                        } else {
                            event.reply('uploadFileToS3Choose-reply', "Song Successfully created");
                        }
                    });
                    docClient.put(paramsAlbum, (err, data) => {
                        if (err) {
                            event.reply('uploadFileToS3Choose-reply', err);
                        } else {
                            event.reply('uploadFileToS3Choose-reply', "Song#Album Successfully created");
                        }
                    });
                    event.reply('uploadFileToS3Choose-reply', "Upload Success: " + data.Location);
                }
            });
        }
    })
})

ipcMain.on('uploadArtistToS3', (event, arg) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var artist = arg.folderPath;
    let artistName = arg.folderName

    var artistParams = {
        TableName: "music",
        Item: {
            pk: "artist",
            sk: artistName,
            id: "artist_" + artistName,
            type: "artist",
            attributes: {
                name: artistName
            }
        }
    };
    docClient.put(artistParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
        }
    });
    let genre
    if (arg.genreName) {
        genre = arg.genreName
    } else {
        genre = "noGenre"
    }

    var genreParams = {
        TableName: "music",
        Item: {
            pk: "genre#" + genre,
            sk: "artist#" + artistName,
            id: "artist_" + artistName,
            type: "artist",
            attributes: {
                name: artistName
            }
        }
    };
    docClient.put(genreParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
        }
    });

    fs.readdirSync(artist).forEach(originalFolderName => {
        let folderName = artist + "/" + originalFolderName

        var albumParams = {
            TableName: "music",
            Item: {
                pk: "album",
                sk: originalFolderName,
                id: "album_" + originalFolderName,
                type: "album",
                attributes: {
                    name: originalFolderName
                }
            }
        };
        docClient.put(albumParams, (err, data) => {
            if (err) {
                event.reply('uploadFileToS3Choose-reply', err);
            } else {
                event.reply('uploadFileToS3Choose-reply', "Album Successfully created");
            }
        });
    
        var artistParams = {
            TableName: "music",
            Item: {
                pk: "artist#" + artistName,
                sk: "album#" + originalFolderName,
                id: "album_" + originalFolderName,
                type: "album",
                attributes: {
                    name: originalFolderName
                }
            }
        };
        docClient.put(artistParams, (err, data) => {
            if (err) {
                event.reply('uploadFileToS3Choose-reply', err);
            } else {
                event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
            }
        });

        fs.readdirSync(folderName).forEach(fileName => {
            let fileType = path.extname(fileName)

            if (fileType !== ".mp3") {
                event.reply('uploadFileToS3Choose-reply', 'Please give a mp3 file, not a: ' + fileType);
            } else {
                // call S3 to retrieve upload file to specified bucket
                var uploadParams = {Bucket: 'cs493-aws-cli', Key: '', Body: ''};

                // Configure the file stream and obtain the upload parameters
                var fileStream = fs.createReadStream(folderName + "/" + fileName);
                fileStream.on('error', (err) => {
                    event.reply('uploadFileToS3Choose-reply', err);
                });

                uploadParams.Body = fileStream;
                uploadParams.Key = artistName + "/" + originalFolderName + "/" + path.basename(fileName);

                // call S3 to retrieve upload file to specified bucket
                s3.upload (uploadParams, (err, data) => {
                    if (err) {
                        event.reply('uploadFileToS3Choose-reply', err);
                    } if (data) {
                        var params = {
                            TableName: "music",
                            Item: {
                                pk: "song",
                                sk: path.basename(uploadParams.Key, '.mp3'),
                                id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                                type: "song",
                                attributes: {
                                    name: path.basename(uploadParams.Key, '.mp3'),
                                    s3ey: data.key,
                                }
                            }
                        };
                        var paramsAlbum = {
                            TableName: "music",
                            Item: {
                                pk: "album#" + originalFolderName,
                                sk: "song#" + path.basename(uploadParams.Key, '.mp3'),
                                id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                                type: "song",
                                attributes: {
                                    name: path.basename(uploadParams.Key, '.mp3'),
                                    s3ey: data.key,
                                }
                            }
                        };
        
                        docClient.put(params, (err, data) => {
                            if (err) {
                                event.reply('uploadFileToS3Choose-reply', err);
                            } else {
                                event.reply('uploadFileToS3Choose-reply', "Song Successfully created");
                            }
                        });
                        docClient.put(paramsAlbum, (err, data) => {
                            if (err) {
                                event.reply('uploadFileToS3Choose-reply', err);
                            } else {
                                event.reply('uploadFileToS3Choose-reply', "Song#Album Successfully created");
                            }
                        });
                        event.reply('uploadFileToS3Choose-reply', "Upload Success: " + data.Location);
                    }
                });
            }
        })
    })
})

ipcMain.on('uploadArtistToS3Choose', (event, arg) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var artist = path.dirname(arg.folderPath);
    let artistName = arg.folderName

    var artistParams = {
        TableName: "music",
        Item: {
            pk: "artist",
            sk: artistName,
            id: "artist_" + artistName,
            type: "artist",
            attributes: {
                name: artistName
            }
        }
    };
    docClient.put(artistParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
        }
    });
    let genre
    if (arg.genreName) {
        genre = arg.genreName
    } else {
        genre = "noGenre"
    }

    var genreParams = {
        TableName: "music",
        Item: {
            pk: "genre#" + genre,
            sk: "artist#" + artistName,
            id: "artist_" + artistName,
            type: "artist",
            attributes: {
                name: artistName
            }
        }
    };
    docClient.put(genreParams, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
        }
    });

    fs.readdirSync(artist).forEach(originalFolderName => {
        let folderName = artist + "/" + originalFolderName
        if (originalFolderName === ".DS_Store") {
            // nothing
        } else {
            var albumParams = {
                TableName: "music",
                Item: {
                    pk: "album",
                    sk: originalFolderName,
                    id: "album_" + originalFolderName,
                    type: "album",
                    attributes: {
                        name: originalFolderName
                    }
                }
            };
            docClient.put(albumParams, (err, data) => {
                if (err) {
                    event.reply('uploadFileToS3Choose-reply', err);
                } else {
                    event.reply('uploadFileToS3Choose-reply', "Album Successfully created");
                }
            });
        
            var artistParams = {
                TableName: "music",
                Item: {
                    pk: "artist#" + artistName,
                    sk: "album#" + originalFolderName,
                    id: "album_" + originalFolderName,
                    type: "album",
                    attributes: {
                        name: originalFolderName
                    }
                }
            };
            docClient.put(artistParams, (err, data) => {
                if (err) {
                    event.reply('uploadFileToS3Choose-reply', err);
                } else {
                    event.reply('uploadFileToS3Choose-reply', "Artist#Album Successfully created");
                }
            });
            fs.readdirSync(folderName).forEach(fileName => {
                let fileType = path.extname(fileName)

                if (fileType !== ".mp3") {
                    event.reply('uploadFileToS3Choose-reply', 'Please give a mp3 file, not a: ' + fileType);
                } else {
                    // call S3 to retrieve upload file to specified bucket
                    var uploadParams = {Bucket: 'cs493-aws-cli', Key: '', Body: ''};

                    // Configure the file stream and obtain the upload parameters
                    var fileStream = fs.createReadStream(folderName + "/" + fileName);
                    fileStream.on('error', (err) => {
                        event.reply('uploadFileToS3Choose-reply', err);
                    });

                    uploadParams.Body = fileStream;
                    uploadParams.Key = artistName + "/" + originalFolderName + "/" + path.basename(fileName);

                    // call S3 to retrieve upload file to specified bucket
                    s3.upload (uploadParams, (err, data) => {
                        if (err) {
                            event.reply('uploadFileToS3Choose-reply', err);
                        } if (data) {
                            var params = {
                                TableName: "music",
                                Item: {
                                    pk: "song",
                                    sk: path.basename(uploadParams.Key, '.mp3'),
                                    id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                                    type: "song",
                                    attributes: {
                                        name: path.basename(uploadParams.Key, '.mp3'),
                                        s3ey: data.key,
                                    }
                                }
                            };
                            var paramsAlbum = {
                                TableName: "music",
                                Item: {
                                    pk: "album#" + originalFolderName,
                                    sk: "song#" + path.basename(uploadParams.Key, '.mp3'),
                                    id: "song_" + path.basename(uploadParams.Key, '.mp3'),
                                    type: "song",
                                    attributes: {
                                        name: path.basename(uploadParams.Key, '.mp3'),
                                        s3ey: data.key,
                                    }
                                }
                            };
            
                            docClient.put(params, (err, data) => {
                                if (err) {
                                    event.reply('uploadFileToS3Choose-reply', err);
                                } else {
                                    event.reply('uploadFileToS3Choose-reply', "Song Successfully created");
                                }
                            });
                            docClient.put(paramsAlbum, (err, data) => {
                                if (err) {
                                    event.reply('uploadFileToS3Choose-reply', err);
                                } else {
                                    event.reply('uploadFileToS3Choose-reply', "Song#Album Successfully created");
                                }
                            });
                            event.reply('uploadFileToS3Choose-reply', "Upload Success: " + data.Location);
                        }
                    });
                }
            })
        }   
    })
})

ipcMain.on('createGenre', (event, arg) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    const genre = arg.genreName.toLowerCase()

    var params = {
        TableName: "music",
        Item: {
            pk: "genre",
            sk: genre,
            id: "genre_" + genre,
            type: "genre",
            attributes: {
                name: genre
            }
        }
    };

    docClient.put(params, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Genre Successfully created");
        }
    });
})

ipcMain.on('updateGenre', (event, arg) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    const oldGenre = arg.oldGenre.toLowerCase()
    const newGenre = arg.newGenre.toLowerCase()

    var deleteGenre = {
        TableName: "music",
        Key:{
            "pk": "genre",
            "sk": oldGenre
        }
    };
    var createGenre = {
        TableName: "music",
        Item: {
            pk: "genre",
            sk: newGenre,
            id: "genre_" + newGenre,
            type: "genre",
            attributes: {
                name: newGenre
            }
        }
    };
    var getArtist = {
        TableName : "music",
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames:{
            "#pk": "pk"
        },
        ExpressionAttributeValues: {
            ":pk": "genre#" + oldGenre
        }
    };
    var deleteArtist = {
        TableName: "music",
        Key:{
            "pk": "genre#" + oldGenre,
        }
    };

    docClient.query(getArtist, function(err, data) {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
          data.Items.forEach((genreArtist) => {
            var createArtist = {
                TableName: "music",
                Item: {
                    pk: "genre#" + newGenre,
                    sk: genreArtist.sk,
                    id: genreArtist.id,
                    type: "artist",
                    attributes: genreArtist.attributes
                }
            };
            var deleteArtist = {
                TableName: "music",
                Key:{
                    "pk": "genre#" + oldGenre,
                    "sk": genreArtist.sk,
                }
            };
            docClient.put(createArtist, (err, data) => {
                if (err) {
                    event.reply('uploadFileToS3Choose-reply', err);
                } else {
                    event.reply('uploadFileToS3Choose-reply', "Genre Successfully created");
                }
            });
            docClient.delete(deleteArtist, function(err, data) {
                if (err) {
                    event.reply('uploadFileToS3Choose-reply', err);
                } else {
                    event.reply('uploadFileToS3Choose-reply', "Genre Successfully Updated");
                }
            });
          })
        }
      });

    docClient.delete(deleteGenre, function(err, data) {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Genre Successfully Updated");
        }
    });
    docClient.put(createGenre, (err, data) => {
        if (err) {
            event.reply('uploadFileToS3Choose-reply', err);
        } else {
            event.reply('uploadFileToS3Choose-reply', "Genre Successfully created");
        }
    });
})