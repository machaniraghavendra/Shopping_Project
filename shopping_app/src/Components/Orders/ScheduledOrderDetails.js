import React, { useEffect, useState } from 'react'
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import LogOut from '../Login/LogOut';
import loadingImg from "../Loading_Card.png";
import Rating from '../Items/Rating/Rating';

export default function ScheduledOrderDetails(props) {

    const [fetchDone, setfetchDone] = useState(false);

    const [user, setUser] = useState([]);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [order, setOrder] = useState();

    const [address, setAddress] = useState("");

    const fetchOrder = (scheduledId) => {
        axios.get("http://localhost:8083/scheduled/order/" + scheduledId).then((res) => {
            setOrder(res.data);
            setfetchDone(true)
            getAddress(res.data.orderScheduler.orderDetails.deliveryAddress);
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        });
    }
    const getAddress = (a) => {
        axios.get("http://localhost:8083/city-pincode/get-string/" + a)
            .then(a => {
                setAddress(a.data)
            })
            .catch(error => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }

    let nav = useNavigate();

    const unscheduleOrder = () => {
        axios.delete("http://localhost:8083/scheduled/delete/order?scheduledId=" + order.orderScheduler.uuid).then(a => {
            if (a.status == 200) {
                nav("/orders/scheduled")
            }
        }).catch(a => {
            setError(true);
            if (error.response === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    useEffect(() => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        document.title = "Orders | Shopping Mart"
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => {
            if (a.status == "200") {
                let url = window.location.href;
                let scheduledId = url.substring(url.length - url.lastIndexOf("/") + 2);
                fetchOrder(scheduledId)
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
        <div className='container-fluid'>
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

            <div className='container'>
                {fetchDone ?
                    <div className='card-color p-3'>
                        <div className='row'>
                            <div className='col-12 col-md-3 justify-content-center d-flex my-3 d-md-none'>
                                <Link to={'/view/' + order.item.itemId + "/" + order.item.itemName} className=''>
                                    <img src={order.item.itemImgUrl} className="img-fluid rounded-start" width={100} height={200} alt={order.item.itemName} />
                                </Link>
                            </div>
                            <div className='d-flex justify-content-center my-3 d-md-none'>
                                <Rating times={order.item.ratingOfItem} />
                            </div>
                            <div className='col-12 col-md-9'>
                                <div className='container'>
                                    <h4 className='text-truncate text-capitalize'>{order.item.itemName}</h4>
                                    <br></br>
                                    <h6>Delivery Details</h6>
                                    <div className="container text-md-center text-start g-3 ">
                                        <div className="row">
                                            <div className="col-12 col-md-4"> <p><b>Name</b> : {order.orderScheduler.orderDetails.firstName + " " + order.orderScheduler.orderDetails.lastName}</p>  </div>
                                            {order.orderScheduler.orderDetails.emailAddress != "" && <div className="col-12 col-md-4">  <p><b>Email address</b> : {order.orderScheduler.orderDetails.emailAddress}</p></div>}
                                            <div className="col-12 col-md-4">  <p><b>Mobile Number</b> : {order.orderScheduler.orderDetails.phoneNumber}</p></div>
                                        </div>
                                        <div className='row'>
                                            {order.orderScheduler.orderDetails.orderQuantity != null && <div className="col-12 col-md-4">  <p><b>Quantity</b> : {order.orderScheduler.orderDetails.orderQuantity}</p></div>}
                                            {order.orderScheduler.orderDetails.paymentType != null && <div className="col-12 col-md-4"> <p><b>Payment type</b> : {order.orderScheduler.orderDetails.paymentType.toUpperCase()}</p></div>}
                                        </div>
                                        <div className='row'>
                                            {order.orderScheduler.orderDetails.deliveryAddress != null && <div className="col-12 "> <p><b>Delivery Address</b> : {address}</p></div>}
                                            {(order.orderScheduler.orderDetails.totalOrderAmount != null && order.orderScheduler.orderDetails.totalOrderAmount !== "") && <div className="col-12 col-md-6 fs-6 text-center "> <p><b>Total amount : ₹{order.item.itemPrice} x {order.orderScheduler.orderDetails.orderQuantity} = ₹ {order.orderScheduler.orderDetails.totalOrderAmount}.00</b></p></div>}
                                        </div>
                                    </div>
                                    {(!order.orderScheduler.isDeleted && order.orderScheduler.jobCompleted == false)&& <div className='justify-content-center d-flex'>
                                        <div className='btn btn-danger' onClick={() => { unscheduleOrder() }}>Unschedule</div>
                                    </div>}
                                </div>
                            </div>
                            <div className='col-4 text-center w-25 h-25 d-md-block d-none '>
                                <div className='justify-content-center my-3  fs-6'>
                                    <Rating times={order.item.ratingOfItem} />
                                </div>
                                <Link to={'/view/' + order.item.itemId + "/" + order.item.itemName} className=''>
                                    <img src={order.item.itemImgUrl} className="img-fluid rounded-start d-md-block d-none float-end " alt={order.item.itemName} />
                                </Link>
                            </div>
                        </div>
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
                    </div>}
            </div>

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

            {/* Logout popup */}
            <LogOut user={props.user} />
        </div>
    );
}