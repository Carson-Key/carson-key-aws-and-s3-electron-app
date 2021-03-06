import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron');

function UpdateGenre() {
    const [oldGenre, setOldGenre] = useState("")
    const [newGenre, setNewGenre] = useState("")

    const handleUpdateGenre = () => {
        if (oldGenre !== "" && newGenre !== "") {
            ipcRenderer.send('updateGenre', {oldGenre, newGenre})
        }
    }

    return (
        <div className="mt-4 mx-3">
            <p>Update Genre</p>
            <div className="ml-4 mb-6">
                <p>Old Genre Name</p>
                <input
                    id="oldGenreName"
                    className="text-black px-2"
                    onChange={(event) => {setOldGenre(event.target.value)}}
                    placeholder="Old Genre"
                />
            </div>
            <div className="ml-4 mb-6">
                <p>New Genre Name</p>
                <input
                    id="newGenreName"
                    className="text-black px-2"
                    onChange={(event) => {setNewGenre(event.target.value)}}
                    placeholder="New Genre"
                />
            </div>
            <button className="bg-blue-400 mx-5 px-3 py-1 rounded" onClick={handleUpdateGenre}>submit</button>
        </div>
    )
}

export default UpdateGenre