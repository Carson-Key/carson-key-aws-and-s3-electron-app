import React, { useEffect } from 'react'
import PageRoute from './components/PageRoute'
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
    ipcRenderer.on('uploadAlbumToS3-reply', (event, arg) => {
      console.log(arg)
    })
  }, [])

  return (
    <div className="bg-gray-800 w-screen h-screen top-0 absolute text-white">
      <PageRoute />
    </div>
  );
}

export default App;