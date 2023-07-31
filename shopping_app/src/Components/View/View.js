import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "../View/Viewcss.css";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import ChatBot from '../ChatBot/ChatBot';
import loadingImg from "../Loading_Card.png";
import LogOut from '../Login/LogOut';
import Rating from '../Items/Rating/Rating';
import timePeriodCalculator from '../Orders/TimePeriodCalculator';
export default function View(props) {

    let num = window.location.href.replaceAll("%20", " ").replaceAll("/", " ").split(" ", 5)[4];

    const [viewItem, setviewItem] = useState([]);

    const [info, setInfo] = useState("");

    const [user, setUser] = useState([]);

    const [items, setItems] = useState([]);

    const [interesteditems, setInterestedItems] = useState([]);

    const [showToast, setShowToast] = useState(false);

    const [fetchItemDone, setfetchItemDone] = useState(false);

    const [fetchUserDone, setfetchUserDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [scroll, setScroll] = useState(false);

    const [reviewsOfItem, setReviewsOfItem] = useState([]);

    const [showImagePop, setShowImagePop] = useState(false);

    const [imageUrlForToShow, setImageUrlForToShow] = useState("");

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    const similar = () => {
        axios.get("http://localhost:8083/items/").then(res => { return (setItems(res.data)) }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const getItem = (click) => {
        axios.get("http://localhost:8083/items/" + num)
            .then((res) => {
                if (res.status == "200") {
                    setfetchItemDone(true);
                    click && window.location.reload()
                }
                setviewItem(res.data)
            }).catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
        similar();
    }

    const getInterests = () => {
        axios.get("http://localhost:8083/items/historyget?userId=" + props.user).then(res => {
            if (res.status == "200") {
                setInterestedItems(res.data)
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
        axios.post("http://localhost:8083/items/history?userId=" + localStorage.getItem("currentuser") + "&id=" + id)
            .catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }

    const check = () => {
        let darks = document.getElementsByClassName("view")
        for (const dark of darks) {
            if (sessionStorage.getItem("dark") === "true") {
                dark.classList.add("bg-dark")
                dark.classList.add("text-light")
            } else {
                dark.classList.remove("bg-dark")
                dark.classList.remove("text-light")
            }
        }
    }

    const zoom = (e) => {
        var imgs = document.getElementById("view-img")
        var imgsover = document.getElementById("view-img-zoom");
        imgsover.style.display = "inline-block"
        var posX = e.offsetX ? (e.offsetX) : e.pageX - imgs.offsetLeft - 180;
        var posY = e.offsetY ? (e.offsetY) : e.pageY - imgs.offsetTop - 100;
        imgsover.style.backgroundPosition = (-posX) + "px " + (-posY) + "px";
    }

    const zoomout = () => {
        var imgsover = document.getElementById("view-img-zoom");
        imgsover.style.display = "none"
    }

    const scrollLeft = () => {
        let scrollLeft = document.getElementById("viewsimilarscroll")
        window.scrollTo({
            left: scrollLeft.scrollLeft -= 345,
            behavior: 'smooth'
        })
    }

    const scrollRight = () => {
        let scrollRight = document.getElementById("viewsimilarscroll")
        window.scrollTo({
            left: scrollRight.scrollLeft += 345,
            behavior: 'smooth'
        })
    }

    const getReviewsOfThisItem = () => {
        axios.get("http://localhost:8083/review/item?itemId=" + num).then(a => {
            setReviewsOfItem(a.data)
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    window.onscroll = () => {
        if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 620) {
            setScroll(true)
        } else {
            setScroll(false)
        }
    }

    window.onload = document.title = viewItem.map(a => { return (a.itemName) }) + " | Shopping Mart";

    useEffect(() => {
        check();
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => {
            if (a.status == "200") {
                setfetchUserDone(true)
            }
            setUser(a.data)
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        });
        getItem();
        getReviewsOfThisItem();
        getInterests();
    }, []
    )

    return (
        <div className='container-fluid'>
            <div className='container-fluid '>
                <nav className="navbar bg-none navbar-expand-lg sticky-top">
                    <div className="container-fluid ">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa-thin fa-arrow-left btn m-1" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <i className="fa-thin fa-arrow-left btn m-1 d-none d-lg-block" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                        <Link to="/mart" className='nav-link' > <h1 className="navbar-brand">
                            <img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" />
                            &nbsp;Shopping Mart
                        </h1></Link><br></br>
                        <div className="collapse navbar-collapse justify-content-end gap-2" id="navbarTogglerDemo03">
                            <br></br>
                            <div className="btn-group ">
                                <button type="button" className="btn btn-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                    {fetchUserDone ?
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
                                            </button>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <div className="container bg-light  my-3 view" id="view" data-aos="zoom-in-up">
                {fetchItemDone ?
                    viewItem.map(item => {
                        return (
                            <div className="row " key={item.itemId}>
                                <div className="col-lg-4 text-center">
                                    <img src={item.itemImgUrl} alt={item.itemName} className="img-fluid mx-auto rounded view-img p-5" id='view-img' onMouseMove={(e) => { zoom(e) }} onMouseOut={() => { zoomout() }} />
                                    <div id='view-img-zoom' style={{ backgroundImage: "url(" + item.itemImgUrl + ")" }}></div>
                                </div>
                                <div className="col-lg-8 my-3" id='right-view'>
                                    <div className='row'>
                                        <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                            <Rating times={item.ratingOfItem} />
                                        </div>
                                        <div className='col-7 justify-content-end text-end'>
                                            <button className='btn  m-2' onClick={() => {
                                                if (localStorage.getItem("currentuser")) {
                                                    axios.post("http://localhost:8083/cart/", {
                                                        "itemId": item.itemId,
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
                                                    setInfo("Login required")
                                                }
                                            }}
                                            ><i className='fa-solid fa-cart-shopping text-info'></i></button>

                                            <button className='btn ' onClick={() => {
                                                if (localStorage.getItem("currentuser")) {
                                                    axios.post("http://localhost:8083/fav/", {
                                                        "itemId": item.itemId,
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
                                                    setInfo("Login required")
                                                }
                                            }}
                                            ><i className="fa-solid fa-heart text-danger"></i> </button>
                                        </div>
                                    </div>
                                    <h4 style={{ letterSpacing: "2px", textTransform: "capitalize" }}>{item.itemName}</h4>
                                    <div className='mx-3'>
                                        <p>Price : <b> ₹{item.itemPrice}</b></p>
                                        {item.itemSpec != "" && <p>Specifications : {item.itemSpec}</p>}
                                        {item.itemDimensions != "null" || item.itemDimensions != "" &&
                                            <p>Dimensions : {item.itemDimensions}</p>}
                                        <p>Type : {item.itemType}</p>
                                        <p>Description : {item.itemDesc}</p>
                                    </div>
                                    <div className='view-buy'>
                                        <span>Total amount : <b> ₹{item.itemPrice}</b>-&gt;</span>
                                        <Link to={"/purchase"}>
                                            <button className='btn btn-warning' onClick={() => {
                                                axios.post("http://localhost:8083/purchase/" + item.itemId + "?userId=" + props.user).catch((error) => {
                                                    setError(true);
                                                    if (error.response.data === undefined) {
                                                        setErrorMessage("Something went wrong")
                                                    } else {
                                                        setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                                                    }
                                                });
                                            }}>Buy now</button>
                                        </Link>
                                        {user.admin && <Link to={"/admin/updateitem/" + item.itemId} className='btn btn-info mx-2'>Update</Link>}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div className="row ">
                        <div className="col-lg-4 text-center">
                            <img src={loadingImg} alt="loading..." className="img-fluid mx-auto rounded view-img p-5" id='view-img' onMouseMove={(e) => { zoom(e) }} onMouseOut={() => { zoomout() }} />
                            <div id='view-img-zoom' style={{ backgroundImage: "url(" + loadingImg + ")" }}></div>
                        </div>
                        <div className='col-lg-8 my-5'>
                            <h5 className="card-title placeholder-glow">
                                <span className="placeholder col-6"></span>
                            </h5>
                            <p className="card-text placeholder-glow">
                                <span className="placeholder col-7"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-6"></span>
                                <span className="placeholder col-8"></span>
                            </p>
                            <div className='text-end '>
                                <a className="btn btn-warning disabled placeholder col-6"></a>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className='container '>
                <h3 className='view p-2 '>Reviews {reviewsOfItem.length != 0 &&("("+reviewsOfItem.length+")")}</h3>
                <div className='row rounded-5 justify-content-center d-flex g-3 '>
                    {reviewsOfItem.length != 0 ? reviewsOfItem.map((a, i) => {
                        check()
                        return (
                            <div className="container col-lg-3 col-12 my-4 mx-2 view" key={i}>
                                <div className="container-fluid p-2">
                                    <Rating times={a.rating.rating} /><span className="mx-2  fw-bold">{a.commentTitle} : {timePeriodCalculator(a.commentAddedOn)}</span> {a.user.userId === localStorage.getItem("currentuser") &&
                                        <span className='fs-6 float-end'><i className="bi bi-bookmark-fill your_comment"><span className="your_comment_text">Your comment</span></i></span>}
                                    <p className="my-1 mx-1">{a.comment}</p>
                                    {(a.imageDto != null && a.imageDto != []) && a.imageDto.map((a, i) => {
                                        return (
                                            <img key={i} src={a.imageUrl} className="mx-2 d-inline-flex justify-content-center" style={{ cursor: "zoom-in" }} width={70} height={100} onClick={() => { setShowImagePop(true); setImageUrlForToShow(a.imageUrl) }} />
                                        )
                                    })}
                                    <p className="my-2">User : {a.user.userName}</p>
                                    <p className="my-2">Added on : {a.commentAddedOn} at {a.commentAddedAt} IST</p>
                                </div>
                            </div>
                        )
                    })
                        :
                        <div className='text-light container mx-4 my-2 mx-4 fs-6'>No reviews for this item</div>}
                </div>
            </div>

            <div className='container'>
                <h3 className='view p-2'>Similar Products </h3>
                {fetchItemDone ?
                    <div className='container'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <span style={{ zIndex: "1" }}>
                                <span className='bg-warning text-dark btn btn-sm h-100 py-5 ' id='scrollleftbutton' onClick={() => { scrollLeft() }}><i className="bi bi-chevron-left "></i></span>
                            </span>
                            <div className="row row-card row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 align-content-center text-center my-3" id="viewsimilarscroll">
                                {items.filter(a => {
                                    return (
                                        a.itemType == viewItem.map(a => { return (a.itemType) }))
                                }).filter(a => {
                                    return (
                                        a.itemId != viewItem.map(a => { return (a.itemId) })
                                    )
                                }).map((a) => {
                                    return (
                                        <div className="col" key={a.itemId} style={{ overflowX: "scroll", overflowX: "visible" }}>
                                            <div className="card view-more-card">
                                                <div className='card-head row'>
                                                    <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                                        <Rating times={a.ratingOfItem} />
                                                    </div>
                                                    <div className='col-7 justify-content-end text-end'>
                                                        <button className='btn  m-2' onClick={() => {
                                                            if (localStorage.getItem("currentuser")) {
                                                                axios.post("http://localhost:8083/cart/", {
                                                                    "itemId": a.itemId,
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
                                                                setInfo("Login required")
                                                            }
                                                        }}
                                                        ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                        <button className='btn ' onClick={() => {
                                                            if (localStorage.getItem("currentuser")) {
                                                                axios.post("http://localhost:8083/fav/", {
                                                                    "itemId": a.itemId,
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
                                                                setInfo("Login required !")
                                                            }
                                                        }}
                                                        ><i className="fa-solid fa-heart text-danger"></i> </button>
                                                    </div>
                                                </div>
                                                <img src={a.itemImgUrl} className="card-img-top " alt={a.itemName} />
                                                <div className="card-body ">
                                                    <h5 className="card-title text-truncate">{a.itemName}</h5>
                                                    <p className="card-text text-truncate"> ₹{a.itemPrice}</p>
                                                    <p className='card-text text-truncate'><b>{a.itemSpec}</b></p>
                                                    <div className='text-center d-flex justify-content-center '>
                                                        <Link to={'/view/' + a.itemId + "/" + a.itemName} className='btn btn-info d-flex '
                                                            onClick={() => {
                                                                addIntoInterest(a.itemId);
                                                                return (
                                                                    window.onload(getItem())
                                                                )
                                                            }}>View More...</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })}
                            </div>
                            <span style={{ zIndex: "1" }}>
                                <span className='bg-warning text-dark justify-content-end text-end align-content-end float-end btn btn-sm py-5' id="scrollRightButton" onClick={() => { scrollRight() }}><i className="bi bi-chevron-right"></i></span>
                            </span>
                        </div>
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
            </div>

            <div className='container'>
                <h3 className='view p-2'>Your Interests </h3>
                {fetchItemDone ?

                    <div className='container'>
                        <div className="row row-card row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 align-content-start align-content-xl-center justify-content-start justify-content-lg-center text-center my-3" id="viewsimilarscroll">
                            {interesteditems.length != 0 && interesteditems.length != 1 ?
                                interesteditems
                                    .filter(a => {
                                        return (
                                            a.itemId != viewItem.map(a => { return (a.itemId) })
                                        )
                                    })
                                    .map((a) => {
                                        return (
                                            <div className="col" key={a.itemId} style={{ overflowX: "scroll", overflowX: "visible" }}>
                                                <div className="card view-more-card">
                                                    <div className='card-head row'>
                                                        <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                                            <Rating times={a.ratingOfItem} />
                                                        </div>
                                                        <div className='col-7 justify-content-end text-end'>
                                                            <button className='btn  m-2' onClick={() => {
                                                                if (localStorage.getItem("currentuser")) {
                                                                    axios.post("http://localhost:8083/cart/", {
                                                                        "itemId": a.itemId,
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
                                                                    setInfo("Login required")
                                                                }
                                                            }}
                                                            ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                            <button className='btn ' onClick={() => {
                                                                if (localStorage.getItem("currentuser")) {
                                                                    axios.post("http://localhost:8083/fav/", {
                                                                        "itemId": a.itemId,
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
                                                                    setInfo("Login required !")
                                                                }
                                                            }}
                                                            ><i className="fa-solid fa-heart text-danger"></i> </button>
                                                        </div>
                                                    </div>
                                                    <img src={a.itemImgUrl} className="card-img-top " alt={a.itemName} />
                                                    <div className="card-body ">
                                                        <h5 className="card-title text-truncate">{a.itemName}</h5>
                                                        <p className="card-text text-truncate"> ₹{a.itemPrice}</p>
                                                        <p className='card-text text-truncate'><b>{a.itemSpec}</b></p>
                                                        <div className='text-center d-flex justify-content-center '>
                                                            <Link to={'/view/' + a.itemId + "/" + a.itemName} className='btn btn-info d-flex '
                                                                onClick={() => {
                                                                    addIntoInterest(a.itemId);
                                                                    return (
                                                                        window.onload(getItem())
                                                                    )
                                                                }}>View More...</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                <div className='h6 view'>No interests found browse more...</div>
                            }
                        </div>
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
            </div>

            <div className="container-fluid" >
                <button className={scroll ? "btn btn-primary align-text-center scroll-up d-block" : "btn btn-primary align-text-center scroll-up d-none"}
                    onClick={() => {
                        return (document.documentElement.scrollTop = 0,
                            document.body.scrollTop = 0)
                    }}>
                    <h4><i className="fa-solid fa-angle-up"></i></h4></button>
            </div>

            {showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {info}
                        <div className="mt-2 pt-2">
                            <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast">Ok</button>
                        </div>
                    </div>
                </div>
            </div>}

            <br></br>
            <footer>
                <Footer />
            </footer>

            <ChatBot />

            {/* Logout popup */}
            <LogOut user={props.user} />

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

            {/* ImagePop */}
            {showImagePop &&
                <div className="d-inline-flex position-fixed" style={{ zIndex: "9", top: "10%", left: "37%" }}>
                    <img src={imageUrlForToShow} height={550} style={{ boxShadow: " rgba(0, 0, 0, 0.5) 100px 220px 700px 3000px" }} />
                    <span className="float-end mx-2 fs-4"><i className="bi bi-x-circle-fill text-light"
                        onClick={() => { setShowImagePop(false); setImageUrlForToShow("") }} style={{ cursor: "pointer" }}></i>
                    </span>
                </div>}

        </div>

    )
}
