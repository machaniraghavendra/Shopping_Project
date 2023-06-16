import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import loadingImg from "../Resources/Loading_Card.png";
import Footer from '../Footer/Footer';
import ChatBot from '../ChatBot/ChatBot';

export default function ViewMoreItems(props) {

    const [items, setItems] = useState([]);

    const [info, setInfo] = useState("");

    const [showToast, setShowToast] = useState(false);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [itemType, setItemType] = useState("");

    const [search, setSearch] = useState("");

    const [filters, setfilters] = useState("");

    const fetch = () => {
        axios.get("http://localhost:8083/items/")
            .then((res) => {
                if (res.status == "200") {
                    setfetchDone(true);
                }
                return (setItems(res.data))
            }).catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }

    const getItemTypefromUrl = () => {
        if (window.location.href.includes("%")) {
            setItemType(window.location.href.substring(window.location.href.lastIndexOf("/")).replace("/", "").replaceAll("%20", " "));
        } else {
            setItemType(window.location.href.substring(window.location.href.lastIndexOf("/")).replace("/", ""));
        }
    }

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    // const getPlaceholder = () => {
    //     if (window.location.pathname.includes("/viewmore")) {
    //         // let searchbar = document.getElementById("viewSearchbar");
    //         // let getIndex = Math.floor(Math.random() * items.length)
    //         // fetchDone ? searchbar.placeholder = items[getIndex].itemName : searchbar.placeholder = "Search..."
    //     }
    // }
    // setInterval(getPlaceholder, 5000);

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
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        check();
        getItemTypefromUrl();
        return (fetch())
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row text-light p-2 viewbg'>
                <div className='col-3'>
                    <span className='fs-5'>
                        <i className="fa-thin fa-arrow-left btn mx-2 btn-light" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                        <span id='items' className='dark  fw-semibold'>{itemType.toUpperCase()}S</span>
                    </span>
                </div>
                <div className='col-2 justify-content-start '>
                    <div><input type='search' className='form-control form-control-sm w-100 ' id="viewSearchbar" placeholder='Search...'
                        onChange={(a) => {
                            setSearch(a.target.value)
                        }}
                    /></div>
                </div>
                <div className='col-7 align-items-center text-center d-grid gap-2'>
                    <div className="btn-group gap-1" role="group" >
                        <input type="radio" className="btn-check btn-sm" name="btnradio" id="all" autoComplete="off" onClick={() => setfilters("")} checked={filters === "" && true} />
                        <label className="btn btn-outline-light " htmlFor="all">All</label>

                        <input type="radio" className="btn-check btn-sm" name="btnradio" id="500" autoComplete="off" onClick={() => setfilters("500")} />
                        <label className="btn btn-outline-warning " htmlFor="500">&lt;500</label>

                        <input type="radio" className="btn-check btn-sm" name="btnradio" id="1000" autoComplete="off" onClick={() => setfilters("1000")} />
                        <label className="btn btn-outline-warning " htmlFor="1000">&lt;1000</label>

                        <input type="radio" className="btn-check btn-sm" name="btnradio" id="5000" autoComplete="off" onClick={() => setfilters("5000")} />
                        <label className="btn btn-outline-warning " htmlFor="5000">&lt;5000</label>

                        <input type="radio" className="btn-check btn-sm" name="btnradio" id="10000" autoComplete="off" onClick={() => { setfilters("10000") }} />
                        <label className="btn btn-outline-warning " htmlFor="10000">&lt;10000</label>

                        <input type="radio" className="btn-check btn-sm" name="btnradio" id="50000" autoComplete="off" onClick={() => setfilters("50000")} />
                        <label className="btn btn-outline-warning " htmlFor="50000">&lt;50000</label>

                        <input type="radio" className="btn-check btn-sm" name="btnradio" id="100000" autoComplete="off" onClick={() => setfilters("100000")} />
                        <label className="btn btn-outline-warning " htmlFor="100000">&lt;100000</label>

                        <input type="radio" className="btn-check btn-sm" name="btnradio" id=">100000" autoComplete="off" onClick={() => setfilters(">100000")} />
                        <label className="btn btn-outline-warning " htmlFor=">100000">&gt;100000</label>
                    </div>
                </div>
            </div>
            {fetchDone ?
                items.length == [] || !items.map(e => { e.itemType.toLowerCase().includes(itemType.toLowerCase()) }) ?
                    <div className='container-fluid justify-content-center text-center'>
                        <h1>No Items Found !</h1>
                    </div>
                    :
                    <div className='container-fluid justify-content-center text-center' id='back-card-bg-' >
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4 justify-content-center text-center ">
                            {items
                                .filter(a => {
                                    if (search === "") {
                                        return a;
                                    }
                                    if (a.itemName.toLowerCase().includes(search.toLowerCase())) {
                                        return a;
                                    }
                                })
                                .filter(a => {
                                    if (filters === "") {
                                        return a;
                                    }
                                    if (parseInt(filters) > parseInt(a.itemPrice.replaceAll(",", ""))) {
                                        return a;
                                    }
                                    if (filters === ">100000") {
                                        if (parseInt(filters.replace(">", "")) < parseInt(a.itemPrice.replaceAll(",", ""))) {
                                            return a;
                                        }
                                    }
                                })
                                .map((e) => {
                                    if (e.itemType.toLowerCase().includes(itemType.toLowerCase())) {
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
                                                    <div className='card-footer fixed-bottom'>
                                                        <Link to={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info'>View More...</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div><br></br>
                    </div>
                :
                <div className='container-fluid justify-content-center text-center' id='back-card-bg-m' >
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
            <ChatBot />
            <Footer />
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

