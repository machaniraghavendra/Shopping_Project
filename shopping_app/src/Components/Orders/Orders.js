import React, { useEffect, useState } from 'react'
import "../Orders/Orders.css"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import ChatBot from '../ChatBot/ChatBot';

export default function Orders(props) {

    const [user, setUser] = useState([]);

    const [orders, setOrders] = useState([]);

    const fetchOrders = () => {
        axios.get("http://localhost:8083/orders/all").then((res) => setOrders(res.data))
    }

    const viewOrder = (e) => {
        axios.get("http://localhost:8083/orders/" + e);
    }

    useEffect(() => {
        sessionStorage.getItem("dark") ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        document.title = "Orders | Shopping Mart"
        axios.get("http://localhost:8083/user/" + props.user).then(a => { return (setUser(a.data)) })
        fetchOrders()
        let card = document.getElementsByClassName("card-color");
        if (sessionStorage.getItem("dark") == "yes") {
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
                                            <i className="fa-solid fa-user"></i>&nbsp; {user.userName}
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
                    <div className='row rounded-5  '>
                        {orders.filter(a => a.userDetails.userEmail == user.userEmail).length == 0 ?
                            <div className='container w-100 h-100'>
                                <div className='text-center card-color p-3 w-50'>
                                    <img src={img} alt="" width="100" height="100" className="d-inline-block align-text-top m-4" />
                                    <h5>No orders Found</h5>
                                    <Link to={"/mart"} className="btn btn-outline-primary m-2 ">View products</Link>
                                </div>
                            </div>
                            :
                            orders.filter(a => {
                                return (a.userDetails.userEmail == user.userEmail)
                            }).map(item => {
                                return (
                                    <div className='col-lg-6 ' key={item.orderId}>
                                        <div className="card mb-3 orderCard card-color" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-4 d-none d-lg-flex justify-content-center">
                                                    <img src={item.itemEntity.map(a => { return (a.itemImgUrl) })} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt={item.itemEntity.map(a => { return (a.itemName) })} />
                                                </div>
                                                <div className="col-md-8 ">
                                                    <div className="card-body">
                                                        <Link to={'/orderdetails'} className="link-info  stretched-link" onClick={() => { viewOrder(item.orderId) }}></Link>
                                                        <div className='row'>
                                                            <h5 className="card-title float-start col-6 text-truncate">{item.itemEntity.map(a => { return (a.itemName) })} </h5>
                                                            {item.orderStatus == "success" && <p className='col-3 text-center text-success'><b>Placed</b></p>}
                                                            {item.orderStatus == "dispatched" && <p className='col-3 text-center text-primary'><b>Dispatched</b></p>}
                                                            {item.orderStatus == "near by hub" && <p className='col-3 text-center text-info'><b>Near by Hub</b></p>}
                                                            {item.orderStatus == "cancelled" && <p className='col-3 text-center text-danger'><b>Cancelled</b></p>}
                                                            <p className="card-title float-end col-3 text-end"><b>{item.itemEntity.map(a => { return (a.itemPrice) })}</b></p>
                                                        </div>
                                                        <div className='row py-2'> <p className="card-text">Ordered on {item.orderedOn}</p></div>
                                                        <div className='row'> <p className="card-text">Expected Delivery on {item.deliveryDate}</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

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
            <ChatBot />
        </div>
    )
}