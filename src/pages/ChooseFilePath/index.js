import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function ChooseFilePath() {
    const [fileName, setFileName] = useState("")
    const [filePath, setFilePath] = useState("")
    const [album, setAlbum] = useState("")

    const handleS3FileUpload = () => {
        if (filePath !== "") {
            ipcRenderer.send('uploadFileToS3', {filePath: filePath, fileName: fileName, albumName: album})
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p className="mb-4">Upload MP3 to S3</p>
            <div className="ml-4 mb-6">
                <p>New File Name For s3 (leave blank to keep original file name)</p>
                <input
                    id="fileName"
                    className="text-black px-2"
                    onChange={(event) => {setFileName(event.target.value)}}
                    placeholder="Name"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>Album Name (if no album, leave blank)</p>
                <input
                    id="albumName"
                    className="text-black px-2"
                    onChange={(event) => {setAlbum(event.target.value)}}
                    placeholder="Album"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>Path of MP3 (assume from root of project)</p>
                <input
                    id="filePath"
                    className="text-black px-2"
                    onChange={(event) => {setFilePath(event.target.value)}}
                    placeholder="Filepath"
                />
            </div>
            <button className="bg-blue-400 ml-4 px-3 py-1 rounded" onClick={handleS3FileUpload}>submit</button>
        </div>
    )
}

export default ChooseFilePath