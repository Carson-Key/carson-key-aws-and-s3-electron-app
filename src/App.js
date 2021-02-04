import React, { useEffect, useState } from 'react'
import './App.css';
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
      <input
        onChange={(event) => {setAwsProfile(event.target.value)}}
        placeholder={"AWS Profile"}
      />
      <button onClick={handleSetAWSProfile}>submit</button>
      <button onClick={() => {ipcRenderer.send('getS3Buckets', awsProfile)}}>s3</button>
    </div>
  );
}

export default App;
