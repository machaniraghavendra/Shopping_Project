import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';

export default function ForgotPass(props) {

    const [values, setValues] = useState({ userEmail: "", userPassword: "", userName: "", mobileNumber: "" });

    const [formErrors, setFormErrors] = useState({ userEmail: "", userPassword: "", userName: "", mobileNumber: "" });

    const [isSubmit, setIsSubmit] = useState([]);

    const [valueCon, setValueCon] = useState("");

    const [showToast, setShowToast] = useState(false);

    const [info, setInfo] = useState("");

    const [infor, setInfor] = useState(false);

    const [userInfo, setuserInfo] = useState([]);

    const check = () => {

        if (isSubmit == true) {
            if (formErrors.userEmail == "" && formErrors.userPassword == "") {
                if (valueCon == values.userPassword) {
                    axios.get("http://localhost:8083/user/" + values.userEmail).then(res => {
                        return (
                            axios.put("http://localhost:8083/user/", {
                                "userEmail": values.userEmail,
                                "userPassword": values.userPassword,
                                "userName": res.data.userName,
                                "mobileNumber": res.data.mobileNumber,
                                "userId": res.data.userId
                            })
                                .then(res => {
                                    return (setInfo(res.data), setIsSubmit(false), setShowToast(true), timeout())
                                })
                                .catch(() => { return (setInfo("Email is not signed with us, please sign up again !"), setShowToast(true), timeout()) })
                        )
                    })
                } else {
                    return (
                        setInfo("The new and conform password's are not matched"), setShowToast(true), timeout()
                    )
                }
            }
        }
    }



    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
            window.location.reload();
        }, 6500);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(values));
        (values.userEmail == userInfo.userEmail) ? setInfor(true) : setInfor(false)
    }

    const set = (e) => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
        axios.get("http://localhost:8083/user/" + values.userEmail).then(res => { return (setuserInfo(res.data)) })
        document.getElementById("loginbtn").classList.remove("d-none");
    }

    const validate = (user) => {
        let errors = {};
        const regex = /^[a-zA-Z0-9+._-]+@[a-zA-Z]+[.com]+/;

        if (!user.userEmail) {
            errors.userEmail = "Email is Required";
        } else if (!regex.test(user.userEmail)) {
            errors.userEmail = "Email is not a email format"
        } else {
            errors.userEmail = "";
        }

        if (!user.userPassword) {
            errors.userPassword = "Password is required"
        } else if (user.userPassword.length < 4) {
            errors.userPassword = "Password must be greater than 4 characters"
        } else if (user.userPassword.length > 10) {
            errors.userPassword = "Password must be less than 10 characters"
        } else {
            errors.userPassword = "";
        }

        if (formErrors.userEmail == "" && formErrors.userPassword == "") {
            setIsSubmit(true);
            let red = document.querySelectorAll("input");
            for (let reds of red) {
                reds.classList.remove("is-invalid")
            }
        }
        else {
            let red = document.querySelectorAll("input");
            for (let reds of red) {
                reds.classList.add("is-invalid")
            }
        }
        return errors;
    }

    return (
        <section className="  position-absolute" style={{ backgroundColor: "#9A616D", width: "100%", height: "100%" }}>
            <div className='container-fluid  justify-content-center h-100 vh-10' style={{ backgroundColor: "#9A616D" }}>
                <div className="row justify-content-center align-items-center h-100 ">
                    <div className="col col-lg-8  ">
                        <div className="card mb-3 " data-aos="zoom-in-up" style={{ height: "auto" }}>
                            <div className="row g-0">
                                <div className="card-header text-center" style={{ letterSpacing: "2px", textTransform: "uppercase" }}>
                                    <b> Update Password</b>
                                    {
                                        infor ?
                                            <p className='text-success opacity-75 infohi'>Hello {userInfo.userName}!  </p> :
                                            <p className='text-danger opacity-75' id='no-message'>
                                                {!values.userEmail == "" ? <>No account with this Email address</> : ""}
                                            </p>
                                    }
                                </div>
                                <div className="card-body ">

                                    <form className='form-forgot' onSubmit={handleSubmit}>
                                        <div className="form-floating">
                                            <input type="email" onChange={set}
                                                name="userEmail"
                                                value={values.userEmail}
                                                onInput={handleSubmit}
                                                className="form-control" id="floatingPassword2" placeholder="Password" />
                                            <label htmlFor="floatingPassword2">Email address</label>
                                        </div>
                                        <p className='text-danger opacity-75'>{formErrors.userEmail}</p>

                                        <div className="form-floating">
                                            <input type="password" className="form-control" onChange={set}
                                                name='userPassword'
                                                value={values.userPassword}
                                                onInput={handleSubmit}
                                                id="floatingPassword1" placeholder="Password" />
                                            <label htmlFor="floatingPassword1">New Password</label>
                                        </div>
                                        <p className='text-danger opacity-75'>{formErrors.userPassword}</p>

                                        <div className="form-floating">
                                            <input type="password"
                                                onChange={e => { return (setValueCon(e.target.value)) }}
                                                onInput={handleSubmit}
                                                className="form-control" id="floatingPassword" placeholder="Password" />
                                            <label htmlFor="floatingPassword">Conform New Password</label>
                                        </div>
                                        <div className='text-center d-flex' style={{ justifyContent: "space-around" }}>
                                            <span id='loginbtn' className='d-none'><Link to='/login' className='btn btn-outline-info' >Login</Link></span>
                                            <button type='submit' className='btn btn-outline-success' onClick={check}>Change</button>
                                        </div>
                                    </form>
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
                            <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => { window.location.reload() }}>Ok</button>
                        </div>
                    </div>

                </div>
            </div>}

        </section>
    )
}
