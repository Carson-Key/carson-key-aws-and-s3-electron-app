import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function ChooseFile() {
    const [fileName, setFileName] = useState("")
    const [file, setFile] = React.useState("");

    const handleUpload = (event) => {
        setFile(event.target.files[0]);
    }
    
    const handleChooseFileUpload = () => {
        if (file !== "") {
            ipcRenderer.send('uploadFileToS3Choose', {filePath: file.path, fileName: fileName})
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p className="mb-4">Upload MP3 to S3</p>
            <div className="ml-4 mb-6">
                <p>New File Name For s3 (leave blank to keep original file name)</p>
                <input
                    id="fileNameTwo"
                    className="text-black px-2"
                    onChange={(event) => {setFileName(event.target.value)}}
                    placeholder="Name"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>choose MP3 File</p>
                <input type="file" onChange={handleUpload} />
            </div>
            <button className="bg-blue-400 ml-4 px-3 py-1 rounded" onClick={handleChooseFileUpload}>submit</button>
        </div>
    )
}

export default ChooseFile