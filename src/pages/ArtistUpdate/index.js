import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function ArtistUpdate() {
    const [oldArtist, setOldArtist] = useState("")
    const [newArtist, setNewArtist] = useState("")

    const handleUpdateArtist = () => {
        if (oldArtist !== "" && newArtist !== "") {
            ipcRenderer.send('updateArtist', {oldArtist, newArtist})
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p>Update Artist</p>
            <div className="ml-4 mb-6">
                <p>Old Artist Name</p>
                <input
                    id="oldArtistName"
                    className="text-black px-2"
                    onChange={(event) => {setOldArtist(event.target.value)}}
                    placeholder="Old Artist"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>New Artist Name</p>
                <input
                    id="newArtistName"
                    className="text-black px-2"
                    onChange={(event) => {setNewArtist(event.target.value)}}
                    placeholder="New Artist"
                />
            </div>
            <button className="bg-blue-400 mx-5 px-3 py-1 rounded" onClick={handleUpdateArtist}>submit</button>
        </div>
    )
}

export default ArtistUpdate