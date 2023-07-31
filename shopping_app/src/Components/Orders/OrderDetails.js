import React, { useEffect, useState } from 'react'
import "../Orders/Orders.css"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer';
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import ChatBot from '../ChatBot/ChatBot';
import loadingImg from "../Loading_Card.png";
import LogOut from '../Login/LogOut';
import Rating from '../Items/Rating/Rating';
import Review from './Review';
import timePeriodCalculator from './TimePeriodCalculator';

export default function OrderDetails(props) {

    const [user, setUser] = useState([]);

    const [order, setOrder] = useState([]);

    const [showToast, setShowToast] = useState(false);

    const [orderId, setOrderId] = useState("");

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [ratingOfUserForItem, setRatingOfUserForItem] = useState([]);

    const [userRatingforItem, setUserRatingforItem] = useState("");

    const [showThankYou, setShowThankYou] = useState(false);

    const [showMsgeSendPopUp, setShowMsgeSendPopUp] = useState(false);

    const [mailMsge, setMailMsge] = useState("Sending...");

    const nav = useNavigate();

    const fetchOrders = () => {
        axios.get("http://localhost:8083/orders/").then((res) => {
            setOrder(res.data)
            Promise.resolve(getRatingOfUserForItem(res.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        });
    }

    const showCopyMessage = (e) => {
        navigator.clipboard.writeText(e);
        document.getElementById("showMessage").innerHTML = "Copied to clipboard"
        setTimeout(() => {
            document.getElementById("showMessage").innerHTML = ""
        }, 2000)
    }

    const getRatingOfUserForItem = (item) => {
        axios.get('http://localhost:8083/rating/user/' + props.user + "/" + item.map(a => { return (a.item.itemId) }))
            .then(a => {
                a.data == "" ? setRatingOfUserForItem({ itemId: Number(item.map(a => { return (a.item.itemId) })), userId: props.user, rating: 0 }) : setRatingOfUserForItem(a.data);
                a.data == "" ? setUserRatingforItem(0) : setUserRatingforItem(a.data.rating);
            })
            .catch((error) => {
                setError(true);
                if (error.response === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            });
    }

    const updateRating = () => {
        axios.post("http://localhost:8083/rating/", {
            "itemId": ratingOfUserForItem.itemId,
            "userId": ratingOfUserForItem.userId,
            "rating": userRatingforItem
        }).then(a => {
            getRatingOfUserForItem(order);
            setShowThankYou(true)
            setTimeout(() => {
                setShowThankYou(false);
            }, 2000);
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong1")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        });
    }

    const sendMail = async (itemName, url) => {
        if (itemName) {
            await axios.post("http://localhost:8083/mail/sendMailWithAttachment?url=" + url + "&itemName=" + itemName, {
                "recipient": user.userEmail,
                "msgBody": `Hi ${user.userName},
    Here is the invoice bill attached to this mail you can use it for reference.
    Thank you for shopping with us.`,
                "subject": "Order details of " + itemName
            }).then(a => {
                setMailMsge(a.data);
                setTimeout(() => {
                    setShowMsgeSendPopUp(false);
                    setMailMsge("");
                }, 3000);
                console.log(a.data);
            }).catch((error) => {
                setMailMsge("Something went wrong");
                setTimeout(() => {
                    setShowMsgeSendPopUp(false);
                    setMailMsge("");
                }, 3000);
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            });
        }
    }

    useEffect(() => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        document.title = "Orders | Shopping Mart"
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => {
            if (a.status == "200") {
                setfetchDone(true)
                fetchOrders()
            }
            return (setUser(a.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
        fetchOrders()
        let card = document.getElementsByClassName("card-color");
        if (sessionStorage.getItem("dark") === "true") {
            for (const cards of card) {
                cards.classList.add("bg-dark")
                cards.classList.add("text-light")
                cards.classList.remove("bg-light")
                cards.classList.remove("text-dark")
            }
        } else {
            for (const cards of card) {
                cards.classList.remove("bg-dark")
                cards.classList.add("bg-light")
                cards.classList.add("text-dark")
                cards.classList.remove("text-light")
            }
        }
    }, []);

    return (
        <div>
            <div className='container-fluid' style={{ fontSize: "13px" }}>
                {/* Header */}
                < header className='cart-head' >
                    <div className='container-fluid '>
                        <nav className="navbar bg-none navbar-expand-lg sticky-top">
                            <div className="container-fluid ">
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                                    <i className="fa-thin fa-arrow-left btn m-1" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <i className="fa-thin fa-arrow-left btn m-1 d-none d-lg-block" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                                <Link to="/mart" className='nav-link' >  <h1 className="navbar-brand" >
                                    <img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" />
                                    &nbsp;Shopping Mart
                                </h1></Link><br></br>
                                <div className="collapse navbar-collapse justify-content-end gap-2" id="navbarTogglerDemo03">
                                    <br></br>
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                            {fetchDone ?
                                                <span>{user.profileImgUrl ? <img src={user.profileImgUrl} width={25} height={25} />
                                                    : <i className="fa-solid fa-user"></i>}&nbsp;{user.userName}
                                                </span>
                                                : <span className="placeholder-glow">
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
                                    </div>&nbsp;
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>

                <div className='container my-4'>
                    {fetchDone ?
                        <div className='card-color p-3'>
                            {order.map(a => {
                                return (
                                    <div key={a.orderUUIDId}>
                                        <div className='row'>
                                            <div className='col-12 col-md-6'>
                                                <small className='text-muted'>Order id : {a.orderUUIDId} &nbsp;<i className="bi bi-clipboard btn btn-sm btn-outline-info" onClick={() => {
                                                    showCopyMessage(a.orderUUIDId)
                                                }}></i>&nbsp;<span id='showMessage' className='text-success'></span></small>
                                            </div>
                                            {a.orderStatus == "delivered" && <>
                                                <div className='col-12 col-md-6 justify-content-md-end justify-content-center my-1 d-flex gap-2' >
                                                    <a href={"http://localhost:8083/pdf/generate/" + a.orderUUIDId} className='btn btn-sm btn-primary' disabled={showMsgeSendPopUp}>Download e-bill here <i className='bi bi-download'></i></a>
                                                    <button className='btn btn-sm btn-warning' onClick={() => { sendMail(a.item.itemName, "http://localhost:8083/pdf/generate/" + a.orderUUIDId); setShowMsgeSendPopUp(true); setMailMsge("Sending...") }} disabled={showMsgeSendPopUp}>Send e-bill to mail <i className="bi bi-forward-fill"></i></button>
                                                </div>
                                            </>
                                            }
                                        </div>

                                        <div className="justify-content-center d-flex my-3 d-md-none">
                                            <Link to={'/view/' + a.item.itemId + "/" + a.item.itemName} className=''>
                                                <img src={a.item.itemImgUrl} className="img-fluid rounded-start" width={100} height={100} alt={a.item.itemName} />
                                            </Link>
                                        </div>
                                        <div className='d-flex justify-content-center my-3 d-md-none'>
                                            <Rating times={a.item.ratingOfItem} />
                                        </div>
                                        <div className='row'>
                                            <div className='col-12 col-md-8'> <hr></hr>
                                                <div className='row'>
                                                    <h4 className='col-6 col-md-9 text-capitalize'>{a.item.itemName} </h4>
                                                    {a.orderStatus == "success" && <h6 className='text-end col-6 col-md-3 text-success'>Placed</h6>}
                                                    {a.orderStatus == "dispatched" && <h6 className='text-end col-6 col-md-3 text-primary'>Dispatched</h6>}
                                                    {a.orderStatus == "near by hub" && <h6 className='text-end col-6 col-md-3 text-info'>Near by Hub</h6>}
                                                    {a.orderStatus == "cancelled" && <h6 className='text-end col-6 col-md-3 text-danger'>Cancelled</h6>}
                                                    {a.orderStatus == "delivered" && <h6 className='text-end col-6 col-md-3 text-warning'><i className="bi bi-check-circle-fill"></i> Delivered</h6>}
                                                </div>
                                                <p className='p-3 h6'><b> Price :  ₹{a.item.itemPrice}</b></p>
                                                <h6>Order Details</h6>
                                                <div className='px-3'>
                                                    <p>Ordered on  <b>{a.orderedOn}</b> at <b>{a.orderedAt}</b> sec</p>
                                                    {a.orderStatus == "cancelled" ? <p className='text-decoration-line-through'>Expected delivery on {a.deliveryDate}</p> :
                                                        a.orderStatus == "delivered" ? <p>Delivered on <b> {timePeriodCalculator(a.deliveryDate)} {a.deliveryDate}</b></p> :
                                                            <p>Expected delivery on <b>{a.deliveryDate}</b></p>}
                                                </div>
                                                <h6>Delivery Details</h6>
                                                <div className="container text-center g-3 ">
                                                    <div className="row">
                                                        <div className="col"> <p><b>Name</b> : {a.firstName + " " + a.lastName}</p>  </div>
                                                        {a.emailAddress != "" && <div className="col">  <p><b>Email address</b> : {a.emailAddress}</p></div>}
                                                        <div className="col">  <p><b>Mobile Number</b> : {a.phoneNumber}</p></div>
                                                    </div>
                                                    <div className='row'>
                                                        {a.pincode != null && <div className="col"> <p><b>Pincode</b> : {a.pincode}</p></div>}
                                                        {a.orderQuantity != null && <div className="col">  <p><b>Quantity</b> : {a.orderQuantity}</p></div>}
                                                        {a.paymentType != null && <div className="col"> <p><b>Payment type</b> : {a.paymentType.toUpperCase()}</p></div>}
                                                    </div>
                                                    <div className='row'>
                                                        {a.deliveryAddress != null && <div className="col"> <p><b>Delivery Address</b> : {a.deliveryAddress}</p></div>}
                                                    </div>
                                                </div>
                                                {a.orderStatus != "cancelled" && a.orderStatus != "near by hub" && a.orderStatus != "delivered" && <>
                                                    <hr></hr>
                                                    <div className=''>
                                                        <p className='text-info text-muted text-start'> Note : You can cancel this before reaching to near by hub</p>
                                                        <p className='text-center'>Do you want to cancel this order? &nbsp;<button className='btn btn-danger btn-sm' onClick={() => {
                                                            setOrderId(a.orderUUIDId);
                                                            setShowToast(true);
                                                        }}>Cancel Order</button></p>
                                                    </div>
                                                </>
                                                }

                                                {/* Rating */}
                                                {a.orderStatus == "delivered" &&
                                                    <div className='justify-content-center text-center'>
                                                        <hr></hr>
                                                        <h6>Rate this Product</h6>
                                                        <span className='fs-4' style={{ cursor: "pointer" }}>
                                                            <span >
                                                                {userRatingforItem == 5 &&
                                                                    <span className='d-inline-flex gap-1'>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(1) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(2) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(3) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(4) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(5) }}></i>
                                                                    </span>
                                                                }
                                                                {userRatingforItem == 4 &&
                                                                    <span className='d-inline-flex gap-1'>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(1) }} ></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(2) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(3) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(4) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(5) }}></i>
                                                                    </span>
                                                                }
                                                                {userRatingforItem == 3 &&
                                                                    <span className='d-inline-flex gap-1'>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(1) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(2) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(3) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(4) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(5) }}></i>
                                                                    </span>
                                                                }
                                                                {userRatingforItem == 2 &&
                                                                    <span className='d-inline-flex gap-1'>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(1) }}></i>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(2) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(3) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(4) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(5) }}></i>
                                                                    </span>
                                                                }
                                                                {(userRatingforItem == 1 || userRatingforItem == 0) &&
                                                                    <span className='d-inline-flex gap-1'>
                                                                        <i className="bi bi-star-fill text-success" onMouseMove={() => { setUserRatingforItem(1) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(2) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(3) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(4) }}></i>
                                                                        <i className="bi bi-star text-success" onMouseMove={() => { setUserRatingforItem(5) }}></i>
                                                                    </span>
                                                                }
                                                            </span>
                                                        </span>
                                                        <br></br>
                                                        <div className={(userRatingforItem != ratingOfUserForItem.rating) ? 'btn btn-sm btn-success px-5' : 'btn btn-sm  btn-success px-5 disabled'} onClick={() => { updateRating() }}>Submit</div>
                                                        <div className={showThankYou ? "d-lg-inline-flex text-dark bg-warning px-5 d-none" : "d-none text-dark bg-warning px-5 d-none"} id='thank-you-rating'>Thanks for giving {ratingOfUserForItem.rating} stars</div>
                                                    </div>}
                                                <hr></hr>

                                                {/* Review */}
                                                {a.orderStatus == "delivered" && <Review itemId={a.item.itemId} />}

                                            </div>
                                            <div className='col-4 text-center w-25 h-25 d-md-block d-none '>
                                                <div className='justify-content-center my-3  fs-6'>
                                                    <Rating times={a.item.ratingOfItem} />
                                                </div>
                                                <Link to={'/view/' + a.item.itemId + "/" + a.item.itemName} className=''>
                                                    <img src={a.item.itemImgUrl} className="img-fluid rounded-start d-md-block d-none float-end " alt={a.item.itemName} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <div className='card-color p-3'>
                            <div className='row'>
                                <div className='col-12 col-md-8'>
                                    <div className="card-body">
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                    </div>
                                </div>
                                <div className='col-4 text-end w-25 h-25'>
                                    <img src={loadingImg} className="card-img-top" alt="..." />
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <Footer />

                {showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            Due you want to cancel this order?
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast"
                                    onClick={() => {
                                        axios.put("http://localhost:8083/orders/updateOrder/" + orderId + "/" + "cancelled").then(() => {
                                            nav("/orders")
                                        }).catch((error) => {
                                            setError(true);
                                            if (error.response.data === undefined) {
                                                setErrorMessage("Something went wrong")
                                            } else {
                                                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                                            }
                                        });
                                        setShowToast(false);
                                    }}
                                >Yes</button>&nbsp;&nbsp;
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => {
                                    setShowToast(false)
                                }}>No</button>
                            </div>
                        </div>
                    </div>
                </div>}

                {/* Logout popup */}
                <LogOut user={props.user} />
            </div>

            {/* Mail popup */}
            {showMsgeSendPopUp &&
                <div className="justify-content-center d-inline-flex ">
                    <div className={mailMsge == "Sending..." ? "d-inline-flex position-fixed bg-info text-dark px-5 py-3" : mailMsge == "Something went wrong" ? "d-inline-flex position-fixed bg-danger text-light px-5 py-3" : "d-inline-flex position-fixed bg-success text-light px-5 py-3"} style={{ zIndex: "9", top: "25%", left: "40%", boxShadow: " rgba(0, 0, 0, 0.5) 100px 220px 700px 3000px" }}>
                        <h5>{mailMsge}</h5>
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
            <ChatBot />

        </div>
    )
}