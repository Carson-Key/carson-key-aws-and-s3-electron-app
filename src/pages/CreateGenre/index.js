import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function AlbumPath() {
    const [genreName, setGenreName] = useState("")

    const createGenre = () => {
        if (genreName !== "" && genreName !== "") {
            ipcRenderer.send('createGenre', {genreName: genreName})
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p className="mb-4">Create Genre</p>
            <div className="ml-4 mb-6">
                <p>Genre Name</p>
                <input
                    id="fileName"
                    className="text-black px-2"
                    onChange={(event) => {setGenreName(event.target.value)}}
                    placeholder="Name"
                />
            </div>
            <button className="bg-blue-400 ml-4 px-3 py-1 rounded" onClick={createGenre}>submit</button>
        </div>
    )
}

export default AlbumPath