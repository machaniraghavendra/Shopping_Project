import axios from "axios";
import { useEffect, useState } from "react";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from "../Error/ErrorPage";

export default function UsersList(props) {

    const [isAdmin, setIsAdmin] = useState(false);

    const [user, setUser] = useState([]);

    const [usersList, setUsersList] = useState([]);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [showDeletePop, setShowDeletePop] = useState(false);

    const [deletingEmail, setdeletingEmail] = useState("");

    const [info, setInfo] = useState("");

    const [search, setSearch] = useState("");

    const [onlyAdmin, setOnlyAdmin] = useState(false);

    const checkIsAdmin = () => {
        axios.get("http://localhost:8083/user/admin/userid?userId=" + props.user).then(a => { setIsAdmin(a.data); setfetchDone(true) }).catch((error) => {
            setError(true);
            if (error.response === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const currentuser = () => {
        axios.get("http://localhost:8083/user/userid/" + props.user).then(res => {
            if (res.status == "200") {
                setfetchDone(true)
            }
            return (setUser(res.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const getAllUsersList = () => {
        axios.get("http://localhost:8083/user/").then(a => { setUsersList(a.data) }).catch((error) => {
            setError(true);
            if (error.response === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const deleteUser = () => {
        if (deletingEmail && deletingEmail != user.userEmail) {
            axios.delete("http://localhost:8083/user/" + deletingEmail).then(a => {
                getAllUsersList()
            }).catch((error) => {
                setError(true);
                if (error.response === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
        }
    }

    console.log(isAdmin);
    useEffect(() => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        checkIsAdmin();
        currentuser();
        getAllUsersList();
    }, [])

    if (isAdmin) {
        return (
            <div className="container-fluid">
                <header className='cart-head' >
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
                                            {fetchDone ?
                                                <span>{user.profileImgUrl ? <img src={user.profileImgUrl} width={25} height={25} />
                                                    : <i className="fa-solid fa-user"></i>}&nbsp;{user.userName}
                                                </span>
                                                : <span className="placeholder-glow">
                                                    <span className="placeholder col-12"></span>
                                                </span>}
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
                <aside className=' '>
                    <div className="offcanvas-lg offcanvas-start " tabIndex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
                        <div className='offcanvas-footer down my-3 d-lg-none '>
                            <h5>Name :  {fetchDone ? <span> {user.userName}</span> : <span className="placeholder-glow"><span className="placeholder col-12"></span> </span>}
                            </h5>
                            <button className="btn btn-outline-danger  justify-content-end " data-bs-toggle="modal" data-bs-target="#exampleModal3" data-bs-whatever="@fat"
                            ><i className="fa-solid fa-power-off"></i>
                            </button>
                        </div>
                    </div>
                </aside>

                <div className="container my-3">
                    <div className="col-lg-2 col">
                        <input type='search' className='form-control form-control-sm w-lg-75 w-100 ' id="viewSearchbar" placeholder='Search for Type/Name/Price'
                            onChange={(a) => {
                                setSearch(a.target.value)
                            }} />
                    </div>
                </div>

                <div className="container my-3 table-responsive">
                    <table className="table table-dark table-bordered border-warning table-hover border-0 text-center">
                        <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Profile</th>
                                <th scope="col">User Email</th>
                                <th scope="col">User Name</th>
                                <th scope="col">User Id</th>
                                <th scope="col">Mobile Number</th>
                                <th scope="col">Password</th>
                                <th scope="col">Admin <input className="form-check-input" type="checkbox" checked={onlyAdmin} onClick={() => { setOnlyAdmin(!onlyAdmin) }} /></th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        {fetchDone ?
                            usersList
                                .filter(a => {
                                    if (search === "") {
                                        return a;
                                    }
                                    if (a.userName.toLowerCase().includes(search.toLowerCase())
                                        || a.userEmail.toLowerCase().includes(search.toLowerCase())) {
                                        return a;
                                    }
                                })
                                .filter(a => {
                                    if (onlyAdmin === a.admin) {
                                        return a
                                    }
                                    if (!onlyAdmin) {
                                        return a
                                    }
                                })
                                .map((a, i) => {
                                    return (
                                        <tbody key={i}>
                                            <tr >
                                                <th scope="row">{i + 1}</th>
                                                <td>{a.profileImgUrl ? <img src={a.profileImgUrl} width="30" height="30" /> : <i className='fa-solid fa-user'></i>}</td>
                                                <td>{a.userEmail}</td>
                                                <td>{a.userName}</td>
                                                <td className="text-truncate">{a.userId}</td>
                                                <td>{a.mobileNumber}</td>
                                                <td>{a.userPassword}</td>
                                                <td>{a.admin ? <span className=" badge text-bg-success">Yes</span> : <span className=" badge text-bg-danger">No</span>}</td>
                                                <td>{a.userEmail === user.userEmail ? <span className="text-info">Not to be done</span> :
                                                    <i className="fa-solid fa-trash-can fa-sm" style={{ color: "#f81616", cursor: "pointer" }} onClick={() => { setShowDeletePop(true); setdeletingEmail(user.userEmail); setInfo("Want to delete user " + a.userName) }}></i>
                                                }</td>
                                            </tr>
                                        </tbody>
                                    )
                                })
                            :
                            <tbody>
                                <tr className="placeholder-glow">
                                    <th scope="row"> <span className="placeholder col-7"></span></th>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                </tr>
                                <tr className="placeholder-glow">
                                    <th scope="row"> <span className="placeholder col-7"></span></th>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                </tr>   <tr className="placeholder-glow">
                                    <th scope="row"> <span className="placeholder col-7"></span></th>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                </tr>
                                <tr className="placeholder-glow">
                                    <th scope="row"> <span className="placeholder col-7"></span></th>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                    <td>  <span className="placeholder col-7"></span></td>
                                </tr>
                            </tbody>}
                    </table>
                </div>

                {/* Delete pop */}
                {showDeletePop &&
                    <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                                {info}
                                <div className="mt-2 pt-2">
                                    <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => {
                                        return (setShowDeletePop(false))
                                    }}>No</button>&nbsp;&nbsp;
                                    <button type="button" className="btn btn-outline-danger btn-sm text-light" data-bs-dismiss="toast" onClick={() => {
                                        setShowDeletePop(false)
                                        return (
                                            deleteUser()
                                        )
                                    }}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>}

                {/* Error pop*/}
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

                {/* Logout Pop */}
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
                                            window.location.reload())
                                    }}
                                >Yes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    } else {
        return (
            <div>
                <ErrorPage />
            </div>
        )
    }
}