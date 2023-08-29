import React, { useEffect, useState } from 'react'
import "../Orders/Orders.css"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import ChatBot from '../ChatBot/ChatBot';
import loadingImg from "../Loading_Card.png";
import LogOut from '../Login/LogOut';
import timePeriodCalculator from './TimePeriodCalculator';

export default function Orders(props) {

    const [user, setUser] = useState([]);

    const [orders, setOrders] = useState([]);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [deliveryItemsView, setDeliveryItemsView] = useState(false);

    let deliveryitemsCount = 0;

    const fetchOrders = () => {
        axios.get("http://localhost:8083/orders/orderWithUser?userId=" + props.user).then((res) => {
            if (res.status == "200") {
                setfetchDone(true)
            }
            setOrders(res.data);
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    // const updateOrder = () => {
    //     orders.forEach(order => {
    //         axios.put("http://localhost:8083/orders/updateOrderStatus/" + order.orderUUIDId).catch((error) => {
    //             setError(true);
    //             if (error.response.data === undefined) {
    //                 setErrorMessage("Something went wrong")
    //             } else {
    //                 setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
    //             }
    //         })
    //     })
    // }

    const viewOrder = (e) => {
        axios.get("http://localhost:8083/orders/saveorder/" + e);
    }

    const check = () => {
        let card = document.getElementsByClassName("card-color");
        if (sessionStorage.getItem("dark") === "true") {
            for (const cards of card) {
                cards.classList.add("bg-dark")
                cards.classList.add("text-light")
                cards.classList.remove("bg-light")
                cards.classList.remove("text-dark")
            }
        }
        if (!sessionStorage.getItem("dark") === "true") {
            for (const cards of card) {
                cards.classList.remove("bg-dark")
                cards.classList.add("bg-light")
                cards.classList.add("text-dark")
                cards.classList.remove("text-light")
            }
        }
    }

    setTimeout(() => {
        if (fetchDone) {
            check();
        }
    }, 10);

    useEffect(() => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        document.title = "Orders | Shopping Mart"
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => { return (setUser(a.data)) }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
        fetchOrders()

    }, []);

    return (
        <div className='container-fluid'>
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
                    <h2 className='align-items-center d-flex justify-content-center text-info'>Your Orders </h2>
                    {fetchDone ?
                        <div className='row rounded-5 justify-content-center d-flex g-3 '>

                            {/* Delivery toggle */}
                            <div className='p-1 bg-secondary w-75' style={{ fontSize: "13px", cursor: "pointer" }} onClick={() => { setDeliveryItemsView(!deliveryItemsView); sessionStorage.setItem("showDeliveryItems", !deliveryItemsView) }}>
                                <span className='text-light px-2 fs-6'>Delivered Items {(deliveryItemsView || sessionStorage.getItem("showDeliveryItems") === "true" ? true : false) ? <i className="bi bi-caret-down"></i> : <i className="bi bi-caret-right"></i>}</span>
                            </div>
                            {/* <div className={deliveryItemsView ? 'py-2 d-block viewbg' : 'py-2 d-none viewbg'}> */}
                            {
                                orders
                                    .filter(item => {
                                        if (item.orderStatus === "delivered") {
                                            return item;
                                        }
                                    })
                                    .map((item,i) => {
                                        deliveryitemsCount++;
                                        return (
                                            <div className={(deliveryItemsView || sessionStorage.getItem("showDeliveryItems") === "true" ? true : false) ? 'py-2 d-block col-lg-6' : 'py-2 d-none col-lg-6'} key={i}>
                                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                                    <div className="row g-0" >
                                                        <div className="col-md-3 d-none d-md-flex justify-content-center">
                                                            <img src={item.item.itemImgUrl} className="img-fluid rounded-start d-md-block d-none w-50 h-100 d-block" alt={item.item.itemName} style={{ marginLeft: "auto", marginRight: "auto" }} />
                                                        </div>
                                                        <div className="col-md-8 ">
                                                            <small className='text-muted '>Order id : {item.orderUUIDId}</small>
                                                            <div className="card-body">
                                                                <Link to={'/orderdetails'} className="link-info  stretched-link" onClick={() => { viewOrder(item.orderUUIDId) }}></Link>
                                                                <div className='row'>
                                                                    <h5 className="card-title float-start col-6 text-truncate text-capitalize">{item.item.itemName} </h5>
                                                                    {item.orderStatus == "success" && <p className='col-3 badge text-bg-success'><b>Placed</b></p>}
                                                                    {item.orderStatus == "dispatched" && <p className='col-3 text-center  badge text-bg-primary'><b>Dispatched</b></p>}
                                                                    {item.orderStatus == "near by hub" && <p className='col-3 text-center  badge text-bg-info'><b>Near by Hub</b></p>}
                                                                    {item.orderStatus == "cancelled" && <p className='col-3 text-center  badge text-bg-danger'><b>Cancelled</b></p>}
                                                                    {item.orderStatus == "delivered" && <p className='col-3 text-center  badge text-bg-warning'><b><i className="bi bi-check-circle-fill"></i> Delivered</b></p>}
                                                                    <p className="card-title float-end col-3 text-end text-truncate"><b> ₹{item.item.itemPrice}</b></p>
                                                                </div>
                                                                <div className='row py-2'> <p className="card-text">Ordered on {item.orderedOn}</p></div>
                                                                <div className='row'>
                                                                    {item.orderStatus == "cancelled" ? <p className='text-decoration-line-through'>Expected delivery on {item.deliveryDate}</p> :
                                                                        item.orderStatus == "delivered" ? <p>Delivered on {timePeriodCalculator(item.deliveryDate)}  <b>{item.deliveryDate}</b></p> :
                                                                            <p>Expected delivery on <b>{item.deliveryDate}</b></p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                            }

                            {(deliveryitemsCount === 0 && deliveryItemsView) && <div className='container justify-content-center d-flex g-3 w-100 h-100 '>
                                <div className='text-center card-color p-3 m-2 '>
                                    <h5 className='text-light'>No delivery orders found !</h5>
                                    <Link to={"/mart"} className="btn btn-outline-primary m-2 ">View products</Link>
                                </div>
                            </div>}
                            {/* </div> */}

                            <hr></hr>
                            <span className='bg-secondary text-light mx-2 py-2 w-75 fs-6' style={{ cursor: "pointer" }} onClick={() => { setDeliveryItemsView(!deliveryItemsView); sessionStorage.setItem("showDeliveryItems", !deliveryItemsView) }}>Non- delivered products {!(deliveryItemsView || sessionStorage.getItem("showDeliveryItems") === "true" ? true : false) ? <i className="bi bi-caret-down"></i> : <i className="bi bi-caret-right"></i>}</span>
                            {/* All products */}
                            {orders.length == 0 ?
                                <div className='container justify-content-center d-flex g-3 w-100 h-100 '>
                                    <div className='text-center card-color p-3 w-50'>
                                        <img src={img} alt="" width="100" height="100" className="d-inline-block align-text-top m-4" />
                                        <h5>No orders Found</h5>
                                        <Link to={"/mart"} className="btn btn-outline-primary m-2 ">View products</Link>
                                    </div>
                                </div>
                                :
                                orders
                                    .filter(item => {
                                        if (item.orderStatus != "delivered") {
                                            return item;
                                        }
                                    })
                                    .map(item => {
                                        return (
                                            <div className={!(deliveryItemsView || sessionStorage.getItem("showDeliveryItems") === "true" ? true : false) ? 'py-2 d-block col-lg-6' : 'py-2 d-none col-lg-6'} key={item.item.itemId}>
                                                {/* <div className='col-lg-6'> */}
                                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                                    <div className="row g-0" >
                                                        <div className="col-md-3 d-none d-md-flex justify-content-center">
                                                            <img src={item.item.itemImgUrl} className="img-fluid rounded-start d-md-block d-none w-50 h-100 d-block" alt={item.item.itemName} style={{ marginLeft: "auto", marginRight: "auto" }} />
                                                        </div>
                                                        <div className="col-md-8 ">
                                                            <small className='text-muted '>Order id : {item.orderUUIDId}</small>
                                                            <div className="card-body">
                                                                <Link to={'/orderdetails'} className="link-info  stretched-link" onClick={() => { viewOrder(item.orderUUIDId) }}></Link>
                                                                <div className='row'>
                                                                    <h5 className="card-title float-start col-6 text-truncate text-capitalize">{item.item.itemName} </h5>
                                                                    {item.orderStatus == "success" && <p className='col-3 badge text-bg-success'><b>Placed</b></p>}
                                                                    {item.orderStatus == "dispatched" && <p className='col-3 text-center  badge text-bg-primary'><b>Dispatched</b></p>}
                                                                    {item.orderStatus == "near by hub" && <p className='col-3 text-center  badge text-bg-info'><b>Near by Hub</b></p>}
                                                                    {item.orderStatus == "cancelled" && <p className='col-3 text-center  badge text-bg-danger'><b>Cancelled</b></p>}
                                                                    {item.orderStatus == "delivered" && <p className='col-3 text-center  badge text-bg-warning'><b><i className="bi bi-check-circle-fill"></i> Delivered</b></p>}
                                                                    <p className="card-title float-end col-3 text-end text-truncate"><b> ₹{item.item.itemPrice}</b></p>
                                                                </div>
                                                                <div className='row py-2'> <p className="card-text">Ordered on {item.orderedOn}</p></div>
                                                                <div className='row'>
                                                                    {item.orderStatus == "cancelled" ? <p className='text-decoration-line-through'>Expected delivery on {item.deliveryDate}</p> :
                                                                        item.orderStatus == "delivered" ? <p>Delivered on <b>{item.deliveryDate}</b></p> :
                                                                            <p>Expected delivery on <b>{item.deliveryDate}</b></p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                            </div>
                                        )
                                    })
                            }
                        </div>
                        :
                        <div className="row g-4">
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                    <div className="row g-0" >
                                        <div className="col-md-4 d-none d-lg-flex justify-content-center">
                                            <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                        </div>
                                        <div className="col-md-8 ">
                                            <div className="card-body">
                                                <p className="card-text placeholder-glow">
                                                    <span className="placeholder col-7"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-6"></span>
                                                    <span className="placeholder col-8"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                    <div className="row g-0" >
                                        <div className="col-md-4 d-none d-lg-flex justify-content-center">
                                            <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                        </div>
                                        <div className="col-md-8 ">
                                            <div className="card-body">
                                                <p className="card-text placeholder-glow">
                                                    <span className="placeholder col-7"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-6"></span>
                                                    <span className="placeholder col-8"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                    <div className="row g-0" >
                                        <div className="col-md-4 d-none d-lg-flex justify-content-center">
                                            <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                        </div>
                                        <div className="col-md-8 ">
                                            <div className="card-body">
                                                <p className="card-text placeholder-glow">
                                                    <span className="placeholder col-7"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-6"></span>
                                                    <span className="placeholder col-8"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                    <div className="row g-0" >
                                        <div className="col-md-4 d-none d-lg-flex justify-content-center">
                                            <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                        </div>
                                        <div className="col-md-8 ">
                                            <div className="card-body">
                                                <p className="card-text placeholder-glow">
                                                    <span className="placeholder col-7"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-6"></span>
                                                    <span className="placeholder col-8"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                    <div className="row g-0" >
                                        <div className="col-md-4 d-none d-lg-flex justify-content-center">
                                            <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                        </div>
                                        <div className="col-md-8 ">
                                            <div className="card-body">
                                                <p className="card-text placeholder-glow">
                                                    <span className="placeholder col-7"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-6"></span>
                                                    <span className="placeholder col-8"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                    <div className="row g-0" >
                                        <div className="col-md-4 d-none d-lg-flex justify-content-center">
                                            <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                        </div>
                                        <div className="col-md-8 ">
                                            <div className="card-body">
                                                <p className="card-text placeholder-glow">
                                                    <span className="placeholder col-7"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-4"></span>
                                                    <span className="placeholder col-6"></span>
                                                    <span className="placeholder col-8"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                {/* Logout popup */}
                <LogOut user={props.user} />
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
            <ChatBot />
        </div>
    )
}