import React, { useEffect, useState } from 'react'
import './assets/main.css'

const { ipcRenderer } = window.require('electron');

function App() {
  const [awsProfile, setAwsProfile] = useState("")

  const handleSetAWSProfile = () => {
    if (awsProfile !== "") {
      ipcRenderer.send('setAWSCreds', awsProfile)
    }
  }

  useEffect(() => {
    ipcRenderer.on('getS3Buckets-reply', (event, arg) => {
      console.log(arg)
    })
  })

  return (
    <div>
      <div className="mt-4 mx-3">
        <input
          onChange={(event) => {setAwsProfile(event.target.value)}}
          placeholder={"AWS Profile"}
        />
        <button className="bg-blue-400 text-white mx-5 px-3 py-1 rounded" onClick={handleSetAWSProfile}>submit</button>
      </div>
      <div className="mt-4 mx-3">
        <button className="bg-blue-400 text-white px-3 py-1 rounded" onClick={() => {ipcRenderer.send('getS3Buckets', awsProfile)}}>s3</button>
      </div>
    </div>
  );
}

export default App;
