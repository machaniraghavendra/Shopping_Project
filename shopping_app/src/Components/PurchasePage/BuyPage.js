import "../PurchasePage/BuyPage.css"
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import ChatBot from '../ChatBot/ChatBot';
import loadingImg from "../Loading_Card.png";
import LogOut from "../Login/LogOut";
import Rating from "../Items/Rating/Rating";
import FormatAmount from "../Utils/FormatAmount";
import ConvertToNumber from "../Utils/ConvertToNumber";

export default function Buypage(props) {

    const [user, setUser] = useState([]);

    const [item, setItem] = useState([]);

    const [details, setDetails] = useState({ firstName: "", lastName: "", emailAddress: "", phoneNumber: "", address: "", paymentOption: "", orderQuantity: "", addressString: "" });

    const [errors, setErrors] = useState({ firstName: "", phoneNumber: "", address: "", paymentOption: "" });

    const [showToast, setShowToast] = useState(false);

    const [showAddressToast, setShowAddressToast] = useState(false);

    const nav = useNavigate();

    const [message, setMessage] = useState("");

    const [address, setAddress] = useState([]);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [orderButtonEnabled, setOrderButtonEnabled] = useState(true);

    const [disableOrderButton, setDisableOrderButton] = useState(true);

    const [deliveryAddress, setDeliveryAddress] = useState({ stateName: "", district: "", officeName: "", pincode: "" })

    const [stateNames, setStateNames] = useState([]);

    const [districtNames, setDistrictNames] = useState([]);

    const [officeNames, setOfficeNames] = useState([]);

    const [showAddressSelectBar, setShowAddressSelectBar] = useState(false);

    const [selectedDateAndTime, setSelectedDateAndTime] = useState("");

    const [isScheduleMode, setIsScheduleMode] = useState(false);

    const [showCaptcha, setShowCaptcha] = useState(false);

    const [isValidCaptcha, setIsValidCaptcha] = useState(false);

    const [captcha, setCaptcha] = useState("");

    const [userEnteredCaptcha, setUserEnteredCaptcha] = useState("");

    var number = 1;

    let itemId = "";

    const getItem = () => {
        axios.get("http://localhost:8083/purchase/?userId=" + props.user).then(a => {
            return (setItem(a.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const sendOrderData = (e) => {
        if (!isScheduleMode) {
            if (details.firstName == "" || details.phoneNumber == "" || details.pincode == "" || details.address == "" || details.paymentOption == "") {
                validate(e)
            } else {
                axios.post("http://localhost:8083/orders/", {
                    "userId": props.user,
                    "itemId": itemId,
                    "firstName": details.firstName,
                    "lastName": details.lastName,
                    "emailAddress": details.emailAddress,
                    "pincode": deliveryAddress.pincode,
                    "deliveryAddress": details.address,
                    "phoneNumber": details.phoneNumber,
                    "paymentType": details.paymentOption,
                    "orderQuantity": details.orderQuantity
                }).then((res) => {
                    if (res.data === "Saved order") {
                        setMessage("Order already placed on this item")
                        let pop = document.getElementById("successPop-Parent")
                        pop.classList.remove("d-none")
                        setTimeout(() => {
                            return (
                                setOrderButtonEnabled(true),
                                nav("/orders")
                            )
                        }, 3000)
                    }
                }).catch(() => { return (setMessage("Order not placed due to some error"), setShowToast(true), timeout()) })
                    .catch((error) => {
                        setError(true);
                        if (error.response.data === undefined) {
                            setErrorMessage("Something went wrong")
                        } else {
                            setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                        }
                    })
            }
        }
    }

    const scheduleOrder = () => {
        if (selectedDateAndTime) {
            axios.post("http://localhost:8083/orders/schedule/order?scheduleAt=" + selectedDateAndTime + ":00", {
                "userId": props.user,
                "itemId": itemId,
                "firstName": details.firstName,
                "lastName": details.lastName,
                "emailAddress": details.emailAddress,
                "pincode": deliveryAddress.pincode,
                "deliveryAddress": details.address,
                "phoneNumber": details.phoneNumber,
                "paymentType": details.paymentOption,
                "orderQuantity": details.orderQuantity
            }).then((res) => {
                if (res.data.orderScheduled === true) {
                    setMessage(res.data.message)
                    setTimeout(() => {
                        return (
                            setMessage(''),
                            nav("/orders/scheduled"),
                            window.location.reload()
                        )
                    }, 3000)
                }
            }).catch(res => {
                if (res.response.data.orderScheduled === false) {
                    setErrorMessage(res.response.data.message);
                }
            })
        }
    }

    const setDetailsValues = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value })
        validate(e)
    }

    const fetchAddress = () => {
        axios.get("http://localhost:8083/address/user/" + props.user).then(res => {
            return (setAddress(res.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const saveAddress = () => {
        axios.post("http://localhost:8083/address/", {
            "userId": props.user,
            "deliveryAddressUuid": details.address,
            "pincode": deliveryAddress.pincode,
            "phoneNumber": details.phoneNumber,
            "emailAddress": details.emailAddress,
            "lastName": details.lastName,
            "firstName": details.firstName
        }).then(() => {
            if (!isScheduleMode) {
                sendOrderData()
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

    const checkAddress = (isSchedule) => {
        setOrderButtonEnabled(false)
        axios.post("http://localhost:8083/orders/check/", {
            "userId": props.user,
            "itemId": 1,
            "firstName": details.firstName,
            "lastName": details.lastName,
            "emailAddress": details.emailAddress,
            "pincode": deliveryAddress.pincode,
            "deliveryAddress": details.address,
            "phoneNumber": details.phoneNumber,
            "paymentType": details.paymentOption,
            "orderQuantity": details.orderQuantity
        }).then(res => {
            if (!res.data) {
                if (!isSchedule) {
                    setShowAddressToast(true)
                } else {
                    // setIsScheduleMode(false)
                }
            } else {
                setShowAddressToast(false)
                if (!isSchedule) {
                    sendOrderData();
                } else {
                    setIsScheduleMode(false)
                }
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

    const fetchUser = () => {
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => {
            if (a.status == "200") {
                getItem();
                setfetchDone(true);
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
    }

    const selectedAddressStore = (a) => {
        setDetails({
            firstName: a.firstName,
            lastName: a.lastName,
            emailAddress: a.emailAddress,
            phoneNumber: a.phoneNumber,
            address: a.deliveryAddressUuid,
            addressString: a.deliveryAddress,
            paymentOption: details.paymentOption,
            orderQuantity: details.orderQuantity
        })
        setShowAddressSelectBar(true);
    }

    const setPaymentOptions = (type) => {
        details.paymentOption = type;
    }

    const increaseNumber = (adding) => {
        if (adding) {
            number == 5 ? number = number : number = number + 1
        } else {
            number == 1 ? number = number : number = number - 1
        }
        document.getElementById("quantityNumbers").textContent = number
        document.getElementById("totalOrderAmount").textContent = FormatAmount(number * item.map(itemData => { return (ConvertToNumber(itemData.itemPrice)) }))
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
        if (details.emailAddress == "") {
            errors.emailAddress = "Email Address required"
        } else {
            errors.emailAddress = ""
        }
        if (details.paymentOption == "") {
            errors.paymentOption = "Select any one payment type"
        } else {
            errors.paymentOption = ""
        }
        if (details.address == "") {
            errors.address = "Address required"
        } else {
            errors.address = ""
        }
        setErrors(errors);
        if (errors.address == "" && errors.firstName == "" && errors.paymentOption == "" && errors.phoneNumber == "" && errors.emailAddress == "") {
            setDisableOrderButton(false)
        } else {
            setDisableOrderButton(true)
        }
    }

    const getStateNames = () => {
        axios.get("http://localhost:8083/city-pincode/state-name").then(a => {
            return (setStateNames(a.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const getDistrictNames = (name) => {
        axios.get("http://localhost:8083/city-pincode/district-name?statename=" + name).then(a => {
            return (setDistrictNames(a.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const getOfficeNames = (name) => {
        axios.get("http://localhost:8083/city-pincode/office-name?district=" + name).then(a => {
            return (setOfficeNames(a.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const getPincode = () => {
        let pincode = officeNames
            .filter(a => a.officeName == deliveryAddress.officeName)
            .map(a => { return (a.pincode) })[0];
        return pincode;
    }

    const getAddressUuid = () => {
        let uuid = officeNames
            .filter(a => a.officeName == deliveryAddress.officeName)
            .map(a => { return (a.uuid) })[0];
        return uuid;
    }

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    const setAddressAsString = () => [
        setDetails({ address: details.address, firstName: details.firstName, lastName: details.lastName, emailAddress: details.emailAddress, phoneNumber: details.phoneNumber, orderQuantity: details.orderQuantity, paymentOption: details.paymentOption })
    ]

    const clearAllDetails = () => {
        setDetails({ address: "", firstName: "", lastName: "", emailAddress: "", phoneNumber: "", orderQuantity: "", paymentOption: "", addressString: "" })
        setDisableOrderButton(true)
    }

    const generateCaptcha = () => {
        var captchaText = '';
        var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 6; i++) {
            captchaText += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        setCaptcha(captchaText);
    }
    const restrictToCopy = (e) => {
        e.preventDefault();
        alert('Copying is not allowed for this text.');
    }

    useEffect(() => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        document.title = "Purchase | Shopping Mart"
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
        fetchUser();
        fetchAddress();
        getStateNames();
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
                                            {fetchDone ?
                                                <span>{user.profileImgUrl ?
                                                    <img src={user.profileImgUrl} width={25} height={25} />
                                                    : <i className="fa-solid fa-user"></i>}&nbsp;{user.userName}
                                                </span>
                                                :
                                                <span className="placeholder-glow">
                                                    <span className="placeholder col-12"></span>
                                                </span>}                                        </button>
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
                {fetchDone ?
                    <div className="container-lg d-flex justify-content-center ">
                        <div className="card  card-color w-100">
                            {item.map(itemData => {
                                { itemId = itemData.itemId }
                                return (
                                    <div key={itemData.itemId}>
                                        <div className="card-header">
                                            <h4>{itemData.itemName}</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    {itemData.itemSpec != null || itemData.itemSpec != "" ? <p>Specifications :  {itemData.itemSpec}</p> : "Not mentioned"}
                                                    {itemData.itemDimensions != null || itemData.itemDimensions != "" && <p>Dimensions :  {itemData.itemDimensions}</p>}
                                                    <p>Description : {itemData.itemDesc == null ? "Not mentioned" : itemData.itemDesc}</p>
                                                    <p>Product type : {itemData.itemType == null ? "Not mentioned" : itemData.itemType}</p>
                                                </div>
                                                <div className="col-md-6 d-md-block d-none">
                                                    <div className="col-md-4 float-md-end h-auto w-25">
                                                        <img src={itemData.itemImgUrl} className="rounded float-end w-50 h-100 d-block" alt={itemData.itemName} style={{ marginLeft: "auto", marginRight: "auto" }} />
                                                        <div className='justify-content-center float-end my-3  fs-6'>
                                                            <Rating times={itemData.ratingOfItem} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center row my-4">
                                                <Link to={'/view/' + itemData.itemId + "/" + itemData.itemName} className="btn btn-warning col-sm-4 ">View More</Link>
                                                <span className="col-sm-4 my-2"></span>
                                                <h6 className="text-bg-info p-2 m-auto col-sm-4 ">Total amount :  ₹{itemData.itemPrice}</h6>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    :
                    <div className="container-lg d-flex justify-content-center ">
                        <div className="card  card-color w-100">
                            <div className="card-header">
                                <h4>
                                    <p className="card-text placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                    </p>
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                    </div>
                                    <div className="col-md-6 d-md-block d-none">
                                        <div className="col-md-4 float-md-end h-auto w-25">
                                            <img src={loadingImg} className="card-img-top" alt="Loading..." />
                                        </div>
                                    </div>
                                    <div className="text-center row my-4">
                                        <a className="btn btn-warning col-sm-4 disabled placeholder col-6"></a>
                                        <span className="col-sm-4 my-2"></span>
                                        <a className="text-bg-info p-2 m-auto col-sm-4 "></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }


                {/* Form for details */}
                <div className="container-fluid my-1">
                    <section className="card-color p-3">
                        <div className="row">
                            <div className="col-10">
                                <div className="dropdown dropend container-fluid" >
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Select from your saved address
                                    </button>
                                    <ul className="dropdown-menu bg-dark text-light container-fluid" style={{ width: "auto" }}>
                                        {
                                            address.length == 0 ? <p className="px-5"> No address in your list </p> :
                                                address.map(a => {
                                                    return (
                                                        <li className="dropdown-item" key={a.deliveryAddress} style={{ cursor: "pointer" }}>
                                                            <div className='container-fluid border m-2 bg-info '>
                                                                <div className='container-fluid p-2 py-3 ' onClick={() => { selectedAddressStore(a) }}>
                                                                    <span className="text-truncate">
                                                                        Name : {a.firstName + " " + a.lastName},
                                                                        Address : {a.deliveryAddress},
                                                                        Email address : {a.emailAddress},
                                                                        Mobile Number : {a.phoneNumber}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-2">
                                {details.addressString && <button className="btn btn-danger" onClick={() => { clearAllDetails() }}>Clear address</button>}
                            </div>
                        </div>
                        <div className="row text-black" >
                            <div className="col-md-3 col-12 g-3">
                                <div className="form-floating">
                                    <input className="form-control" name="firstName" placeholder="First name here" type={"text"} id="floatingInput" required
                                        onChange={setDetailsValues}
                                        value={details.firstName}
                                    ></input>
                                    <label htmlFor="floatingTextarea">First Name</label>
                                    <span className="mx-3 text-danger">{errors.firstName}</span>
                                </div>
                            </div>
                            <div className="col-md-3 col-12 g-3">
                                <div className="form-floating">
                                    <input className="form-control" name="lastName" placeholder="Last name here"
                                        value={details.lastName}
                                        onChange={setDetailsValues} type={"text"} id="floatingInput"></input>
                                    <label htmlFor="floatingTextarea">Last Name (Optional)</label>
                                </div>
                            </div>
                            <div className="col-md-3  col-12 g-3">
                                <div className="form-floating">
                                    <input className="form-control" name="emailAddress"
                                        value={details.emailAddress}
                                        onChange={setDetailsValues} placeholder="Email address here" type={"email"} id="floatingInput"></input>
                                    <label htmlFor="floatingTextarea">Email address</label>
                                    <span className="mx-3 text-danger">{errors.emailAddress}</span>
                                </div>
                            </div>
                            <div className="col-md-3 col-12 g-3">
                                <div className="form-floating">
                                    <input className="form-control" name="phoneNumber"
                                        value={details.phoneNumber}
                                        onChange={setDetailsValues} placeholder="Phone number here" type={"text"} id="floatingInput"></input>
                                    <label htmlFor="floatingTextarea">Phone number</label>
                                    <span className="mx-3 text-danger">{errors.phoneNumber}</span>
                                </div>
                            </div>
                        </div>
                        {details.addressString ?
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text" id="inputGroup-sizing">Address</span>
                                <input type="text" className="form-control" value={details.addressString} disabled />
                                <span className="mx-3 text-danger">{errors.address}</span>
                            </div> :
                            <div className="row text-black">
                                <div className="col-md-3 col-12 g-4">
                                    <select className="form-select" disabled={false} onChange={(name) => { return (getDistrictNames(name.target.value), setDeliveryAddress({ stateName: name.target.value, district: deliveryAddress.district, officeName: deliveryAddress.officeName, pincode: deliveryAddress.pincode })) }}>
                                        <option >Select State name</option>
                                        {stateNames.map((a, i) => {
                                            return (
                                                <option value={a} key={i}>{a}</option>
                                            )
                                        })}
                                    </select>
                                    <span className="mx-3 text-danger">{errors.address}</span>
                                </div>
                                <div className="col-md-3 col-12 g-4">
                                    <select className="form-select" disabled={deliveryAddress.stateName == "" ? true : false}
                                        onChange={(name) => {
                                            return (getOfficeNames(name.target.value),
                                                setDeliveryAddress({ district: name.target.value, officeName: deliveryAddress.officeName, pincode: deliveryAddress.pincode, stateName: deliveryAddress.stateName })
                                                , setAddressAsString()
                                            )
                                        }}>
                                        <option>Select District name</option>
                                        {districtNames.map((a, i) => {
                                            return (
                                                <option value={a} key={i}>{a}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-3 col-12 g-4">
                                    <select className="form-select" disabled={deliveryAddress.district == "" ? true : false} onChange={(name) => { return (setDeliveryAddress({ officeName: name.target.value, pincode: deliveryAddress.pincode, stateName: deliveryAddress.stateName, district: deliveryAddress.district }), getPincode()) }}>
                                        <option>Select City/Town/Village name</option>
                                        {officeNames.map((a, i) => {
                                            return (
                                                <>
                                                    <option value={a.officeName} key={i} >{a.officeName}</option>
                                                    <option hidden>{deliveryAddress.pincode = getPincode()}</option>
                                                    <option hidden>{details.address = getAddressUuid()}</option>
                                                </>
                                            )
                                        })}
                                    </select>
                                </div>

                                <div className="col-md-3 col-12 g-4">
                                    <div className="input-group input-group-sm mb-3" >
                                        <span className="input-group-text" id="inputGroup-sizing-sm">Pincode</span>
                                        <input type="text" className="form-control" value={deliveryAddress.officeName == "" ? "Select City/Town/Village" : deliveryAddress.pincode} disabled />
                                    </div>
                                </div>
                            </div>}
                        <div style={{ fontSize: "15px" }} className="row my-3">
                            <div className="col-12 col-sm-6">
                                <h6>Payment Options : <span className="mx-3 text-danger" style={{ fontSize: "10px" }}>{errors.paymentOption}</span></h6>
                                <div className="px-3" >
                                    <input className="form-check-input" type={"radio"} name={"paymentButtons"} id="payment_cards" onClick={() => { setPaymentOptions("Cards") }} value={"cards"}></input>
                                    <label className="form-check-label" htmlFor="payment_cards" >&nbsp;Cards</label><br></br>
                                    <input className="form-check-input" type={"radio"} name={"paymentButtons"} id="payment_cod" onClick={() => { setPaymentOptions("COD") }} value={"cod"} ></input>
                                    <label className="form-check-label" htmlFor="payment_cod" >&nbsp;Cash On Delivery</label><br></br>
                                    <input className="form-check-input" type={"radio"} name={"paymentButtons"} id="payment_upi" onClick={() => { setPaymentOptions("UPI") }} value={"upi"}></input>
                                    <label className="form-check-label" htmlFor="payment_upi" >&nbsp;UPI</label><br></br>
                                </div>
                            </div>
                            <div className="col-12 col-sm-3 my-3 my-sm-0" style={{ fontSize: "20px" }}>
                                <h6>Quantity</h6>
                                <div>
                                    <button className="btn btn-outline-secondary" onClick={() => { increaseNumber(false); }}>-</button>
                                    <span id="quantityNumbers" className="mx-3">1</span>
                                    <button className="btn btn-outline-secondary" onClick={() => { increaseNumber(true); }}>+</button>
                                </div>
                            </div>
                            <div className="col-12 col-md-3 my-3 my-md-0">
                                <h6>Total amount : </h6>
                                <div>
                                    {item.map(itemData => {
                                        return (<span id="totalOrderAmount" className="fw-bold">₹{itemData.itemPrice}</span>)
                                    })}
                                </div>
                            </div>
                        </div>

                        {!showCaptcha && <div className="text-center justify-content-around d-flex">
                            <button className="btn btn-outline-warning btn-lg  m-auto  orderButton" disabled={disableOrderButton} onClick={(e) => {
                                setShowCaptcha(true); setIsScheduleMode(false); setDisableOrderButton(true); generateCaptcha();
                            }}>{orderButtonEnabled ? "Place Order Now" : "Making order wait a min..."}</button>
                            <button className="btn btn-outline-info btn-lg  m-auto  scheduleOrderButton" data-bs-toggle="modal" data-bs-target="#scheduleBackDrop" disabled={disableOrderButton} onClick={(e) => {
                                setIsScheduleMode(true);
                                if (details.firstName != "" && details.phoneNumber != "" && details.address != "" && details.paymentOption != "") {
                                    return (checkAddress(true))
                                } else {
                                    validate(e)
                                }
                            }}>{orderButtonEnabled && "Schedule Order Now"} {!orderButtonEnabled && "Making order wait a min..."}</button>
                        </div>}
                        {/* {CAPTCHA } */}
                        {showCaptcha &&
                            <div className="container-fluid  my-5">
                                <h4>Verify to order :</h4>
                                <div className="d-flex justify-content-center">
                                    <div className="bg-warning text-dark border-5 py-1 px-5 align-content-center fs-2" onCopy={(e) => restrictToCopy(e)} id="restrictedText" style={{ lineHeight: "50px", font: "30px Arial" }}>{captcha}</div>
                                    <button className="btn btn-light mx-3" onClick={() => generateCaptcha()}><i className="bi bi-arrow-clockwise"></i></button>
                                </div>
                                {isValidCaptcha && <span className="d-flex justify-content-center my-3 fs-6 text-danger">Not a valid captcha</span>}
                                <div className="d-flex justify-content-center my-3">
                                    <input type="text" className="form-control w-25" id="floatingInput" placeholder="Enter CAPTCHA here" onChange={(a) => { setUserEnteredCaptcha(a.target.value); setIsValidCaptcha(false) }} />
                                    <button className="btn btn-outline-info mx-2" onClick={(e) => {
                                        if (userEnteredCaptcha === captcha) {
                                            setIsScheduleMode(false);
                                            if (details.firstName != "" && details.phoneNumber != "" && details.address != "" && details.paymentOption != "") {
                                                return (checkAddress(false))
                                            } else {
                                                validate(e)
                                            }
                                        } else setIsValidCaptcha(true);
                                    }}>Verify and Order</button>
                                </div>
                            </div>}
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
                <LogOut user={props.user} />

                {/* Address popup */}
                {
                    showAddressToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                                <p>Looks like this address not in your saved list want to add ?</p>
                                <div className="mt-2 pt-2">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => {
                                        return (sendOrderData(), setShowAddressToast(false))
                                    }}>No</button>&nbsp;&nbsp;
                                    <button type="button" className="btn btn-outline-success"
                                        onClick={() => {
                                            return (saveAddress(), setShowAddressToast(false))
                                        }}
                                    >Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                                <p>{message}</p>
                                <div className="mt-2 pt-2">
                                    <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast">Ok</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <br></br>
            </div >

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

            {/* Schedule Pop up */}
            <div className="modal fade" id="scheduleBackDrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={sessionStorage.getItem("dark") == "true" ? "modal-content bg-dark text-light" : "modal-content"}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Schedule Order</h1>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setOrderButtonEnabled(true); setIsScheduleMode(true); document.getElementById("dateInput").value = ''; setErrorMessage(''); setSelectedDateAndTime('') }}></button>
                        </div>
                        <div className="modal-body">
                            <label for="dateInput" className="form-label">Select Date and Time</label>
                            <input type="datetime-local" className="form-control form-control-date" id="dateInput" onChange={(a) => { setSelectedDateAndTime(a.target.value); setErrorMessage("") }}
                                min={new Date().toISOString().substring(0, new Date().toISOString().length - 8)} title="Choose your Date" />
                            {errorMessage != '' && <span className="mx-1 text-danger">{errorMessage}</span>}
                            {message != '' && <span className="mx-1 text-info text-center d-flex justify-content-center fs-5 my-2 fw-bold">{message.replace('T', " ")}</span>}
                            {isScheduleMode &&
                                <div className="container-fluid bg-warning text-dark my-2">
                                    <p>Looks like this address not in your saved list want to add ?</p>
                                    <div className="my-2 mt-2 pt-2">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => {
                                            return (setShowAddressToast(false), setIsScheduleMode(false))
                                        }}>No</button>&nbsp;&nbsp;
                                        <button type="button" className="btn btn-outline-success"
                                            onClick={() => {
                                                return (setIsScheduleMode(false), saveAddress(), setShowAddressToast(false))
                                            }}
                                        >Yes</button>
                                    </div>
                                </div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setOrderButtonEnabled(true); setIsScheduleMode(false); document.getElementById("dateInput").value = ''; setErrorMessage(''); setSelectedDateAndTime('') }}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => { scheduleOrder(); setErrorMessage(''); setSelectedDateAndTime('') }} disabled={selectedDateAndTime == ''}>Schedule Order</button>
                        </div>
                    </div>
                </div>
            </div>
            <ChatBot />
        </div >
    )
}