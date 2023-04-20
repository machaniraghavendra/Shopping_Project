import "../PurchasePage/BuyPage.css"
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer';
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import ChatBot from '../ChatBot/ChatBot';

export default function Buypage(props) {

    const [user, setUser] = useState([]);

    const [item, setItem] = useState([]);

    const [details, setDetails] = useState({ firstName: "", lastName: "", emailAddress: "", phoneNumber: "", pincode: "", address: "", paymentOption: "", orderQuantity: "" });

    const [errors, setErrors] = useState({ firstName: "", phoneNumber: "", pincode: "", address: "", paymentOption: "" });

    const [showToast, setShowToast] = useState(false);

    const nav = useNavigate();

    const getItem = () => {
        axios.get("http://localhost:8083/purchase/").then(a => setItem(a.data));
    }

    const setDetailsValues = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value })
        validate(e)
    }

    const setPaymentOptions = () => {
        let options = document.getElementsByName("paymentButtons")
        for (let i = 0; i <= options.length; i++) {
            if (options[i].checked) {
                details.paymentOption = options[i].value
            }
        }
    }

    var number = 1;
    const increaseNumber = () => {
        document.getElementById("quantityNumbers").innerHTML = number
        details.orderQuantity = number
    }

    const validate = (e) => {
        e.preventDefault();
        if (details.firstName == "") {
            errors.firstName = "First name required"
        } else {
            errors.firstName = ""
        }
        if (details.phoneNumber == "") {
            errors.phoneNumber = "Phone Number required"
        } else {
            errors.phoneNumber = ""
        }
        if (details.pincode == "") {
            errors.pincode = "Zip code required"
        } else {
            errors.pincode = ""
        }
        if (details.address == "") {
            errors.address = "Address required"
        } else {
            errors.address = ""
        }
        if (details.paymentOption == "") {
            errors.paymentOption = "Select any one payment type"
        } else {
            errors.paymentOption = ""
        }
        setErrors(errors);
    }

    let itemId = item.map(a => { return (a.itemId) })

    const sendOrderData = (e) => {
        if (details.firstName == "" || details.phoneNumber == "" || details.pincode == "" || details.address == "" || details.paymentOption == "") {
            validate(e)
        } else {
            axios.post("http://localhost:8083/orders/" + itemId, {
                "userDetails": {
                    "userName": user.userName,
                    "userEmail": user.userEmail,
                    "mobileNumber": user.mobileNumber
                },
                "firstName": details.firstName,
                "lastName": details.lastName,
                "emailAddress": details.emailAddress,
                "pincode": details.pincode,
                "deliveryAddress": details.address,
                "phoneNumber": details.phoneNumber,
                "paymentType": details.paymentOption,
                "orderQuantity": details.orderQuantity
            }).then((res) => {
                if (res.data == "Order placed") {
                    let pop = document.getElementById("successPop-Parent")
                    pop.classList.remove("d-none")
                    setTimeout(() => {
                        return (
                            nav("/orders")
                        )
                    }, 3000)
                }
            }).catch(() => { return (setShowToast(true), timeout()) })
        }
    }
    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    useEffect(() => {
        sessionStorage.getItem("dark") ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        document.title = "Purchase | Shopping Mart"
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
        axios.get("http://localhost:8083/user/" + props.user).then(a => { return (setUser(a.data)) })
        getItem();
    }, [])

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

                <br></br>

                <div className="container-lg d-flex justify-content-center ">
                    <div className="card  card-color">

                        {item.map(itemData => {
                            return (
                                <div key={itemData.itemId}>
                                    <div className="card-header">
                                        <h4>{itemData.itemName}</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p>Specifications : {itemData.itemSpec}</p>
                                                <p>Dimensions : {itemData.itemDimensions}</p>
                                                <p>Description : {itemData.itemDesc}</p>
                                                <p>Product type : {itemData.itemType}</p>
                                            </div>
                                            <div className="col-md-6 d-md-block d-none">
                                                <div className="col-md-4 float-md-end h-auto w-25">
                                                    <img src={itemData.itemImgUrl} className="rounded float-end w-100 h-100" alt={itemData.itemName} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center row my-4">
                                            <Link to={'/view/' + itemData.itemId + "/" + itemData.itemName} className="btn btn-warning col-sm-4 ">View More</Link>
                                            <span className="col-sm-4 my-2"></span>
                                            <h6 className="text-bg-info p-2 m-auto col-sm-4 ">Total amount : {itemData.itemPrice}</h6>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>

                {/* Form for details */}
                <div className="container-fluid my-1">
                    <section className="card-color p-3">
                        <legend >Fill details for delivery : </legend>
                        <div className="row text-black" >
                            <div className="col-md g-4">
                                <div className="form-floating">
                                    <input className="form-control" name="firstName" placeholder="First name here" type={"text"} id="floatingInput" required
                                        onChange={setDetailsValues}
                                        value={details.firstName}
                                    ></input>
                                    <label htmlFor="floatingTextarea">First Name</label>
                                    <span className="mx-3 text-danger">{errors.firstName}</span>
                                </div>
                            </div>
                            <div className="col-md g-4">
                                <div className="form-floating">
                                    <input className="form-control" name="lastName" placeholder="Last name here"
                                        value={details.lastName}
                                        onChange={setDetailsValues} type={"text"} id="floatingInput"></input>
                                    <label htmlFor="floatingTextarea">Last Name (Optional)</label>
                                </div>
                            </div>
                            <div className="col-md g-4">
                                <div className="form-floating">
                                    <input className="form-control" name="emailAddress"
                                        value={details.emailAddress}
                                        onChange={setDetailsValues} placeholder="Email address here" type={"email"} id="floatingInput"></input>
                                    <label htmlFor="floatingTextarea">Email address (Optional)</label>
                                </div>
                            </div>
                        </div>
                        <div className="row my-md-4 text-black">
                            <div className="col-md g-4">
                                <div className="form-floating">
                                    <input className="form-control" name="phoneNumber"
                                        value={details.phoneNumber}
                                        onChange={setDetailsValues} placeholder="Phone number here" type={"text"} id="floatingInput"></input>
                                    <label htmlFor="floatingTextarea">Phone number</label>
                                    <span className="mx-3 text-danger">{errors.phoneNumber}</span>
                                </div>
                            </div>
                            <div className="col-md g-4">
                                <div className="form-floating">
                                    <textarea className="form-control" name="address"
                                        value={details.address}
                                        onChange={setDetailsValues} placeholder="Address here" id="floatingTextarea"></textarea>
                                    <label htmlFor="floatingTextarea">Address </label>
                                    <span className="mx-3 text-danger">{errors.address}</span>
                                </div>
                            </div>
                            <div className="col-md g-4">
                                <div className="form-floating">
                                    <input className="form-control" name="pincode"
                                        value={details.pincode}
                                        onChange={setDetailsValues} placeholder="Pincode here" id="floatingInput"></input>
                                    <label htmlFor="floatingTextarea">Pincode </label>
                                    <span className="mx-3 text-danger">{errors.pincode}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: "15px" }} className="row">
                            <div className="col-6">
                                <h6>Payment Options : <span className="mx-3 text-danger" style={{ fontSize: "10px" }}>{errors.paymentOption}</span></h6>
                                <div className="px-3" >
                                    <input className="form-check-input" type={"radio"} name={"paymentButtons"} id="payment_cards" onClick={setPaymentOptions} value={"cards"}></input>
                                    <label className="form-check-label" htmlFor="payment_cards" >&nbsp;Cards</label><br></br>
                                    <input className="form-check-input" type={"radio"} name={"paymentButtons"} id="payment_cod" onClick={setPaymentOptions} value={"cod"} ></input>
                                    <label className="form-check-label" htmlFor="payment_cod" >&nbsp;Cash On Delivery</label><br></br>
                                    <input className="form-check-input" type={"radio"} name={"paymentButtons"} id="payment_upi" onClick={setPaymentOptions} value={"upi"}></input>
                                    <label className="form-check-label" htmlFor="payment_upi" >&nbsp;UPI</label><br></br>
                                </div>
                            </div>
                            <div className="col-6" style={{ fontSize: "20px" }}>
                                <h6>Quantity</h6>
                                <div>
                                    <span className="btn btn-outline-secondary" onClick={() => { increaseNumber(); return (number == 1 ? number = number : number = number - 1) }}>-</span>
                                    <span id="quantityNumbers" className="mx-3">{number}</span>
                                    <span className="btn btn-outline-secondary" onClick={() => { increaseNumber(); return (number == 5 ? number = number : number = number + 1) }}>+</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-outline-warning btn-lg  m-auto  orderButton" onClick={(e) => { return(sendOrderData(),validate(e)) }}>Place Order Now</button>
                        </div>
                    </section>
                </div>

                {/* Success popup */}
                <div id="successPop-Parent" className="d-none">
                    <div className="successPop-Parent ">
                        <div className="successPop"></div>
                        <h4 className="message">Placed Order</h4>
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

                {showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            <p>Order already placed on this item</p>
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast">Ok</button>
                            </div>
                        </div>
                    </div>
                </div>}
                <br></br>
            </div>
            <ChatBot />
        </div>
    )
}