import React, { useEffect } from 'react'
import SetAWSProfile from './pages/SetAWSProfile'
import ChooseFilePath from './pages/ChooseFilePath'
import ChooseFile from './pages/ChooseFile'
import Details from './pages/Details'
import './assets/main.css'

const { ipcRenderer } = window.require('electron');

function App() {

  useEffect(() => {
    ipcRenderer.on('getAWSProfile-reply', (event, arg) => {
      console.log("changed profile to: " + arg)
    })
    ipcRenderer.on('uploadFileToS3-reply', (event, arg) => {
      console.log(arg)
    })
    ipcRenderer.on('uploadFileToS3Choose-reply', (event, arg) => {
      console.log(arg)
    })
  }, [])

  return (
    <div className="bg-gray-800 w-screen h-screen top-0 absolute text-white">
      <div className="flex justify-around">
        <div className="mt-4">
          <Details />
        </div>
        <div>
          <SetAWSProfile />
          <ChooseFilePath />
          <ChooseFile />
        </div>
      </div>
    </div>
  );
}

export default App;