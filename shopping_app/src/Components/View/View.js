import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "../View/Viewcss.css";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import ChatBot from '../ChatBot/ChatBot';

export default function View(props) {

    let num = window.location.href.replaceAll("%20", " ").substring(window.location.href.indexOf("view/") + 5, window.location.href.indexOf("view/") + 7).replace("/", "").trim();

    const [viewItem, setviewItem] = useState([]);

    const [info, setInfo] = useState("");

    const [userName, setUserName] = useState([]);

    const [items, setItems] = useState([]);

    const [showToast, setShowToast] = useState(false);

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    const similar = () => {
        axios.get("http://localhost:8083/items/").then(res => { return (setItems(res.data)) })
    }

    const getItem = () => {
        axios.get("http://localhost:8083/items/" + num)
            .then((res) => { setviewItem(res.data) })
        similar();
    }

    const check = () => {
        let darks = document.getElementsByClassName("view")
        for (const dark of darks) {
            if (sessionStorage.getItem("dark")) {
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

    window.onload = document.title = viewItem.map(a => { return (a.itemName) }) + " | Shopping Mart";

    useEffect(() => {
        check();
        sessionStorage.getItem("dark") ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        axios.get("http://localhost:8083/user/" + props.user).then(a => setUserName(a.data.userName));
        getItem()
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
                                    <i className="fa-solid fa-user"></i>&nbsp; {userName}
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
                {viewItem.map(item => {
                    return (
                        <div className="row " key={item.itemId}>
                            <div className="col-lg-4 text-center">
                                <img src={item.itemImgUrl} alt={item.itemName} className="img-fluid mx-auto rounded view-img p-5" id='view-img' onMouseMove={(e) => { zoom(e) }} onMouseOut={() => { zoomout() }} />
                                <div id='view-img-zoom' style={{ backgroundImage: "url(" + item.itemImgUrl + ")" }}></div>
                            </div>
                            <div className="col-lg-8 my-3" id='right-view'>
                                <div className='text-end'>
                                    <button className='btn  m-2' onClick={() => {
                                        if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                            axios.post("http://localhost:8083/cart/", {
                                                "itemId": item.itemId,
                                                "itemName": item.itemName,
                                                "itemDesc": item.itemDesc,
                                                "itemPrice": item.itemPrice,
                                                "itemType": item.itemType,
                                                "itemDimensions": item.itemDimensions,
                                                "itemImgUrl": item.itemImgUrl,
                                                "itemSpec": item.itemSpec,
                                                "userId": localStorage.getItem("currentuser")
                                            }, []).then((res) => { return (setInfo(res.data)) })
                                        } else {
                                            setInfo("Login required")
                                        }
                                    }}
                                        data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo"
                                    ><i className='fa-solid fa-cart-shopping text-info'></i></button>

                                    <button className='btn ' onClick={() => {
                                        if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                            axios.post("http://localhost:8083/fav/", {
                                                "itemId": item.itemId,
                                                "itemName": item.itemName,
                                                "itemDesc": item.itemDesc,
                                                "itemPrice": item.itemPrice,
                                                "itemType": item.itemType,
                                                "itemDimensions": item.itemDimensions,
                                                "itemImgUrl": item.itemImgUrl,
                                                "itemSpec": item.itemSpec,
                                                "userId": localStorage.getItem("currentuser")
                                            }, []).then((res) => { return (setInfo(res.data)) })
                                        } else {
                                            setInfo("Login required")
                                        }
                                    }}
                                        data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo"
                                    ><i className="fa-solid fa-heart text-danger"></i> </button>
                                </div>
                                <h4 style={{ letterSpacing: "2px", textTransform: "capitalize" }}>{item.itemName}</h4>
                                <div className='mx-3'>
                                    <p>Price : <b>{item.itemPrice}</b></p>
                                    <p>Specifications : {item.itemSpec}</p>
                                    {!item.itemDimensions == "" ?
                                        <p>Dimensions : {item.itemDimensions}</p> : ""}
                                    <p>Type : {item.itemType}</p>
                                    <p>Quality : {item.itemDesc}</p>
                                </div>
                                <div className='view-buy'>
                                    <span>Total amount : <b>{item.itemPrice}</b>-&gt;</span>
                                    <Link to={"/purchase"}>
                                        <button className='btn btn-warning' onClick={() => {
                                            axios.get("http://localhost:8083/purchase/" + item.itemId);
                                        }}>Buy now</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className='container'>
                <h3 className='view p-2'>Similar Products </h3>
                <div className="row row-card row-cols-2 row-cols-md-4 g-4 align-content-center justify-content-center my-3" >
                    {items.filter(a => {
                        return (
                            a.itemType == viewItem.map(a => { return (a.itemType) }))
                    }).filter(a => {
                        return (
                            a.itemId != viewItem.map(a => { return (a.itemId) })
                        )
                    }).map((a) => {
                        return (
                            <div className="col" key={a.itemId} style={{cursor:"grab",overflowX:"scroll",overflowX:"visible"}}>
                                <div className="card view-more-card">
                                    <div className='card-head text-end'>
                                        <button className='btn  m-2' onClick={() => {
                                            if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                                axios.post("http://localhost:8083/cart/", {
                                                    "itemId": a.itemId,
                                                    "itemName": a.itemName,
                                                    "itemDesc": a.itemDesc,
                                                    "itemPrice": a.itemPrice,
                                                    "itemType": a.itemType,
                                                    "itemDimensions": a.itemDimensions,
                                                    "itemImgUrl": a.itemImgUrl,
                                                    "itemSpec": a.itemSpec,
                                                    "userId": localStorage.getItem("currentuser")
                                                }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                            } else {
                                                setInfo("Login required")
                                            }
                                        }}
                                        ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                        <button className='btn ' onClick={() => {
                                            if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
                                                axios.post("http://localhost:8083/fav/", {
                                                    "itemId": a.itemId,
                                                    "itemName": a.itemName,
                                                    "itemDesc": a.itemDesc,
                                                    "itemPrice": a.itemPrice,
                                                    "itemType": a.itemType,
                                                    "itemDimensions": a.itemDimensions,
                                                    "itemImgUrl": a.itemImgUrl,
                                                    "itemSpec": a.itemSpec,
                                                    "userId": localStorage.getItem("currentuser")
                                                }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                            } else {
                                                setInfo("Login required !")
                                            }
                                        }}
                                        ><i className="fa-solid fa-heart text-danger"></i> </button>
                                    </div>
                                    <img src={a.itemImgUrl} className="card-img-top " alt={a.itemName} />
                                    <div className="card-body">
                                        <h5 className="card-title text-truncate">{a.itemName}</h5>
                                        <p className="card-text text-truncate">{a.itemPrice}</p>
                                        <p><b>{a.itemSpec}</b></p>
                                        <div className='text-center d-flex justify-content-center '>
                                            <Link to={'/view/' + a.itemId + "/" + a.itemName} className='btn btn-info d-flex'
                                                onClick={() => {
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

            <footer>
                <Footer />
            </footer>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
            <ChatBot />

            {/* Logout popup */}
            <div className="modal fade " id="exampleModal3" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content logout-model">
                        <div className="modal-header">
                            <h5 className="modal-title " id="exampleModalLabel"><img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" /> Shopping mart</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <h5>Conform to logout</h5>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-success" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-outline-danger"
                                onClick={() => {
                                    return (localStorage.removeItem("currentuser"),
                                        localStorage.removeItem("Raghu"),
                                        window.location.reload())
                                }}
                            >Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
