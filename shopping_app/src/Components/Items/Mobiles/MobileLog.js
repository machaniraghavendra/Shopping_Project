import React, { useEffect, useState } from 'react'
import "../Mobiles/Mob.css";
import axios from "axios";
import { Link } from 'react-router-dom';
import loadingImg from "/Shopping_Project/shopping_app/src/Components/Resources/Loading_Card.png";

export default function MobileLog(props) {

    const [mobiles, setMobiles] = useState([]);

    const [info, setInfo] = useState("");

    const [showToast, setShowToast] = useState(false);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    var i = 0;

    const fetch = () => {
        axios.get("http://localhost:8083/items/type?type=Mobile")
            .then((res) => {
                if (res.status == "200") {
                    setfetchDone(true)
                }
                return (setMobiles(res.data))
            }).catch((error) => {
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

    const check = () => {
        let dark = document.querySelectorAll(".dark")
        for (const darks of dark) {
            if (sessionStorage.getItem("dark") === "true") {
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
            {fetchDone ?
                mobiles.length == [] || !mobiles.map(e => { e.itemType.toLowerCase().includes("Mobile".toLowerCase()) }) ?
                    <div className='container-fluid justify-content-center text-center'>
                        <h1>No Items Found !</h1>
                    </div>
                    :
                    <div className='container-fluid justify-content-center text-center' id='back-card-bg-mob' >
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4 justify-content-center text-center ">
                            {mobiles.map(e => {
                                if (e.itemType.toLowerCase().includes("Mobile".toLowerCase())) {
                                    i++;
                                    if (i <= 4) {
                                        return (
                                            <div className=' col row ' key={e.itemId}>&nbsp;
                                                <div className="card " data-aos="fade-up" >
                                                    <div className='card-header justify-content-end text-end'>
                                                        <button className='btn  m-2' onClick={() => {
                                                            if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                                                axios.post("http://localhost:8083/cart/", {
                                                                    "itemId": e.itemId,
                                                                    "userId": localStorage.getItem("currentuser")
                                                                }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                                    .catch((error) => {
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
                                                            if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                                                axios.post("http://localhost:8083/fav/", {
                                                                    "itemId": e.itemId,
                                                                    "userId": localStorage.getItem("currentuser")
                                                                }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                                    .catch((error) => {
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
                                                    <img src={e.itemImgUrl} className="card-img-top" alt={e.itemName} />

                                                    <div className="card-body">
                                                        <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                                        <p className="card-text text-truncate"> ₹{e.itemPrice}</p>
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
                        <Link className='btn btn-info' to={'/viewmore/mobile'}>View More Mobiles....</Link><br></br>
                        &nbsp;
                    </div>
                :
                <div className='container-fluid justify-content-center text-center' id='back-card-bg-mob' >
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4 justify-content-center text-center ">
                        <div className=' col row '>
                            <div className="card " data-aos="fade-up" >
                                <div className='card-header justify-content-end text-center'>
                                    <div className="card-body">
                                        <img src={loadingImg} className="card-img-top" alt="..." />
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <a className="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' col row '>
                            <div className="card " data-aos="fade-up" >
                                <div className='card-header justify-content-end text-center'>
                                    <div className="card-body">
                                        <img src={loadingImg} className="card-img-top" alt="..." />
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <a className="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' col row '>
                            <div className="card " data-aos="fade-up" >
                                <div className='card-header justify-content-end text-center'>
                                    <div className="card-body">
                                        <img src={loadingImg} className="card-img-top" alt="..." />
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <a className="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' col row '>
                            <div className="card " data-aos="fade-up" >
                                <div className='card-header justify-content-end text-center'>
                                    <div className="card-body">
                                        <img src={loadingImg} className="card-img-top" alt="..." />
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <a className="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

