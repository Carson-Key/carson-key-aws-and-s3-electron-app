import React, { useState,useEffect } from 'react'
import SongUpdate from '../../pages/SongUpdate'
import AlbumUpdate from '../../pages/AlbumUpdate'
import ArtistUpdate from '../../pages/ArtistUpdate'
import GenreUpdate from '../../pages/GenreUpdate'

function PageRoute() {
    const [currentPage, setCurrentPage] = useState("Genre")
    const [currentPageComponent, setCurrentPageComponent] = useState(<GenreUpdate />)
    const [activeTab, setActiveTab] = useState([" bg-white text-black", "", "", ""])

    useEffect(() => {
        if (currentPage === "Song") {
            setCurrentPageComponent(<SongUpdate />)
            setActiveTab(["", "", "", " bg-white text-black"])
        } else if (currentPage === "Artist") {
            setCurrentPageComponent(<ArtistUpdate />)
            setActiveTab(["", " bg-white text-black", "", ""])
        } else if (currentPage === "Album") {
            setCurrentPageComponent(<AlbumUpdate />)
            setActiveTab(["", "", " bg-white text-black", ""])
        } else if (currentPage === "Genre") {
            setCurrentPageComponent(<GenreUpdate />)
            setActiveTab([" bg-white text-black", "", "", ""])
        } else {
            setCurrentPageComponent(<GenreUpdate />)
            setActiveTab([" bg-white text-black", "", "", ""])
        }
    }, [currentPage])

    return (
        <div className="mt-4 mx-3">
            <div className="mt-4 flex divide-x divide-white justify-center">
                <button onClick={() => {setCurrentPage("Genre")}} className={"px-3 py-1 mb-2" + activeTab[0]}>Genre</button>
                <br />
                <button onClick={() => {setCurrentPage("Artist")}} className={"px-3 py-1 mb-2" + activeTab[1]}>Artist</button>
                <br />
                <button onClick={() => {setCurrentPage("Album")}} className={"px-3 py-1 mb-2" + activeTab[2]}>Album</button>
                <br />
                <button onClick={() => {setCurrentPage("Song")}} className={"px-3 py-1 mb-2" + activeTab[3]}>Song</button>
            </div>
            <div>
                {currentPageComponent}
            </div>
        </div>
    );
}

export default PageRoute;