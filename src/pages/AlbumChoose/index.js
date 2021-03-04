import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function AlbumChoose() {
    const [folderName, setFolderName] = useState("")
    const [folderPath, setFolderPath] = useState("")
    const [artist, setArtist] = useState("")

    const handleFolder = (event) => {
        setFolderPath(event.target.files[0]);
    }
    const handleS3FolderUpload = () => {
        if (folderPath !== "" && folderName !== "") {
            ipcRenderer.send('uploadAlbumToS3Choose', {
                folderPath: folderPath.path, folderName: folderName, artistName: artist
            })
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p className="mb-4">Upload Album to S3</p>
            <div className="ml-4 mb-6">
                <p>New Folder Name For s3</p>
                <input
                    id="fileName"
                    className="text-black px-2"
                    onChange={(event) => {setFolderName(event.target.value)}}
                    placeholder="Name"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>Artist Name (Leave Blank if no Artist)</p>
                <input
                    id="artistName"
                    className="text-black px-2"
                    onChange={(event) => {setArtist(event.target.value)}}
                    placeholder="Artist"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>Path of Folder of MP3s (assume from root of project)</p>
                <input directory="" webkitdirectory="" type="file" onChange={handleFolder} />
            </div>
            <button className="bg-blue-400 ml-4 px-3 py-1 rounded" onClick={handleS3FolderUpload}>submit</button>
        </div>
    )
}

export default AlbumChoose