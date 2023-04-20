import React, { useEffect, useState } from 'react'
import "../Mobiles/Mob.css";
import axios from "axios";
import View from '../View/View';
import { Link } from 'react-router-dom';

export default function MobileLog(props) {

    const [mobiles, setMobiles] = useState([]);

    const [info, setInfo] = useState("");

    const [showToast, setShowToast] = useState(false);

    const fetch = () => {
        axios.get("http://localhost:8083/items/")
            .then((res) => { return (setMobiles(res.data)) })
    }

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    const check = () => {
        let dark = document.querySelectorAll(".dark")
        for (const darks of dark) {
            if (sessionStorage.getItem("dark")) {
                darks.classList.add("text-light")
            } else {
                darks.classList.add("text-dark")
            }
        }
    }

    useEffect(() => {
        check();
        return (fetch())
    }, [])

    return (
        <div className='container-fluid '>
            <h2 id='Mobiles' className='dark'>Mobiles <i className="fa-duotone fa-mobile" style={{ fontFamily: "fontAwesome" }}></i></h2>
            {mobiles.length == [] || !mobiles.map(e => { e.itemType.toLowerCase().includes("Mobile".toLowerCase()) }) ?
                <div className='container-fluid justify-content-center text-center'>
                    <h1>No Items Found !</h1>
                </div>
                :
                <div className='container-fluid justify-content-center text-center' id='back-card-bg-mob' >
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4 justify-content-center text-center ">
                        {mobiles.map(e => {
                            if (e.itemType.toLowerCase().includes("Mobile".toLowerCase())) {
                                return (
                                    <div className=' col row ' key={e.itemId}>&nbsp;
                                        <div className="card " data-aos="fade-up" >

                                            <div className='card-header justify-content-end text-end'>
                                                <button className='btn  m-2' onClick={() => {
                                                    if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                                        axios.post("http://localhost:8083/cart/", {
                                                            "itemId": e.itemId,
                                                            "itemName": e.itemName,
                                                            "itemDesc": e.itemDesc,
                                                            "itemPrice": e.itemPrice,
                                                            "itemType": e.itemType,
                                                            "itemDimensions": e.itemDimensions,
                                                            "itemImgUrl": e.itemImgUrl,
                                                            "itemSpec": e.itemSpec,
                                                            "userId": localStorage.getItem("currentuser")
                                                        }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                    } else {
                                                        return (setInfo("Login required !"), setShowToast(true), timeout())
                                                    }
                                                }}
                                                ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                <button className='btn ' onClick={() => {
                                                    if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                                        axios.post("http://localhost:8083/fav/", {
                                                            "itemId": e.itemId,
                                                            "itemName": e.itemName,
                                                            "itemDesc": e.itemDesc,
                                                            "itemPrice": e.itemPrice,
                                                            "itemType": e.itemType,
                                                            "itemDimensions": e.itemDimensions,
                                                            "itemImgUrl": e.itemImgUrl,
                                                            "itemSpec": e.itemSpec,
                                                            "userId": localStorage.getItem("currentuser")
                                                        }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                    } else {
                                                        return (setInfo("Login required !"), setShowToast(true), timeout())
                                                    }
                                                }}
                                                ><i className="fa-solid fa-heart text-danger"></i> </button>
                                            </div>
                                            <img src={e.itemImgUrl} className="card-img-top" alt={e.itemName} />

                                            <div className="card-body">
                                                <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                                <p className="card-text text-truncate">{e.itemPrice}</p>
                                            </div>
                                            <Link to={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info'>View More...</Link>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        }
                    </div><br></br>
                    <a className='btn btn-info' href="/mobiles">View More Mobiles....</a><br></br>
                    &nbsp;
                </div>
            }
            <hr />

            {showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body ">
                        <p className='text-truncate'>{info}</p>
                        <div className="mt-2 pt-2">
                            <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast">Ok</button>
                        </div>
                    </div>
                </div>
            </div>}

        </div>
    )
}

