import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import loadingImg from "../Loading_Card.png";
import Footer from '../Footer/Footer';
import ChatBot from '../ChatBot/ChatBot';
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import LogOut from '../Login/LogOut';
import Rating from '../Items/Rating/Rating';

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

    const [user, setUser] = useState([]);

    const [scroll, setScroll] = useState(false);

    let i = 0;

    const fetch = (type) => {
        axios.get("http://localhost:8083/items/type?type=" + type)
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

    window.onscroll = () => {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 420) {
            setScroll(true)
        } else {
            setScroll(false)
        }
    }

    const currentuser = () => {
        axios.get("http://localhost:8083/user/userid/" + props.user).then(res => {
            if (res.status == "200") {
                setfetchDone(true)
            }
            return (setUser(res.data))
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
        let type = window.location.href.substring(window.location.href.lastIndexOf("/")).replace("/", "")
        if (window.location.href.includes("%")) {
            setItemType(type.replaceAll("%20", " "));
            fetch(type.replaceAll("%20", " "))
        } else {
            setItemType(type);
            fetch(type)
        }
    }

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    useEffect(() => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        getItemTypefromUrl();
        currentuser();
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row text-light p-2 viewbg'>
                <div className='col-xl-2 col-2'>
                    <span className='fs-5'>
                        <i className="fa-thin fa-arrow-left btn mx-2 btn-light" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                        <span id='items' className='dark fw-semibold d-lg-inline-block d-none'>{itemType.toUpperCase()}'S</span>
                    </span>
                </div>
                <div className='col-xl-2 col-6'>
                    <div><input type='search' className='form-control form-control-sm w ' id="viewSearchbar" placeholder='Search...'
                        onChange={(a) => {
                            setSearch(a.target.value)
                        }}
                    /></div>
                </div>
                <div className='col-xl-7 col-2'>
                    <div className="d-none d-xl-flex gap-2 justify-content-center btn-group-sm gap-2" role="group" >
                        <input type="radio" className="btn-check " name="btnradio" id="all" autoComplete="off" onClick={() => setfilters("")} checked={filters === "" && true} />
                        <label className="btn btn-outline-light " htmlFor="all">All</label>

                        <input type="radio" className="btn-check " name="btnradio" id="500" autoComplete="off" onClick={() => setfilters(filters == "" ? "500" : "")} />
                        <label className="btn btn-outline-warning " htmlFor="500">Below 500</label>

                        <input type="radio" className="btn-check " name="btnradio" id="1000" autoComplete="off" onClick={() => setfilters(filters == "" ? "1000" : "")} />
                        <label className="btn btn-outline-warning " htmlFor="1000">Below 1,000</label>

                        <input type="radio" className="btn-check " name="btnradio" id="5000" autoComplete="off" onClick={() => setfilters(filters == "" ? "5000" : "")} />
                        <label className="btn btn-outline-warning " htmlFor="5000">Below 5,000</label>

                        <input type="radio" className="btn-check " name="btnradio" id="10000" autoComplete="off" onClick={() => { setfilters(filters == "" ? "10000" : "") }} />
                        <label className="btn btn-outline-warning " htmlFor="10000">Below 10,000</label>

                        <input type="radio" className="btn-check " name="btnradio" id="50000" autoComplete="off" onClick={() => setfilters(filters == "" ? "50000" : "")} />
                        <label className="btn btn-outline-warning " htmlFor="50000">Below 50,000</label>

                        <input type="radio" className="btn-check " name="btnradio" id="100000" autoComplete="off" onClick={() => setfilters(filters == "" ? "100000" : "")} />
                        <label className="btn btn-outline-warning " htmlFor="100000">Below 1,00,000</label>

                        <input type="radio" className="btn-check " name="btnradio" id=">100000" autoComplete="off" onClick={() => setfilters(filters == "" ? ">100000" : "")} />
                        <label className="btn btn-outline-warning " htmlFor=">100000">Above 1,000,00</label>
                    </div>
                    <div className="btn-group d-block d-xl-none d-flex gap-2 justify-content-center">
                        <button type="button" className="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Fllters
                        </button>
                        <ul className="dropdown-menu bg-black gap-1 p-2  text-center dropdown-menu-start dropdown-menu-lg-end">
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id="alldrop" autoComplete="off" onClick={() => setfilters("")} checked={filters === "" && true} />
                                <label className="btn btn-outline-light " htmlFor="alldrop">All</label>
                            </li>
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id="500drop" autoComplete="off" onClick={() => setfilters("500")} />
                                <label className="btn btn-outline-warning " htmlFor="500drop">Below 500</label>
                            </li>
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id="1000drop" autoComplete="off" onClick={() => setfilters("1000")} />
                                <label className="btn btn-outline-warning " htmlFor="1000drop">Below 1,000</label>
                            </li>
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id="5000drop" autoComplete="off" onClick={() => setfilters("5000")} />
                                <label className="btn btn-outline-warning " htmlFor="5000drop">Below 5,000</label>
                            </li>
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id="10000drop" autoComplete="off" onClick={() => { setfilters("10000") }} />
                                <label className="btn btn-outline-warning " htmlFor="10000drop">Below 10,000</label>
                            </li>
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id="50000drop" autoComplete="off" onClick={() => setfilters("50000")} />
                                <label className="btn btn-outline-warning " htmlFor="50000drop">Below 50,000</label>
                            </li>
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id="100000drop" autoComplete="off" onClick={() => setfilters("100000")} />
                                <label className="btn btn-outline-warning " htmlFor="100000drop">Below 1,00,000</label>
                            </li>
                            <li>
                                <input type="radio" className="btn-check " name="btnradiodrop" id=">100000drop" autoComplete="off" onClick={() => setfilters(">100000")} />
                                <label className="btn btn-outline-warning " htmlFor=">100000drop">Above 1,000,00</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-xl-1 col-2'>
                    <div className="justify-content-around d-flex">
                        <div className="btn-group btn-group-sm">
                            <button type="button" className="btn btn-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                {fetchDone ?
                                    <span className='text-light'>{user.profileImgUrl ?
                                        <img src={user.profileImgUrl} width={25} height={25} />
                                        :
                                        <i className="fa-solid fa-user"></i>}
                                    </span>
                                    :
                                    <span className="placeholder-glow">
                                        <span className="placeholder col-12"></span>
                                    </span>}
                            </button>
                            <ul className="dropdown-menu bg-secondary-warning dropdown-menu-lg-end user">
                                <li><Link className="dropdown-item" to={"/profile/settings"}><i className='fa-solid fa-gear'></i> Settings</Link></li>
                                <li>
                                    <a className="dropdown-item text-center">
                                        <button className="btn btn-outline-danger  justify-content-end " data-bs-toggle="modal" data-bs-target="#exampleModal3" data-bs-whatever="@fat"
                                        ><i className="fa-solid fa-power-off"></i> Sign out
                                        </button>
                                    </a>
                                </li>
                            </ul>
                        </div>
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
                                        i = 0;
                                        return a;
                                    }
                                    if (a.itemName.toLowerCase().includes(search.toLowerCase())) {
                                        i = 0;
                                        return a;
                                    }
                                })
                                .filter(a => {
                                    if (filters === "") {
                                        i = 0;
                                        return a;
                                    }
                                    if (parseInt(filters) > parseInt(a.itemPrice.replaceAll(",", ""))) {
                                        i = 0;
                                        return a;
                                    }
                                    if (filters === ">100000") {
                                        if (parseInt(filters.replace(">", "")) < parseInt(a.itemPrice.replaceAll(",", ""))) {
                                            i = 0;
                                            return a;
                                        }
                                    }
                                }
                                )
                                .map((e) => {
                                    if (e.itemType.toLowerCase().includes(itemType.toLowerCase())) {
                                        i++
                                        return (
                                            <div className=' col row ' key={e.itemId}>&nbsp;
                                                <div className="card " data-aos="fade-up" >
                                                    <div className='card-header row'>
                                                        <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                                            <Rating times={e.ratingOfItem} />
                                                        </div>
                                                        <div className='col-7 justify-content-end text-end'>
                                                            <button className='btn  m-2' onClick={() => {
                                                                if (localStorage.getItem("currentuser")) {
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
                                                                if (localStorage.getItem("currentuser")) {
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
                                                    </div>
                                                    <img src={e.itemImgUrl} className="card-img-top" alt={e.itemName} />

                                                    <div className="card-body">
                                                        <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                                        <p className="card-text text-truncate"> ₹{e.itemPrice}</p>
                                                    </div>
                                                    <div className='card-footer fixed-bottom'>
                                                        <Link to={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info' onClick={() => { addIntoInterest(e.itemId) }}>View More...</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div><br></br>
                        {i == 0 && <h4 className='text-info '>
                            <img src={img} width={35} height={35} /> No items found !
                        </h4>}
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

            {/* Scroll button */}
            <div className="container-fluid" >
                <button className={scroll ? "btn btn-primary align-text-center scroll-up d-block" : "btn btn-primary align-text-center scroll-up d-none"}
                    onClick={() => {
                        return (document.documentElement.scrollTop = 0,
                            document.body.scrollTop = 0)
                    }}>
                    <h4><i className="fa-solid fa-angle-up"></i></h4></button>
            </div>

            <ChatBot />

            <Footer />

            {
                showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body ">
                            <p className='text-truncate'>{info}</p>
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast">Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Logout pop */}
            <LogOut user={props.user} />

            {/* Error pop */}
            {
                error && <>
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
        </div >
    )
}

