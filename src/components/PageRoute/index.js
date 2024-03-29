import React, { useState,useEffect } from 'react'
import SetAWSProfile from '../../pages/SetAWSProfile'
import ChooseFilePath from '../../pages/ChooseFilePath'
import ChooseFile from '../../pages/ChooseFile'
import Details from '../../pages/Details'
import AlbumPath from '../../pages/AlbumPath'
import AlbumChoose from '../../pages/AlbumChoose'
import ArtistPath from '../../pages/ArtistPath'
import ArtistChoose from '../../pages/ArtistChoose'
import CreateGenre from '../../pages/CreateGenre'
import UpdateTabs from '../UpdateTabs'

function PageRoute() {
    const [currentPage, setCurrentPage] = useState("SetAWSProfile")
    const [currentPageComponent, setCurrentPageComponent] = useState(<SetAWSProfile />)

    useEffect(() => {
        if (currentPage === "SetAWSProfile") {
            setCurrentPageComponent(<SetAWSProfile />)
        } else if (currentPage === "UploadPath") {
            setCurrentPageComponent(<ChooseFilePath />)
        } else if (currentPage === "UploadFile") {
            setCurrentPageComponent(<ChooseFile />)
        } else if (currentPage === "UploadAlbumPath") {
            setCurrentPageComponent(<AlbumPath />)
        } else if (currentPage === "UploadAlbumChoose") {
            setCurrentPageComponent(<AlbumChoose />)
        } else if (currentPage === "UploadArtistPath") {
            setCurrentPageComponent(<ArtistPath />)
        } else if (currentPage === "UploadArtistChoose") {
            setCurrentPageComponent(<ArtistChoose />)
        } else if (currentPage === "CreateGenre") {
            setCurrentPageComponent(<CreateGenre />)
        } else if (currentPage === "UpdateDynamo") {
            setCurrentPageComponent(<UpdateTabs />)
        } else {
            setCurrentPageComponent(<SetAWSProfile />)
        }
    }, [currentPage])

    return (
        <div className="flex justify-around">
            <div className="mt-4">
                <Details />
                <div>
                    <p className="font-bold mt-4 mb-1">Navigation</p>
                    <button onClick={() => {setCurrentPage("SetAWSProfile")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Set AWS Profile</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadPath")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Upload MP3 (Path)</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadFile")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Upload MP3 (Choose)</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadAlbumPath")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Upload Album (Path)</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadAlbumChoose")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Upload Album (Choose)</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadArtistPath")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Upload Artist (Path)</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadArtistChoose")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Upload Artist (Choose)</button>
                    <br />
                    <button onClick={() => {setCurrentPage("CreateGenre")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Create Genre</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UpdateDynamo")}} className="ml-4 bg-white px-3 py-1 text-black mb-2">Update Dynamo</button>
                </div>
            </div>
            <div>
                {currentPageComponent}
            </div>
        </div>
    );
}

export default PageRoute;