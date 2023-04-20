import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "../Settings/Prof.css"
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link } from "react-router-dom";
import Footer from '../Footer/Footer';
import ChatBot from '../ChatBot/ChatBot';

export default function Settings(props) {

    const [user, setUser] = useState([]);

    const [values, setValue] = useState({ userName: '', mobileNumber: '' });

    const [formErrors, setFormErrors] = useState({ userName: '', mobileNumber: '' });

    const [showToast, setShowToast] = useState(false);

    const [isSubmit, setIsSubmit] = useState([]);

    const [info, setInfo] = useState([]);

    const check = () => {
        if (!document.getElementById("flexSwitchCheckChecked").checked) {
            document.getElementById("round").classList.remove("round")
            document.getElementById("round1").classList.add("round-light")
            setTimeout(() => {
                document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
                sessionStorage.removeItem("dark")
                document.getElementById("flexSwitchCheckChecked").checked = false
                document.querySelector(".listss").classList.add("text-dark")
                document.querySelector(".listss").classList.remove("text-light")
            }, 500);
        } else {
            document.getElementById("round1").classList.remove("round-light")
            document.getElementById("round").classList.add("round")
            setTimeout(() => {
                document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
                sessionStorage.setItem("dark", "yes")
                document.getElementById("flexSwitchCheckChecked").checked = true
                document.querySelector(".listss").classList.add("text-light")
                document.querySelector(".listss").classList.remove("text-dark")
            }, 500);
        }
    }

    const currentuser = () => {
        axios.get("http://localhost:8083/user/" + props.user).then(res => {
            return (setUser(res.data))
        })
    }

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false); viewchangename(); viewchangenumber(); currentuser()
        }, 6500);
    }

    const set = (e) => {
        const { name, value } = e.target;
        setValue({ ...values, [name]: value });
        setFormErrors(validate(values));
    }

    window.onload = document.title = user.userName + " | Shopping Mart"

    const changename = () => {
        document.getElementById("updatename").innerHTML = "<a class='nameupdate btn btn-warning'>Update</a>"
    }

    const changenumber = () => {
        document.getElementById("updatenumber").innerHTML = "<a class='nameupdate btn btn-warning'>Update</a>"
    }
    
    const viewchangename = () => {
        document.getElementById("name").classList.toggle("d-block")
        document.getElementById("changename").classList.toggle("bg-dark")
        document.getElementById("changenumber").classList.remove("bg-dark")
        document.getElementById("number").classList.remove("d-block")
        document.getElementById("changename").innerHTML == "Change" ? document.getElementById("changename").innerHTML = "Close" : document.getElementById("changename").innerHTML = "Change"
        document.getElementById("changenumber").innerHTML == "Close" && (document.getElementById("changenumber").innerHTML = "Change")
    }

    const viewchangenumber = () => {
        document.getElementById("number").classList.toggle("d-block")
        document.getElementById("changenumber").classList.toggle("bg-dark")
        document.getElementById("changename").classList.remove("bg-dark")
        document.getElementById("name").classList.remove("d-block")
        document.getElementById("changenumber").innerHTML == "Change" ? document.getElementById("changenumber").innerHTML = "Close" : document.getElementById("changenumber").innerHTML = "Change"
        document.getElementById("changename").innerHTML == "Close" && (document.getElementById("changename").innerHTML = "Change")
    }

    const validate = (user) => {
        const errors = {}
        const regexphone = /^[0-9]+$/;

        if (!user.userName) {
            errors.userName = "Name is Required";
        }
        else {
            errors.userName = "";
        }

        if (!user.mobileNumber) {
            errors.mobileNumber = "Mobile Number is required"
        } else if (!regexphone.test(user.mobileNumber)) {
            errors.mobileNumber = "Phone number should be numbers"
        } else {
            errors.mobileNumber = "";
        }
        if (formErrors.userName == "" || formErrors.mobileNumber == "") {
            setIsSubmit(true);
        } else { setIsSubmit(false); }
        return errors;
    }

    useEffect(() => {
        currentuser();

        sessionStorage.getItem("dark") ?
            document.querySelector(".listss").classList.add("text-light") : document.querySelector(".listss").classList.add("text-dark")

        sessionStorage.getItem("dark") ?
            document.getElementById("flexSwitchCheckChecked").checked = true && (document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)")
            :
            document.getElementById("flexSwitchCheckChecked").checked = false && (document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))")

    }, [])
    if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {

        return (
            <div className='container-fluid justify-content-center'>
                < header className='cart-head' >
                    <div className='container-fluid'>
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
                                            <i className="fa-solid fa-user"></i>&nbsp;{user.userName}
                                        </button>
                                        <ul className="navbar-nav me-auto mb-2 mb-lg-0  ">
                                            <div className="container-fluid text-center">
                                                <div className="row row-cols-3 row-cols-lg-5 g-2 g-lg-5 ">
                                                    <li className="nav-item ">
                                                        <a className=" d-lg-none nav-link" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasResponsive" aria-controls="offcanvasResponsive"><h5><i className='fa-solid fa-list'></i> Browse contents</h5></a>
                                                    </li>
                                                </div>
                                            </div>
                                        </ul>
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
                <div className="row container-fluid my-3">
                    <div className="col-sm-4">
                        <div className='col cart-aside d-lg-block'>
                            <aside className=' '>
                                <div className="offcanvas-lg offcanvas-start alert alert-info" tabIndex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
                                    <div className="alert alert-warning d-none d-lg-block"><i className='fa-solid fa-circle-dot'></i> Browse Contents </div>
                                    <div className="offcanvas-header">
                                        <h5 className="offcanvas-title text-dark" id="offcanvasResponsiveLabel">Browse contents</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
                                    </div>
                                    <div className="offcanvas-body bg-secondary ">
                                        <ul className="navbar-nav me-auto mb mb-lg-0 listss ">
                                            <li className="nav-item">
                                                <Link className="nav-link " to="/mart"><i className="fa-solid fa-home text-light"></i> Home</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link " to="/cart"><i className="fa-solid fa-cart-shopping text-info"></i> Cart</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link " to="/wishlist"><i className="fa-solid fa-heart text-danger"></i> Wishlist</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link " to="/orders"><i className="fa-solid fa-bag-shopping text-warning"></i> My Orders</Link>
                                            </li>
                                        </ul>

                                    </div>
                                    <div className='offcanvas-footer down my-3 d-lg-none '>
                                        <h5>Name : {user.userName}</h5>
                                        <button className="btn btn-outline-danger  justify-content-end " data-bs-toggle="modal" data-bs-target="#exampleModal3" data-bs-whatever="@fat"
                                        ><i className="fa-solid fa-power-off"></i>
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="my-3 col float-md-left float-lg-right">
                            <figure className='text-center'>
                                <i className='fa-solid fa-user userCircle'></i>
                            </figure>
                            <section>
                                <div className='container-md data p-2'>
                                    <div className="row ">
                                        <div className="col">
                                            <div className='row text-center text-light gy-2'>
                                                <div className='col'>
                                                    <p>Name : <b>{user.userName}</b></p>
                                                    <a className='btn btn-outline-warning text-light' id='changename' onClick={viewchangename}>Change</a>
                                                </div>
                                                <div className='col'>
                                                    <p> Email : <b>{user.userEmail}</b></p>
                                                </div>
                                                <div className='col'>
                                                    <p>Ph.No : <b>{user.mobileNumber}</b></p>
                                                    <a className='btn btn-outline-warning text-light' id='changenumber' onClick={viewchangenumber}>Change</a>
                                                </div>
                                            </div><hr></hr>
                                            <form className=' '>
                                                <div id="name" className="form-floating my-3" >
                                                    <span id='updatename' onClick={() => {
                                                        if (isSubmit && formErrors.userName == "") {
                                                            axios.put("http://localhost:8083/user/", {
                                                                "userName": values.userName,
                                                                "userEmail": user.userEmail,
                                                                "userId": user.userId,
                                                                "userPassword": user.userPassword,
                                                                "mobileNumber": user.mobileNumber
                                                            }).then(res => { setInfo(res.data); })
                                                            return (
                                                                timeout(),
                                                                setShowToast(true),
                                                                setIsSubmit(false)
                                                            )
                                                        }
                                                    }}></span>
                                                    <input type="name" className="form-control" id="floatingInputValue" placeholder="Username"
                                                        name="userName"
                                                        onChange={set}
                                                        value={values.userName}
                                                        onInput={changename}
                                                    />
                                                    <label htmlFor="floatingInputValue">Username</label>
                                                    <span className='text-danger'>{formErrors.userName}</span>
                                                </div>
                                                <div id="number" className="form-floating my-3 " >
                                                    <span id='updatenumber' onClick={() => {
                                                        if (isSubmit == true && formErrors.mobileNumber == "") {
                                                            axios.put("http://localhost:8083/user/", {
                                                                "userName": user.userName,
                                                                "userEmail": user.userEmail,
                                                                "userId": user.userId,
                                                                "userPassword": user.userPassword,
                                                                "mobileNumber": values.mobileNumber
                                                            }).then(res => { setInfo(res.data); })
                                                            return (
                                                                timeout(),
                                                                setShowToast(true),
                                                                setIsSubmit(false)
                                                            )
                                                        }
                                                    }}></span>
                                                    <input type="text" className="form-control" id="floatingmobile"
                                                        name="mobileNumber"
                                                        value={values.mobileNumber}
                                                        placeholder="Mobile Number"
                                                        onChange={set}
                                                        onInput={changenumber}
                                                        onKeyUp={set}
                                                    />
                                                    <label htmlFor="floatingmobile">Mobile Number</label>
                                                    <span className='text-danger text-center'>{formErrors.mobileNumber}</span>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className='container data text-light w-75 py-2' >
                            <div className="form-switch text-center"  >
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Dark Mode :</label>
                                <input className="form-check-input mx-3" type="checkbox" role="switch" onClick={() => { return (check()) }} id="flexSwitchCheckChecked" />
                                <div className='rounds ' id='round'> </div>
                                <div className='rounds ' id='round1'> </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                <ChatBot/>
                <Footer />
                {showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            {info}
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => {
                                    setShowToast(false)
                                    return (
                                        viewchangename(), viewchangenumber(), currentuser()
                                    )
                                }}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>}
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
                        Login required!
                    </h2>
                    <a href='/login' className='btn btn-outline-success text-light'>Click here to move to Login page</a>
                </div>
            </div>
        )
    }
}
