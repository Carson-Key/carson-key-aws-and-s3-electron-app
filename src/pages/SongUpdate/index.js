import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function SongUpdate() {
    const [oldSong, setOldSong] = useState("")
    const [newSong, setNewSong] = useState("")

    const handleUpdateSong = () => {
        if (oldSong !== "" && newSong !== "") {
            ipcRenderer.send('updateSong', {oldSong, newSong})
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p>Update Album</p>
            <div className="ml-4 mb-6">
                <p>Old Song Name</p>
                <input
                    id="oldSongName"
                    className="text-black px-2"
                    onChange={(event) => {setOldSong(event.target.value)}}
                    placeholder="Old Song"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>New Song Name</p>
                <input
                    id="newSongName"
                    className="text-black px-2"
                    onChange={(event) => {setNewSong(event.target.value)}}
                    placeholder="New Song"
                />
            </div>
            <button className="bg-blue-400 mx-5 px-3 py-1 rounded" onClick={handleUpdateSong}>submit</button>
        </div>
    )
}

export default SongUpdate