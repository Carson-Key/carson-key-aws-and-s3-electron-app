import React, { useState,useEffect } from 'react'
import SetAWSProfile from '../../pages/SetAWSProfile'
import ChooseFilePath from '../../pages/ChooseFilePath'
import ChooseFile from '../../pages/ChooseFile'
import Details from '../../pages/Details'

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
                    <button onClick={() => {setCurrentPage("SetAWSProfile")}} className="ml-4 bg-white ml-4 px-3 py-1 text-black mb-2">Set AWS Profile</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadPath")}} className="ml-4 bg-white ml-4 px-3 py-1 text-black mb-2">Upload File (Path)</button>
                    <br />
                    <button onClick={() => {setCurrentPage("UploadFile")}} className="ml-4 bg-white ml-4 px-3 py-1 text-black mb-2">Upload File (Choose)</button>
                </div>
            </div>
            <div>
                {currentPageComponent}
            </div>
        </div>
    );
}

export default PageRoute;