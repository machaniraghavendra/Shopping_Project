import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "../Login/css.css"
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"

export default function SignUp() {

    const [user, setUser] = useState({ userName: "", userPassword: "", userEmail: "", mobileNumber: "" });

    const [formErrors, setFormErrors] = useState({ userName: "", password: "", userEmail: "", mobileNumber: "" });

    const [isSubmit, setIsSubmit] = useState([]);

    const [info, setInfo] = useState([]);

    const [showToast, setShowToast] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [userEnteredOtp, setUserEnteredOtp] = useState("");

    const [otpVerified, setOtpVerified] = useState(false);


    const nav = useNavigate();

    const set = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    const check = () => {

        if (isSubmit == true) {
            if (formErrors.userName == "" && formErrors.userEmail == "" && formErrors.mobileNumber == "" && formErrors.password == "") {
                axios.post("http://localhost:8083/user/", user)
                    .then(res => { return (setInfo(res.data), setIsSubmit(false), setShowToast(true), timeout()) }).catch((error) => {
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

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
            nav("/login")
        }, 6500);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(user));
    }

    const validate = (user) => {
        const errors = {};
        const regex = /^[a-zA-Z0-9+._-]+@[a-zA-Z]+[.com]+/;
        const regexphone = /^[0-9]+$/;
        const regexusername = /[^A-Za-z]+/;

        if (!user.userName) {
            errors.userName = "User name is Required"
        } else if (regexusername.test(user.userName)) {
            errors.userName = "The User Name must be alphabates"
        } else {
            errors.userName = "";
        }

        if (!user.userEmail) {
            errors.userEmail = "Email is Required";
        } else if (!regex.test(user.userEmail)) {
            errors.userEmail = "Email is not a email format"
        } else {
            errors.userEmail = "";
        }

        if (!user.userPassword) {
            errors.password = "Password is required"
        } else if (user.userPassword.length < 4) {
            errors.password = "Password must be greater than 4 characters"
        } else if (user.userPassword.length > 10) {
            errors.password = "Password must be less than 10 characters"
        } else {
            errors.password = "";
        }

        if (!user.mobileNumber) {
            errors.mobileNumber = "Phone number not to be null"
        } else if (!regexphone.test(user.mobileNumber)) {
            errors.mobileNumber = "Phone number should be numbers"
        } else {
            errors.mobileNumber = "";
        }

        if (formErrors.userName == "" && formErrors.userEmail == "" && formErrors.mobileNumber == "" && formErrors.password == "") {
            setIsSubmit(true);
        }
        return errors;
    }

    const sendOtp = () => {
        if (user.userEmail && user.userName) {
            axios.post("http://localhost:8083/user/sendotp/" + user.userEmail + "/" + user.userName).then(a => {
                if (a.status == 200 && a.data == "OTP sent to " + user.userEmail) {
                    setOtpSent(true)
                }
                if (a.data == "Old OTP expired and again new OTP sent to " + user.userEmail) {
                    setError(true);
                    setErrorMessage(a.data)
                    setOtpSent(true)
                }
                if (a.data == "OTP sending failed") {
                    setOtpSent(true)
                    setError(true);
                    setErrorMessage("OTP is still valid")
                }
                if (a.data.includes("already")) {
                    setInfo(a.data); setIsSubmit(false); setShowToast(true); timeout();
                }
            }).catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
        } else {
            validate(user)
        }
    }

    const verifyOtp = () => {
        if (userEnteredOtp.length == 6) {
            axios.post("http://localhost:8083/user/verifyotp/" + user.userEmail + "/" + userEnteredOtp).then(a => {
                console.log(a);
                if (a.status == 200 && a.data == "OTP is valid") {
                    setOtpVerified(true)
                }
                if (a.data == "The OTP is expired and try to regenerate") {
                    setOtpVerified(false)
                    setError(true);
                    setErrorMessage(a.data)
                    setOtpSent(false)
                }
                if (a.data == "OTP not matched") {
                    setOtpVerified(false)
                    setError(true);
                    setErrorMessage(a.data)
                }
            }).catch((error) => {
                setError(true);
                if (error || error.response.data === undefined) {
                    setErrorMessage("Still the OTP is valid")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
        }
    }

    useEffect(() => {
        document.title = "Sign | Shopping Mart"
    })
    return (
        <section className="  position-absolute" style={{ backgroundColor: "#9A616D", width: "100%", height: "100%" }}>
            <div className='container-fluid  h-100 vh-10' style={{ backgroundColor: "#9A616D" }}>
                <div className="row d-flex justify-content-center align-items-center h-100 ">
                    <div className="col col-xl-10 ">
                        <div className="card mb-3 justify-content-center h-100" data-aos="zoom-in-up">
                            <div className="row g-0">
                                <div className="col-md-4 d-md-block d-none">
                                    <img src="https://img.freepik.com/premium-photo/happy-beautiful-young-woman-blue-dress-hand-holding-shopping-bag_74952-321.jpg?w=360"
                                        className=" img-fluid signimg rounded-start "
                                        alt="Logo" />
                                    <h2 className='signmes m-3' data-aos="zoom-in" data-aos-delay="500">Sign up<br></br>and shop <br></br>mutli products which you want!</h2>
                                </div>
                                <div className="col-md-8 col-lg-7 d-flex align-items-center">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            <img src={img} alt="" width="35" height="35" className="d-inline-block align-text-top" /> Shopping Mart
                                        </h2>

                                        <form onSubmit={handleSubmit} >

                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: " 1px" }}>Start shopping by creating your account here</h5>

                                            <div className="form-outline mb-4 form-floating mb-3">
                                                <input type="Username" id="floatingInput"
                                                    className="form-control form-control-lg"
                                                    name='userName'
                                                    onChange={set}
                                                    value={user.userName}
                                                    onInput={handleSubmit}
                                                    placeholder="Username" />
                                                <label className="form-label" htmlFor="floatingInput">Username</label>
                                                <span className='text-danger'>{formErrors.userName}</span>
                                            </div>

                                            <div className="row">
                                                <div className='col-10'>
                                                    <div className="form-outline mb-4 form-floating mb-3">
                                                        <input type="email" id="floatingInputGroup1"
                                                            className="form-control form-control-lg"
                                                            name='userEmail'
                                                            onChange={set}
                                                            onInput={handleSubmit}
                                                            value={user.userEmail}
                                                            placeholder="Email address" />
                                                        <label className="form-label" htmlFor="floatingInputGroup1">Email address</label>
                                                        <span className='text-danger'>{formErrors.userEmail}</span>
                                                    </div>
                                                </div>
                                                <div className='col-2 '>
                                                    {otpVerified && <span style={{ fontSize: "230%" }}><i className="bi bi-patch-check-fill text-success"></i></span>}
                                                    <span className={otpSent ? 'btn btn-outline-success btn-l py-3 d-none' : 'btn btn-outline-success btn-l py-3'} onClick={() => sendOtp()} >Send OTP</span>
                                                </div>
                                            </div>
                                            {otpSent && <>
                                                {!otpVerified &&
                                                    <div className="row">
                                                        <div className='col-10'>
                                                            <div className='form-outline mb-4 form-floating mb-3 '>
                                                                <input type="text" id="floatingInputGroup1"
                                                                    className="form-control form-control-lg "
                                                                    name='otp'
                                                                    onChange={a => { setUserEnteredOtp(a.target.value) }}
                                                                    placeholder="Otp" minLength={6} maxLength={6} />
                                                                <label className="form-label" htmlFor="floatingInputGroup1">Verify email address otp</label>
                                                            </div>
                                                        </div>
                                                        <div className='col-2 '>
                                                            <span className={otpVerified ? 'btn btn-outline-success btn-l py-3 d-none' : 'btn btn-outline-success btn-l py-3'} onClick={() => verifyOtp()}>Verify OTP</span>
                                                        </div>
                                                    </div>
                                                }
                                                {otpVerified && <>
                                                    <div className="form-outline mb-4 form-floating mb-3">
                                                        <input type="phonenumber" id="floatingInputGroup2"
                                                            className="form-control form-control-lg"
                                                            name='mobileNumber'
                                                            onChange={set}
                                                            value={user.mobileNumber}
                                                            onInput={handleSubmit}
                                                            maxLength={10}
                                                            placeholder="Email address" />
                                                        <label className="form-label" htmlFor="floatingInputGroup2">Mobile number</label>
                                                        <span className='text-danger'>{formErrors.mobileNumber}</span>
                                                    </div>

                                                    <div className="form-outline mb-4 form-floating">
                                                        <input type="password" id="floatingPassword"
                                                            className="form-control form-control-lg"
                                                            name='userPassword'
                                                            value={user.userPassword}
                                                            onChange={set}
                                                            maxLength={10}
                                                            minLength={4}
                                                            onInput={handleSubmit}
                                                            placeholder="Password" />
                                                        <label className="form-label" htmlFor="floatingPassword">Password</label>
                                                        <span className='text-danger'>{formErrors.password}</span>
                                                    </div>
                                                </>
                                                }
                                            </>
                                            }
                                            <div className="pt-1 mb-4 text-center">
                                                <button className="btn btn-dark btn-lg btn-block "
                                                    onClick={() => {
                                                        return (
                                                            check()
                                                        )
                                                    }}
                                                    disabled={!otpVerified}
                                                >Create account</button>
                                            </div>

                                            <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>Already have an account?
                                                <Link to="/login"
                                                    style={{ color: "#393f81" }}>Login here
                                                </Link>&nbsp;
                                                <a className='btn' onClick={() => { return (window.history.go(-1)) }}>Click here to go back</a>
                                            </p>

                                            <a href="#!" className="small text-muted">Terms of use.</a>
                                            <a href="#" className="small text-muted m-3">Privacy policy</a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {info}
                        <div className="mt-2 pt-2">
                            <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => { nav("/login") }}>Ok</button>
                        </div>
                    </div>

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
        </section>
    )
}
