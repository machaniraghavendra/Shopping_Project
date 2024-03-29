import React, { useEffect, useState } from 'react'
import "./Mob.css";
import axios from "axios";
import { Link } from 'react-router-dom';
import Rating from '../Rating/Rating';

export default function Mobiles() {

    const [mobiles, setMobiles] = useState([]);

    const [info, setInfo] = useState("");

    const [showToast, setShowToast] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    let i = 0;

    const fetch = () => {
        axios.get("http://localhost:8083/items/type?type=Mobile")
            .then((res) => { return (setMobiles(res.data)) }).catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    useEffect(() => {
        return (fetch())
    }, [])

    return (
        <div className='container-fluid '>
            <h2 id='Mobiles' >Mobiles <i className="fa-duotone fa-mobile" style={{ fontFamily: "fontAwesome" }}></i></h2>
            {mobiles.length == [] || !mobiles.map(e => { e.itemType.toLowerCase().includes("Mobile".toLowerCase()) }) ?
                <div className='container-fluid justify-content-center text-center'>
                    <h1>No Items Found !</h1>
                </div>
                :
                <div className='container-fluid justify-content-center text-center'  >
                    <div className="  row row-cols-1 row-cols-md-4 gap-4 justify-content-center text-center ">
                        {mobiles.map(e => {
                            if (e.itemType.toLowerCase().includes("Mobile".toLowerCase())) {
                                i++;
                                if (i <= 4) {
                                    return (
                                        <div className=' col row ' key={e.itemId}>&nbsp;
                                            <div className="card " data-aos="fade-up" >
                                                <div className='card-header row'>
                                                    <div className='col-2'>
                                                        <span className=' text-success'><i className="bi bi-bag-check"></i> {e.totalOrders}</span>
                                                    </div>
                                                    <div className='col-2'>
                                                        <span className=' text-success'><i className="bi bi-chat-square-heart"></i> {e.totalReviews}</span>
                                                    </div>
                                                    <div className='col-4 justify-content-start text-start gap-1 d-flex'>
                                                        <Rating times={e.ratingOfItem} />
                                                    </div>
                                                    <div className='col-4 justify-content-end text-end'>
                                                        <button className='btn' onClick={() => {
                                                            if (localStorage.getItem("currentuser")) {
                                                                axios.post("http://localhost:8083/cart/", {
                                                                    "itemId": e.itemId,
                                                                    "userId": localStorage.getItem("currentuser")
                                                                }, []).then((res) => { return (setInfo(res.data)) }).catch((error) => {
                                                                    setError(true);
                                                                    if (error.response.data === undefined) {
                                                                        setErrorMessage("Something went wrong")
                                                                    } else {
                                                                        setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                                                                    }
                                                                })
                                                            } else {
                                                                return (setInfo("Login required !"), setShowToast(true), timeout())
                                                            }
                                                        }}
                                                        ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                        <button className='btn ' onClick={() => {
                                                            if (localStorage.getItem("currentuser")) {
                                                                axios.post("http://localhost:8083/fav/", {
                                                                    "itemId": e.itemId,
                                                                    "userId": localStorage.getItem("currentuser")
                                                                }, []).then((res) => { return (setInfo(res.data)) }).catch((error) => {
                                                                    setError(true);
                                                                    if (error.response.data === undefined) {
                                                                        setErrorMessage("Something went wrong")
                                                                    } else {
                                                                        setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                                                                    }
                                                                })
                                                            } else {
                                                                return (setInfo("Login required !"), setShowToast(true), timeout())
                                                            }
                                                        }}
                                                        ><i className="fa-solid fa-heart text-danger"></i> </button>
                                                    </div>
                                                </div>
                                                <img src={e.itemImgUrl} className="card-img-top" alt={e.itemName} />

                                                <div className="card-body">
                                                    <h6 className="card-title" id={e.itemName}>{e.itemName}</h6>
                                                    <p className="card-text"> ₹{e.itemPrice}</p>
                                                </div>
                                                <Link to={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info'>View More...</Link>
                                            </div>
                                        </div>
                                    )
                                }
                            }
                        })
                        }
                    </div><br></br>
                    <a className='btn btn-info' href="/login">View More Mobiles....</a><br></br>
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

            {/* Error pop */}
            {error && <>
                <div className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body text-danger text-center">
                            <h6>Error !</h6>
                            {errorMessage}
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => { setError(false); setErrorMessage("") }}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            }
        </div>
    )
}
