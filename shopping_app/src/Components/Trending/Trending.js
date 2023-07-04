import React, { useEffect, useState } from 'react'
import axios from "axios";
import "../Trending/Trend.css";
import { Link } from 'react-router-dom';

export default function Trending() {

    const [trendingItems, setTrendingItems] = useState([]);

    const [info, setInfo] = useState("");

    const [showToast, setShowToast] = useState(false);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    const fetch = () => {
        axios.get("http://localhost:8083/items/trending")
            .then((res) => {
                if (res.status == "200") {
                    setfetchDone(true);
                    setTrendingItems(res.data)
                }
            }).catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }
    
    const addIntoInterest = (id) => {
        axios.post("http://localhost:8083/items/history?user=" + localStorage.getItem("currentuser") + "&id=" + id)
        .catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const cartAdd = (id) => {
        if ( localStorage.getItem("currentuser")) {
            axios.post("http://localhost:8083/cart/", {
                "itemId": id,
                "userId": localStorage.getItem("currentuser")
            }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) }).catch((error) => {
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
    }

    const favAdd = (id) => {
        if ( localStorage.getItem("currentuser")) {
            axios.post("http://localhost:8083/fav/", {
                "itemId": id,
                "userId": localStorage.getItem("currentuser")
            }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) }).catch((error) => {
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
    }

    setTimeout(() => {
        if (fetchDone) {
            check();
        }
    }, 200);

    const check = () => {
        let dark = document.getElementById("trending")
        if (fetchDone && trendingItems != []) {
            if (sessionStorage.getItem("dark") === "true") {
                dark.classList.remove("text-dark")
                dark.classList.add("text-light")
            } else {
                dark.classList.remove("text-light")
                dark.classList.add("text-dark")
            }
        }
    }

    useEffect(() => {
        return (fetch())
    }, [])

    if (fetchDone) {
        return (
            <div className='container-fluid'>
                <h2 id='trending' className='dark'>Trending <i className="bi bi-stars"></i></h2>
                <div id="carouselExampleIndicators" data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" className="carousel slide" data-bs-ride="true">
                    <div className="carousel-inner text-center container">
                        <div className="carousel-item active" data-bs-interval="3000">
                            <div className="row row-cols-1 row-cols-md-3 g-4" >
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex position-fixed justify-content-end align-items-end' ><p className=' badge text-bg-success'>1</p></span>
                                        <img src={trendingItems[0].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[0].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[0].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[0].itemId + "/" + trendingItems[0].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[0].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[0].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[0].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex position-fixed  justify-content-end align-items-end'><p className=' badge text-bg-success'>2</p></span>
                                        <img src={trendingItems[1].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[1].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[1].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[1].itemId + "/" + trendingItems[1].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[1].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[1].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[1].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex position-fixed justify-content-end align-items-end'><p className=' badge text-bg-success'>3</p></span>
                                        <img src={trendingItems[2].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[2].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[2].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[2].itemId + "/" + trendingItems[2].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[2].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[2].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[2].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item" data-bs-interval="4000">
                            <div className="row row-cols-1 row-cols-md-3 g-4" >
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex position-fixed  justify-content-end align-items-end'><p className=' badge text-bg-success'>4</p></span>
                                        <img src={trendingItems[3].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[3].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[3].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[3].itemId + "/" + trendingItems[3].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[3].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[3].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[3].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex position-fixed  justify-content-end align-items-end'><p className=' badge text-bg-success'>5</p></span>
                                        <img src={trendingItems[4].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[4].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[4].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[4].itemId + "/" + trendingItems[4].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[4].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[4].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[4].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex position-fixed  justify-content-end align-items-end'><p className=' badge text-bg-success'>6</p></span>
                                        <img src={trendingItems[5].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[5].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[5].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[5].itemId + "/" + trendingItems[5].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[5].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[5].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[5].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item" data-bs-interval="4000">
                            <div className="row row-cols-1 row-cols-md-3 g-4" >
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex position-fixed  justify-content-end align-items-end'><p className=' badge text-bg-success'>7</p></span>
                                        <img src={trendingItems[6].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[6].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[6].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[6].itemId + "/" + trendingItems[6].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[6].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[6].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[6].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex  position-fixed  justify-content-end align-items-end'><p className=' badge text-bg-success'>8</p></span>
                                        <img src={trendingItems[7].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[7].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[7].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[7].itemId + "/" + trendingItems[7].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[7].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[7].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[7].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <span className='d-flex  position-fixed justify-content-end align-items-end'><p className=' badge text-bg-success'>9</p></span>
                                        <img src={trendingItems[8].itemImgUrl} className="card-img-top " alt="Image not found" />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{trendingItems[8].itemName}</h5>
                                            <p className="card-text">₹{trendingItems[8].itemPrice}</p>
                                            <Link to={'/view/' + trendingItems[8].itemId + "/" + trendingItems[8].itemName} className='btn btn-info' onClick={() => { addIntoInterest(trendingItems[8].itemId) }}>View More...</Link>
                                            <button className='btn btn-outline-info m-3 ' onClick={() => { cartAdd(trendingItems[8].itemId) }}>Add to Cart</button>
                                            <button className='btn btn-outline-info' onClick={() => { favAdd(trendingItems[8].itemId) }}>Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
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
}
