import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function AlbumUpdate() {
    const [oldAlbum, setOldAlbum] = useState("")
    const [newAlbum, setNewAlbum] = useState("")

    const handleUpdateAlbum = () => {
        if (oldAlbum !== "" && newAlbum !== "") {
            ipcRenderer.send('updateAlbum', {oldAlbum, newAlbum})
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p>Update Album</p>
            <div className="ml-4 mb-6">
                <p>Old Album Name</p>
                <input
                    id="oldAlbumName"
                    className="text-black px-2"
                    onChange={(event) => {setOldAlbum(event.target.value)}}
                    placeholder="Old Album"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>New Album Name</p>
                <input
                    id="newAlbumName"
                    className="text-black px-2"
                    onChange={(event) => {setNewAlbum(event.target.value)}}
                    placeholder="New Album"
                />
            </div>
            <button className="bg-blue-400 mx-5 px-3 py-1 rounded" onClick={handleUpdateAlbum}>submit</button>
        </div>
    )
}

export default AlbumUpdate