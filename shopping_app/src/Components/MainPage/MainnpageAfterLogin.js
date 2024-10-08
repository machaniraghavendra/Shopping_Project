import "../MainPage/Main.css"
import React, { useEffect, useState } from 'react'
import axios from "axios";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link, useNavigate } from "react-router-dom";
import ChatBot from "../ChatBot/ChatBot";
import LogOut from "../Login/LogOut";

export default function MainPageAfterlogin(props) {

    const [search, setSearch] = useState("");

    const [data, setData] = useState([]);

    const [findvalue, setFindvalue] = useState("");

    const [find, setFind] = useState(false);

    const [info, setInfo] = useState("");

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const nav = useNavigate();

    var count = 0;

    const [userName, setUserName] = useState("");

    const [user, setUser] = useState([]);

    const [show, setShow] = useState(false);

    const [scroll, setScroll] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [viewNotifications, setViewNotifications] = useState(false);

    const fetch = () => {
        axios.get("http://localhost:8083/items/")
            .then((res) => { return (setData(res.data)) })
            .catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }

    const currentuser = () => {
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => {
            if (a.status == "200") {
                setfetchDone(true)
            }
            return (setUserName(a.data.userName), setUser(a.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const check = () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 220) {
            setShow(true)
        }
        if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 620) {
            setScroll(true)
        }
        else {
            setShow(false);
            setScroll(false)
        }
    }

    window.onscroll = () => {
        check()
    }

    const checkPresentUser = () => {
        if (userName == undefined) {
            localStorage.removeItem("currentuser")
        }
    }

    const getNotifications = () => {
        axios.get("http://localhost:8083/notifications?userId=" + props.user)
            .then((res) => { return (setNotifications(res.data)) })
            .catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }

    const markasViewed = (uuid) => {
        axios.put("http://localhost:8083/notifications?userId=" + props.user + "&uuid=" + uuid)
            .catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }
    setTimeout(() => {
        checkPresentUser();
    }, 400);

    useEffect(() => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        currentuser();
        document.title = "Mart | Shopping Mart"
        setTimeout(() => {
            if (!localStorage.getItem("currentuser")) {
                nav("/login")
            }
        }, 1000);
        getNotifications();
        return (fetch());
    }, [])

    if (localStorage.getItem("currentuser")) {
        return (
            <div className='container-fluid '>
                <header>
                    <div className='container-fluid '>
                        <nav className="navbar bg-none navbar-expand-lg sticky-top">
                            <div className="container-fluid ">
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <h1 className="navbar-brand" >
                                    <img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" />
                                    &nbsp;Shopping Mart
                                </h1><br></br>
                                <div className="collapse navbar-collapse justify-content-end gap-2" id="navbarTogglerDemo03">
                                    <br></br>
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                            {fetchDone ?
                                                <span>{user.profileImgUrl ?
                                                    <img src={user.profileImgUrl} width={25} height={25} />
                                                    : <i className="fa-solid fa-user"></i>}&nbsp;{user.userName}
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
                                                    </button><br></br>
                                                    <button className="btn btn-outline-danger  justify-content-end " data-bs-toggle="modal" data-bs-target="#exampleModal2" data-bs-whatever="@fat"
                                                    ><i className="fa-solid fa-power-off"></i> Sign out & Switch User
                                                    </button>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        &nbsp;

                        <nav className={show ? "navbar navbar-expand-lg check bg-light fixed-top" : "navbar navbar-expand-lg check bg-light"}>
                            <div className="container-fluid  ">
                                <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <h2 className=' d-sm-block d-md-none d-lg-none navbar-brand'></h2>

                                {show ?
                                    <h1 className="navbar-brand" >
                                        <img src="https://media.istockphoto.com/vectors/shopping-bag-flat-icon-pixel-perfect-for-mobile-and-web-vector-id1145783156?k=20&m=1145783156&s=612x612&w=0&h=RJdFiHDeaQJt3KbyIfJmWS12iQrD63DUCMWPrFLumwk=" alt="" width="35" height="35" className="d-inline-block align-text-top" />
                                        &nbsp;Shopping Mart</h1>
                                    :
                                    <h1 className="navbar-brand" >Contents</h1>}

                                <div className="collapse navbar-collapse " id="navbarTogglerDemo02">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0  ">
                                        <li className="nav-item ">
                                            <Link className="nav-link text-dark" aria-current="page" to="/cart"><h5><i className="fa-solid fa-cart-shopping fa-bounce text-info"></i> Cart</h5></Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to="/wishlist"><h5><i className="fa-solid fa-heart fa-beat text-danger"></i> Wishlist</h5></Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to="/orders"><h5><i className="fa-solid fa-bag-shopping fa-fade text-warning"></i>  My Orders ({fetchDone ? user.totalOrdersCountOfUser != 0 ? user.totalOrdersCountOfUser : "No orders" : "Loading.."})</h5></Link>
                                        </li>
                                        <li className="nav-item">
                                            <div type="button" className="nav-link position-relative" onMouseOver={() => setViewNotifications(true)} onMouseOut={() => setViewNotifications(false)}>
                                                <i className="fa-solid fa-bell fs-4"> </i>
                                                {notifications.length != 0 &&
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {notifications.length}
                                                        <span className="visually-hidden">unread messages</span>
                                                    </span>
                                                }
                                            </div>
                                            {(viewNotifications) &&
                                                <div className="position-absolute mx-4 top-0 bg-dark px-1 overflow-scroll" style={{ zIndex: "10", maxHeight:"300%", minHeight:"0%" }} onMouseOver={() => setViewNotifications(true)} onMouseOut={() => setViewNotifications(false)}>
                                                    {notifications.length != 0?
                                                    <ul className="list-group">
                                                        {notifications.map(a => {
                                                            return (
                                                                <li key={a.uuid} className="list-group-item list-group-item-info my-1" onClick={() => { markasViewed(a.uuid) }}><Link to={a.link} className="text-decoration-none text-dark">{a.message}</Link></li>
                                                            )
                                                        })}
                                                    </ul>:<div className="text-light p-1">No new notifications</div>}
                                                </div>
                                            }
                                        </li>
                                    </ul>

                                    <div className="d-flex justify-content-center gap-3" >
                                        {/* <div className="search p-2" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
                                            <i className="fa-solid fa-search"></i>
                                        </div> */}
                                        <div className=" ">
                                            <form onSubmit={(e) => { return (e.preventDefault, nav("search?query=" + search)) }}>
                                                <div className="form-floating">
                                                    <input type="search"
                                                        className="form-control form-control-sm"
                                                        onChange={(e) => { return (setSearch(e.target.value)) }}
                                                        id="floatingInput"
                                                        placeholder="Search here..." />
                                                    <label htmlFor="floatingInput">Search/Name...</label>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="btn-group ">
                                            <button type="button" className="btn btn-dark dropdown-toggle " data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                                Items
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-lg-end bg-warning">
                                                <li><a className="dropdown-item" type="button" href="#Mobiles"> <i className="fa-solid fa-mobile"></i> Mobiles</a></li>
                                                <li><a className="dropdown-item" type="button" href="#Sports"><i className="fa-solid fa-baseball"></i> Sports</a></li>
                                                <li><a className="dropdown-item" type="button" href="#Dresses"><i className="fa-solid fa-shirt"></i> Dresses</a>
                                                    <ul className="dropdown">
                                                        <li className="dropdown-item"><a className="dropdown-item" type="button" href="#Shirts-men"><i className="fa-solid fa-shirt"></i>Men Shirts</a></li>
                                                        <li className="dropdown-item"><a className="dropdown-item" type="button" href="#Shirts-women"><i className="fa-solid fa-shirt"></i>Women Shirts</a></li>
                                                    </ul>
                                                </li>
                                                <li><a className="dropdown-item" type="button" href="#Smart-watches "><i className="bi bi-smartwatch"></i> Smart watches</a></li>
                                                <li><a className="dropdown-item" type="button" href="#watches"><i className="bi bi-watch"></i> Watches</a></li>
                                                <li><a className="dropdown-item" type="button" href="#Cameras"><i className="fa-solid fa-camera"></i> Cameras</a></li>
                                                <li><a className="dropdown-item" type="button" href="#musicalInstruments"><i className="fa-solid fa-guitar"></i> Musical Instruments</a></li>
                                                <li><a className="dropdown-item" type="button" href="#Books"><i className="fa-solid fa-book"></i> Books</a></li>
                                                <li><a className="dropdown-item" type="button" href="#TV"><i className="fa-solid fa-tv"></i> Television</a></li>
                                                <li><a className="dropdown-item" type="button" href="#Headfones"><i className="fa-solid fa-headphones"></i> Headfones</a></li>
                                            </ul>
                                        </div>
                                        <div className="extraId"></div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header >

                <hr />

                <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen modal-dialog-scrollable modal-lg ">
                        <div className="modal-content bg-info">
                            <div className="modal-header ">
                                <h5 className="modal-title text-end" id="exampleModalLabel"></h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => { return (e.preventDefault, nav("search?query=" + search)) }}>
                                    <div className="form-floating mb-3 ">
                                        <input type="search"
                                            className="form-control"
                                            onChange={(e) => { return (setSearch(e.target.value), setFindvalue(count)), setFind(true) }}
                                            onKeyUp={() => { return (setFindvalue(count), setFind(true)) }}
                                            id="floatingInput"
                                            placeholder="Search here..." />
                                        <label htmlFor="floatingInput">Search/Name...</label>
                                        {!(search != "") ? ""
                                            :
                                            <>
                                                {find == true ?
                                                    <>
                                                        <p className="container-fluid"><b>Search results :</b>Found {findvalue} </p>
                                                    </> : ""}
                                            </>}
                                    </div>
                                </form>
                                {/* <div className="   row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-3 gap-4 justify-content-center text-center ">
                                    {data.filter((val) => {
                                        if (search == "") {
                                            count = 0;
                                            return null;
                                        }
                                        if (val.itemName.toLowerCase().includes(search.toLowerCase())) {
                                            return val
                                        }
                                    }).map((e) => {
                                        count++;
                                        return (
                                            <div className=' col row ' key={e.itemId}>&nbsp;
                                                <div className="card " data-aos="fade-up" >
                                                    <div className='card-header row'>
                                                        <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                                            <Rating times={e.ratingOfItem} />
                                                        </div>
                                                        <div className='col-7 justify-content-end text-end'>
                                                            <button className='btn  m-2' onClick={() => {
                                                                axios.post("http://localhost:8083/cart/", {
                                                                    "itemId": e.itemId,
                                                                    "userId": localStorage.getItem("currentuser")
                                                                }, []).then((res) => { return (setInfo(res.data)) })
                                                            }}
                                                                data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"

                                                            ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                            <button className='btn ' onClick={() => {
                                                                axios.post("http://localhost:8083/fav/", {
                                                                    "itemId": e.itemId,
                                                                    "userId": localStorage.getItem("currentuser")
                                                                }, []).then((res) => { return (setInfo(res.data)) })
                                                            }}
                                                                data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"
                                                            ><i className="fa-solid fa-heart text-danger"></i> </button>
                                                        </div>
                                                    </div>
                                                    <img src={e.itemImgUrl} className="card-img-top" alt="..." />
                                                    <div className="card-body">
                                                        <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                                        <p className="card-text"> ₹{e.itemPrice}</p>
                                                    </div>
                                                    <a href={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info' >View More...</a>
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                </div> */}
                                {/* <SearchScreen query={search} /> */}
                                {/* <div>{SearchScreen()}</div> */}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn=outline-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="container-fluid " data-aos="fade-up-right">
                    <div className="row">
                        <div className="col-sm-7">
                            <div className="card body">
                                <div className="card-body p-5">
                                    <h1 className="card-title ">Great Products With Best Price</h1>
                                    <p className="card-text">The Products of reasonable price and best quality</p>
                                    <a href="#details" className="btn btn-info">View</a>
                                </div>
                            </div><br></br>
                        </div>
                        <div className="col-sm-5" data-aos="fade-up-right">
                            <div className="card ">
                                <div className="card-body  p-5" >
                                    <h3 className="card-title">Amazing Products in Trending <i className="bi bi-stars"></i></h3>
                                    <a href="#trending" className="btn btn-info">View</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="container-fluid second p-4" id="details" data-aos="zoom-in-up">
                    <div className="container text-center">
                        <div className="row row-cols-2 row-cols-lg-6 g-3 g-lg-4 justify-content-center">
                            <div className="col">
                                <a href="#Mobiles" className="text-decoration-none text-dark">
                                    <i className="fa-duotone fa-mobile"></i><br></br>Mobiles
                                </a></div>
                            <div className="col"> <a href="#Shirts-men" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-shirt"></i><br></br>Shirts-Men
                            </a></div>
                            <div className="col"><a href="#Shirts-women" className="text-decoration-none text-dark">
                                <i className="fa-thin fa-shirt"></i><br></br>Shirts-Women
                            </a></div>
                            <div className="col"><a href="#Smart-watches" className="text-decoration-none text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-smartwatch" viewBox="0 0 16 16">
                                    <path d="M9 5a.5.5 0 0 0-1 0v3H6a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 .5-.5V5z" />
                                    <path d="M4 1.667v.383A2.5 2.5 0 0 0 2 4.5v7a2.5 2.5 0 0 0 2 2.45v.383C4 15.253 4.746 16 5.667 16h4.666c.92 0 1.667-.746 1.667-1.667v-.383a2.5 2.5 0 0 0 2-2.45V8h.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H14v-.5a2.5 2.5 0 0 0-2-2.45v-.383C12 .747 11.254 0 10.333 0H5.667C4.747 0 4 .746 4 1.667zM4.5 3h7A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3z" />
                                </svg><br></br>Smart Watches
                            </a></div>
                            <div className="col"><a href="#watches" className="text-decoration-none text-dark">
                                <i className="bi bi-watch" style={{ fontSize: "25px" }}></i><br></br>Watches
                            </a></div>
                            <div className="col"><a href="#Sports" className="text-decoration-none text-dark">
                                <i className="fa-thin fa-baseball"></i><br></br>Sports
                            </a></div>
                            <div className="col"><a href="#Cameras" className="text-decoration-none text-dark">
                                <i className="fa-thin fa-camera"></i><br></br>Cameras
                            </a></div>
                            <div className="col"><a href="#musicalInstruments" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-guitar"></i><br></br>Musical Items
                            </a></div>
                            <div className="col"><a href="#Books" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-book-open"></i><br></br>Books
                            </a></div>
                            <div className="col"><a href="#TV" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-tv"></i><br></br>TV
                            </a></div>
                            <div className="col"><a href="#Headfones" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-headphones"></i><br></br>Headfones
                            </a></div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="staticBackdrop" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h4>{info}</h4>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="container-fluid" >
                    <button className={scroll ? "btn btn-primary align-text-center scroll-up d-block" : "btn btn-primary align-text-center scroll-up d-none"}
                        onClick={() => {
                            return (document.documentElement.scrollTop = 0,
                                document.body.scrollTop = 0)
                        }}>
                        <h4><i className="fa-solid fa-angle-up"></i></h4></button>
                </div>

                <ChatBot />

                {/* LogOut pop */}
                <LogOut user={props.user} />

                {/* Switch user popup */}
                <div className="modal fade " id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content logout-model">
                            <div className="modal-header">
                                <h5 className="modal-title " id="exampleModalLabel"><img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" /> Shopping mart</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center">
                                <h5>Conform to logout and switch user</h5>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-success" data-bs-dismiss="modal">No</button>
                                <button type="button" className="btn btn-outline-danger"
                                    onClick={() => {
                                        return (localStorage.removeItem("currentuser"),
                                            nav("/login"),
                                            window.location.reload())
                                    }}
                                >Yes</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error pop*/}
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
    } else {
        return (
            <div className="container-fluid bg-dark  justify-content-center text-center text-light vh-100">
                <div className="position-relative py-5" >
                    <h1 style={{ letterSpacing: "2px", textAlign: "center", textTransform: "capitalize" }}>
                        <figure>
                            <img src={img} alt="Not found" className="img-fluid" width="45" height="45" /> Shopping mart
                        </figure>
                    </h1><hr></hr>
                    <h2 style={{ letterSpacing: "2px", fontFamily: "monospace", textAlign: "center", textTransform: "capitalize" }}>
                        Opps! Something went wrong
                        Login required!
                    </h2>
                    <a href='/login' className='btn btn-outline-success text-light' onClick={() => {
                        return (
                            localStorage.removeItem("Raghu"),
                            localStorage.removeItem("currentuser")
                        )
                    }}>Click here to move to Login page</a>
                </div>
            </div>
        )
    }
}
