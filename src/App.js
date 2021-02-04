import React, { useEffect, useState } from 'react'
import './assets/main.css'

const { ipcRenderer } = window.require('electron');

function App() {
  const [awsProfile, setAwsProfile] = useState("")
  const [filePath, setFilePath] = useState("")
  const [fileName, setFileName] = useState("")
  const [awsProfileReturned, setAwsProfileReturned] = useState("defualt")

  const handleSetAWSProfile = () => {
    if (awsProfile !== "") {
      ipcRenderer.send('setAWSCreds', awsProfile)
      ipcRenderer.send('getAWSProfile')
    }
  }
  const handleS3FileUpload = () => {
    if (filePath !== "") {
      ipcRenderer.send('uploadFileToS3', {filePath: filePath, fileName: fileName})
    }
  }

  useEffect(() => {
    ipcRenderer.on('getAWSProfile-reply', (event, arg) => {
      setAwsProfileReturned(arg)
    })
    ipcRenderer.on('uploadFileToS3-reply', (event, arg) => {
      console.log(arg)
    })
  }, [])

  return (
    <div className="bg-gray-800 w-screen h-screen top-0 absolute text-white">
      <div className="flex justify-around">
        <div className="mt-4">
          <div>
            <p className="font-bold">Current AWS Profile:</p><p className="ml-4">{" " + awsProfileReturned}</p>
          </div>
        </div>
        <div>
          <div className="mt-4 mx-3">
            <p>Set AWS Profile Used</p>
            <input
              id="awsProfile"
              className="text-black px-2 ml-4"
              onChange={(event) => {setAwsProfile(event.target.value)}}
              placeholder="AWS Profile"
            />
            <button className="bg-blue-400 mx-5 px-3 py-1 rounded" onClick={handleSetAWSProfile}>submit</button>
          </div>
          <div className="mt-4 mx-3">
            <p className="mb-4">Upload File to S3</p>
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
              <p>Path of File (assume from root of project)</p>
              <input
                id="filePath"
                className="text-black px-2"
                onChange={(event) => {setFilePath(event.target.value)}}
                placeholder="Filepath"
              />
            </div>
            <button className="bg-blue-400 ml-4 px-3 py-1 rounded" onClick={handleS3FileUpload}>submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
