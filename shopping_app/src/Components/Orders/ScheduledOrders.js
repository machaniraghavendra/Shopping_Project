import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import axios from "axios"
import ChatBot from '../ChatBot/ChatBot';
import loadingImg from "../Loading_Card.png";
import "../Orders/Orders.css"
import LogOut from '../Login/LogOut';

export default function ScheduledOrders(props) {
    const [user, setUser] = useState([]);

    const [showToast, setShowToast] = useState(false);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [scheduledOrders, setScheduledOrders] = useState([]);

    const [info, setInfo] = useState("");

    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

    const fetchScheduledOrders = () => {
        axios.get("http://localhost:8083/scheduled/orders?userId=" + props.user).then(a => {
            if (a.data) {
                setfetchDone(true);
                setScheduledOrders(a.data);
            }
        }).catch(a => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const unScheduleJob = (scheduledId) => {
        axios.delete("http://localhost:8083/scheduled/delete/order?scheduledId=" + scheduledId).then(a => {
            if (a.status == 200) {
                setInfo("Unscheduled order")
                setShowToast(true);
                fetchScheduledOrders();
                setTimeout(() => {
                    setShowToast(false);
                    setInfo("");
                }, 3000)
            }
        }).catch(a => {
            setError(true);
            if (error.response.data === undefined) {
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
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => { return (setUser(a.data)) }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })

        fetchScheduledOrders();
    }, []);

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

    return (
        <div className='container-fluid'>
            <div className='container-fluid' style={{ fontSize: "13px" }}>
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
                    <div>
                        <h2 className='text-info'>Scheduled Orders</h2>
                    </div>
                    <div className="row g-4">
                        {fetchDone ?
                            scheduledOrders.filter(order => { return (!order.orderScheduler.isDeleted) }).length > 0 ? scheduledOrders.filter(order => { return (!order.orderScheduler.isDeleted) }).map(order => {
                                return (
                                    <div className="col-lg-6 mb-3 mb-sm-0">
                                        <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-2 d-none d-md-flex justify-content-center">
                                                    <Link to={"/orders/scheduled/" + order.orderScheduler.uuid} >
                                                        <img src={order.item.itemImgUrl} className="img-fluid rounded-start d-md-block d-none w-50 h-100 d-block" alt={order.item.itemName} style={{ marginLeft: "auto", marginRight: "auto" }} />
                                                    </Link>
                                                </div>
                                                <div className="col-md-10 ">
                                                    <div className="card-body">
                                                        <div className='row'>
                                                            <h5 className="card-title float-start col-6 text-truncate text-capitalize">{order.item.itemName} </h5>
                                                            <h5 className={order.orderScheduler.jobCompleted == true ? 'col-4 text-center  badge text-bg-info py-2' : 'col-4 text-center  badge text-bg-warning py-2'}>Task completed: {order.orderScheduler.jobCompleted == true ? "Yes" : "No"}</h5>
                                                        </div>
                                                        <h5>Scheduled for : {new Date(order.orderScheduler.scheduledOn).toLocaleString('en-US', options)}</h5>
                                                        {order.orderScheduler.isDeleted == true && <h6 className='text-warning'>This order is Unscheduled</h6>}
                                                        {(order.orderScheduler.isDeleted == false && order.orderScheduler.jobCompleted == false) && <div className='justify-content-end d-flex'><button className='btn btn-danger' onClick={() => { unScheduleJob(order.orderScheduler.uuid) }}>Unschedule</button></div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                                :
                                <div className='container justify-content-center d-flex g-3 w-100 h-100 '>
                                    <div className='text-center card-color p-3 m-2 '>
                                        <h5 className='text-light'>No Scheduled orders found !</h5>
                                        <Link to={"/mart"} className="btn btn-outline-primary m-2 ">View products</Link>
                                    </div>
                                </div> :
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
                    <div className='my-3'>
                        <h2 className='text-info'>Unscheduled Orders</h2>
                    </div>
                    <div className="row g-4">
                        {fetchDone ?
                            scheduledOrders.filter(order => { return (order.orderScheduler.isDeleted) }).length > 0 ? scheduledOrders.filter(order => { return (order.orderScheduler.isDeleted) }).map(order => {
                                return (
                                    <div className="col-lg-6 mb-3 mb-sm-0">
                                        <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-2 d-none d-md-flex justify-content-center">
                                                    <Link to={"/orders/scheduled/" + order.orderScheduler.uuid} className='link-info  stretched-link'>
                                                        <img src={order.item.itemImgUrl} className="img-fluid rounded-start d-md-block d-none w-50 h-100 d-block" alt={order.item.itemName} style={{ marginLeft: "auto", marginRight: "auto" }} />
                                                    </Link>
                                                </div>
                                                <div className="col-md-10 ">
                                                    <div className="card-body">
                                                        <div className='row'>
                                                            <h5 className="card-title float-start col-6 text-truncate text-capitalize">{order.item.itemName} </h5>
                                                            <h5 className={order.orderScheduler.jobCompleted == true ? 'col-4 text-center  badge text-bg-info py-2' : 'col-4 text-center  badge text-bg-warning py-2'}>Task completed: {order.orderScheduler.jobCompleted == true ? "Yes" : "No"}</h5>
                                                        </div>
                                                        <h5 className='text-decoration-line-through'>Scheduled for : {new Date(order.orderScheduler.scheduledOn).toLocaleString('en-US', options)}</h5>
                                                        {order.orderScheduler.isDeleted == true && <h6 className='text-warning'>This order is unscheduled</h6>}
                                                        {(order.orderScheduler.isDeleted == false && order.orderScheduler.jobCompleted == false) && <div className='justify-content-end d-flex'><button className='btn btn-danger' onClick={() => { unScheduleJob(order.orderScheduler.uuid) }}>Unschedule</button></div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                                :
                                <div className='container justify-content-center d-flex g-3 w-100 h-100 '>
                                    <div className='text-center card-color p-3 m-2 '>
                                        <h5 className='text-light'>No Unscheduled orders found !</h5>
                                        <Link to={"/mart"} className="btn btn-outline-primary m-2 ">View products</Link>
                                    </div>
                                </div> :
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
                </div>
            </div>

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

            {/* Message pop */}
            {
                showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            {info}
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast">Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <ChatBot />

            {/* Logout popup */}
            <LogOut user={props.user} />
        </div >
    );
}
