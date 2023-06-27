import React, { useEffect, useState } from 'react'
import Avatar from "react-avatar-edit";
import axios from 'axios'

export default function ProfilePictureEdit(props) {

    const [src, setSrc] = useState(false);

    const [preview, setPreview] = useState();

    const [store, setStore] = useState();

    const [conform, setConform] = useState(false);

    const [sure, setSure] = useState(false)

    const [user, setUser] = useState([]);

    const currentuser = () => {
        setUser(props.user)
    }

    const updateImgUrl = () => {
        axios.put("http://localhost:8083/user/", {
            "userEmail": localStorage.getItem("currentuser"),
            "userName": user.userName,
            "mobileNumber": user.mobileNumber,
            "profileImgUrl": store
        }).then(a => {
            window.location.reload();
        })
    }

    const onClose = () => {
        setPreview(null);
    }

    const onCrop = (view) => {
        setPreview(view);
        setStore(preview)
    }

    const toggle = () => {
        var blur = document.getElementById("blur");
        blur.classList.toggle('actives');
    }

    useEffect(() => {
        currentuser();
    }, [])

    return (
        <div className='container-fluid'>
            {conform &&
                <div className="border border-info p-2 m-1 my-4">
                    <h5>Do you want to update your profile?</h5>
                    <div className="d-flex justify-content-end gap-4">
                        <a className="btn btnm yes btn-success" onClick={() => {
                            if (conform == true) {
                                setConform(false);
                                updateImgUrl()
                                return (setConform(false), toggle())
                            }
                        }
                        } data-bs-dismiss="modal">Yes </a>
                        <a className="btn btnm yes btn-danger" style={{ background: "red" }} onClick={() => { return (setConform(false), toggle()) }} data-bs-dismiss="modal">No </a>
                    </div>
                </div>}

            {sure && <div className="border border-info p-2 m-1 my-4">
                <h5>Do you want to remove your profile picture?</h5>
                <div className="d-flex justify-content-end ">
                    <a className="btn btnm yes btn-danger " style={{ marginLeft: "40%", textAlign: "center" }} onClick={() => { { localStorage.removeItem("profile", store) } return (setSure(false), toggle(), setStore(""), updateImgUrl()) }} data-bs-dismiss="modal">Yes </a>
                    <a className="btn btnm yes btn-success " style={{ marginLeft: "4%", textAlign: "center" }} onClick={() => { return (setSure(false), toggle()) }} data-bs-dismiss="modal">No </a>
                </div>
            </div>}

            <div id='blur'>
                <div className='profile container-xxl margin-top'>
                    <div className='account'>
                        <div style={{ textAlign: "center" }}>
                            <h3 >Profile Picture edit</h3><br />
                            {src ?
                                <div className="Avatar" style={{ color: "white" }}>
                                    <div className='arrowdown'><h2 className='arrowdownh2'>&darr;</h2></div>
                                    <Avatar width="50" height="200" onCrop={onCrop} onClose={onClose} >Choose File</Avatar>
                                    {preview ?
                                        <>
                                            <img src={preview} /><br /><br></br>
                                            <div className='justify-content-between d-flex'>
                                                <button className="but-active btn btn-success" onClick={() => { return (setConform(true), toggle()) }}>Update</button>
                                                <button className="but-active btn btn-danger" onClick={() => { return (setSure(true), toggle()) }}>Remove </button>
                                                <button type="button" onClick={() => { setSrc(false) }} className="but-active btn btn-info">Go back</button>
                                            </div>
                                        </>
                                        :
                                        <button type="button" onClick={() => { setSrc(false) }} className="but-active btn btn-info">Go back</button>
                                    }
                                </div>
                                :
                                <div className='modal-footer justify-content-around'>
                                    <button onClick={() => { setSrc(true) }} type="button" className="but-active btn btn-primary">Add/Edit</button>
                                    <button className="but-active btn btn-danger" onClick={() => { return (setSure(true), toggle()) }}>Remove picture</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>}
                        </div><br />
                    </div>
                </div>
            </div>
        </div>
    )

}
