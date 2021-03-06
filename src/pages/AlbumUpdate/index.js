import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function SetAWSProfile() {
    const [awsProfile, setAwsProfile] = useState("")

    const handleSetAWSProfile = () => {
        if (awsProfile !== "") {
            ipcRenderer.send('setAWSCreds', awsProfile)
            ipcRenderer.send('getAWSProfile')
        }
    }

    return (
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
    )
}

export default SetAWSProfile