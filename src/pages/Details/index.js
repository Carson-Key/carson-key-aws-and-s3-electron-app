import React, { useState, useEffect } from 'react'

const { ipcRenderer } = window.require('electron');

function Details() {
    const [awsProfile, setAwsProfile] = useState("default")

    useEffect(() => {
        ipcRenderer.on('getAWSProfile-reply', (event, arg) => {
            setAwsProfile(arg)
        })
      }, [])

    return (
        <div>
            <p className="font-bold">Current AWS Profile:</p><p className="ml-4">{" " + awsProfile}</p>
        </div>
    )
}

export default Details