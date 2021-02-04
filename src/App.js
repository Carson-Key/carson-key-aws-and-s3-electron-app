import React, { useEffect, useState } from 'react'
import './assets/main.css'

const { ipcRenderer } = window.require('electron');

function App() {
  const [awsProfile, setAwsProfile] = useState("")
  const [awsProfileReturned, setAwsProfileReturned] = useState("defualt")

  const handleSetAWSProfile = () => {
    if (awsProfile !== "") {
      ipcRenderer.send('setAWSCreds', awsProfile)
      ipcRenderer.send('getAWSProfile')
    }
  }

  useEffect(() => {
    ipcRenderer.on('getAWSProfile-reply', (event, arg) => {
      setAwsProfileReturned(arg)
    })
  }, [])

  return (
    <div className="bg-gray-800 w-screen h-screen top-0 absolute">
      <div className="flex justify-around">
        <div className="mt-4 text-white">
          <div>
            <p className="font-bold">Current AWS Profile:</p><p className="ml-4">{" " + awsProfileReturned}</p>
          </div>
        </div>
        <div>
          <div className="mt-4 mx-3">
            <input
              onChange={(event) => {setAwsProfile(event.target.value)}}
              placeholder={"AWS Profile"}
            />
            <button className="bg-blue-400 text-white mx-5 px-3 py-1 rounded" onClick={handleSetAWSProfile}>submit</button>
          </div>
          <div className="mt-4 mx-3">
            <button className="bg-blue-400 text-white px-3 py-1 rounded" onClick={() => {ipcRenderer.send('getAWSProfile', awsProfile)}}>Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
