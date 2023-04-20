import "../MainPage/Main.css"
import React, { useEffect, useState } from 'react'
import axios from "axios";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link, useNavigate } from "react-router-dom";
import ChatBot from "../ChatBot/ChatBot";

export default function MainPageAfterlogin(props) {

    const [search, setSearch] = useState("");

    const [data, setData] = useState([]);

    const [findvalue, setFindvalue] = useState("");

    const [find, setFind] = useState(false);

    const [info, setInfo] = useState("");

    const [what, setWhat] = useState(false);

    const nav = useNavigate();

    var count = 0;

    const [userName, setUserName] = useState("");

    const fetch = () => {
        axios.get("http://localhost:8083/items/")
            .then((res) => { return (setData(res.data)) })
    }

    const currentuser = () => {
        axios.get("http://localhost:8083/user/id/" + props.user).then(res => { return (setWhat(true)) })
        axios.get("http://localhost:8083/user/" + props.user).then(a => { return (setUserName(a.data.userName)) })

    }

    const check = () => {
        let top = document.querySelector(".check");
        let title = document.querySelector(".check .container-fluid h1");
        let title2 = document.querySelector(".check .container-fluid h2");
        let extraId = document.querySelector(".extraId");
        let scroll = document.querySelector(".scroll-up");

        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 220) {
            top.classList.add("fixed-top");
            title.innerHTML = ' <img src="https://media.istockphoto.com/vectors/shopping-bag-flat-icon-pixel-perfect-for-mobile-and-web-vector-id1145783156?k=20&m=1145783156&s=612x612&w=0&h=RJdFiHDeaQJt3KbyIfJmWS12iQrD63DUCMWPrFLumwk=" alt="" width="35" height="35" className="d-inline-block align-text-top" />&nbsp;Shopping Mart'
            title2.innerHTML = ""
            //     extraId.innerHTML = `<button type="button" className="btn btn-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
            //     <i className="fa-solid fa-user"></i>&nbsp;
            // </button>;`
        }
        if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 620) {
                scroll.style.display = "block";
            title2.classList.remove("d-none")
        }
        else {
            top.classList.remove("fixed-top");
                scroll.style.display = "none";
            title.innerHTML = "Contents";
        }
    }
    if (userName == undefined) {
        localStorage.removeItem("currentuser")
        localStorage.removeItem("Raghu")
    }
    useEffect(() => {
        sessionStorage.getItem("dark") ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        window.onscroll = () => check();
        currentuser();
        document.title = "Mart | Shopping Mart"
        setTimeout(() => {
            if (!localStorage.getItem("Raghu") && !localStorage.getItem("currentuser")) {
                nav("/login")
            }
        }, 2000);
        return (fetch())
    }, [])

    if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser") && what) {
        return (
            <div className='container-fluid '>
                <header>
                    <div className='container-fluid '>
                        <nav className="navbar bg-none navbar-expand-lg sticky-top">
                            <div className="container-fluid ">
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <h1 className="navbar-brand" >
                                    <img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" />
                                    &nbsp;Shopping Mart
                                </h1><br></br>
                                <div className="collapse navbar-collapse justify-content-end gap-2" id="navbarTogglerDemo03">
                                    <br></br>
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                            <i className="fa-solid fa-user"></i>&nbsp; {userName}
                                        </button>
                                        <ul className="dropdown-menu bg-secondary-warning dropdown-menu-lg-end user">
                                            <li><Link className="dropdown-item" to={"/profile/settings"}><i className='fa-solid fa-gear'></i> Settings</Link></li>
                                            <li>
                                                <a className="dropdown-item text-center">
                                                    <button className="btn btn-outline-danger  justify-content-end " data-bs-toggle="modal" data-bs-target="#exampleModal3" data-bs-whatever="@fat"
                                                    ><i className="fa-solid fa-power-off"></i> Sign out
                                                    </button><br></br>
                                                    <button className="btn btn-outline-danger  justify-content-end " data-bs-toggle="modal" data-bs-target="#exampleModal2" data-bs-whatever="@fat"
                                                    ><i className="fa-solid fa-power-off"></i> Sign out & Switch User
                                                    </button>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        &nbsp;

                        <nav className="navbar navbar-expand-lg check bg-light">
                            <div className="container-fluid  ">
                                <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <h2 className=' d-sm-block d-md-none d-lg-none navbar-brand'></h2>

                                <h1 className="navbar-brand" ></h1>
                                <div className="collapse navbar-collapse " id="navbarTogglerDemo02">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0  ">
                                        <li className="nav-item ">
                                            <Link className="nav-link text-dark" aria-current="page" to="/cart"><h5><i className="fa-solid fa-cart-shopping fa-bounce text-info"></i> Cart</h5></Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to="/wishlist"><h5><i className="fa-solid fa-heart fa-beat text-danger"></i> Wishlist</h5></Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to="/orders"><h5><i className="fa-solid fa-bag-shopping fa-fade text-warning"></i>  My Orders</h5></Link>
                                        </li>
                                    </ul>

                                    <div className="d-flex justify-content-center gap-3" >
                                        <div className="search p-2" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
                                            <i className="fa-solid fa-search"></i>
                                        </div>

                                        <div className="btn-group ">
                                            <button type="button" className="btn btn-dark dropdown-toggle " data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                                Items
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-lg-end bg-warning">
                                                <li><a className="dropdown-item" type="button" href="#Mobiles"> <i className="fa-solid fa-mobile"></i> Mobiles</a></li>
                                                <li><a className="dropdown-item" type="button" href="#Sports"><i className="fa-solid fa-baseball"></i> Sports</a></li>
                                                <li><a className="dropdown-item" type="button" href="#Dresses"><i className="fa-solid fa-shirt"></i> Dresses</a>
                                                    <ul className="dropdown">
                                                        <li className="dropdown-item"><a className="dropdown-item" type="button" href="#Shirts-men"><i className="fa-solid fa-shirt"></i>Men Shirts</a></li>
                                                        <li className="dropdown-item"><a className="dropdown-item" type="button" href="#Shirts-women"><i className="fa-solid fa-shirt"></i>Women Shirts</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="extraId"></div>

                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>

                <hr />


                <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen-lg-down modal-dialog-scrollable modal-lg ">
                        <div className="modal-content bg-info">
                            <div className="modal-header ">
                                <h5 className="modal-title text-end" id="exampleModalLabel"></h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-floating mb-3 ">
                                        <input type="search"
                                            className="form-control"
                                            onChange={(e) => { return (setSearch(e.target.value), setFindvalue(count)), setFind(true) }}
                                            onKeyUp={() => { return (setFindvalue(count), setFind(true)) }}
                                            id="floatingInput"
                                            placeholder="Search here..." />
                                        <label htmlFor="floatingInput">Search/Name...</label>
                                        {!(search != "") ? ""
                                            :
                                            <>
                                                {find == true ?
                                                    <>
                                                        <p className="container-fluid"><b>Search results :</b>Found {findvalue} </p>
                                                    </> : ""}
                                            </>}
                                    </div>
                                </form>
                                <div className="   row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-3 gap-4 justify-content-center text-center ">
                                    {data.filter((val) => {
                                        if (search == "") {
                                            count = 0;
                                            return null;
                                        }
                                        if (val.itemName.toLowerCase().includes(search.toLowerCase())) {
                                            return val
                                        }
                                    }).map((e) => {
                                        count++;
                                        return (
                                            <div className=' col row ' key={e.itemId}>&nbsp;
                                                <div className="card " data-aos="fade-up" >
                                                    <div className='card-header justify-content-end text-end'>
                                                        <button className='btn  m-2' onClick={() => {
                                                            axios.post("http://localhost:8083/cart/", {
                                                                "itemId": e.itemId,
                                                                "itemName": e.itemName,
                                                                "itemDesc": e.itemDesc,
                                                                "itemPrice": e.itemPrice,
                                                                "itemType": e.itemType,
                                                                "itemDimensions": e.itemDimensions,
                                                                "itemImgUrl": e.itemImgUrl,
                                                                "itemSpec": e.itemSpec,
                                                                "userId": localStorage.getItem("currentuser")
                                                            }, []).then((res) => { return (setInfo(res.data)) })
                                                        }}
                                                            data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"

                                                        ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                        <button className='btn ' onClick={() => {
                                                            axios.post("http://localhost:8083/fav/", {
                                                                "itemId": e.itemId,
                                                                "itemName": e.itemName,
                                                                "itemDesc": e.itemDesc,
                                                                "itemPrice": e.itemPrice,
                                                                "itemType": e.itemType,
                                                                "itemDimensions": e.itemDimensions,
                                                                "itemImgUrl": e.itemImgUrl,
                                                                "itemSpec": e.itemSpec,
                                                                "userId": localStorage.getItem("currentuser")
                                                            }, []).then((res) => { return (setInfo(res.data)) })
                                                        }}
                                                            data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"
                                                        ><i className="fa-solid fa-heart text-danger"></i> </button>
                                                    </div>
                                                    <img src={e.itemImgUrl} className="card-img-top" alt="..." />
                                                    <div className="card-body">
                                                        <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                                        <p className="card-text">{e.itemPrice}</p>
                                                    </div>
                                                    <a href={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info' >View More...</a>
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn=outline-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="container-fluid " data-aos="fade-up-right">
                    <div className="row">
                        <div className="col-sm-7">
                            <div className="card body">
                                <div className="card-body p-5">
                                    <h1 className="card-title ">Great Products With Best Price</h1>
                                    <p className="card-text">The Products of reasonable price and best quality</p>
                                    <a href="#details" className="btn btn-info">View</a>
                                </div>
                            </div><br></br>
                        </div>
                        <div className="col-sm-5" data-aos="fade-up-right">
                            <div className="card ">
                                <div className="card-body  p-5" >
                                    <h3 className="card-title">Amazing Products in Trending <i className="bi bi-stars"></i></h3>
                                    <a href="#trending" className="btn btn-info">View</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="container-fluid second p-4" id="details" data-aos="zoom-in-up">
                    <div className="container text-center">
                        <div className="row row-cols-2 row-cols-lg-6 g-3 g-lg-4 justify-content-center">
                            <div className="col">
                                <a href="#Mobiles" className="text-decoration-none text-dark">
                                    <i className="fa-duotone fa-mobile"></i><br></br>Mobiles
                                </a></div>
                            <div className="col"> <a href="#Shirts-men" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-shirt"></i><br></br>Shirts-Men
                            </a></div>
                            <div className="col"><a href="#Shirts-women" className="text-decoration-none text-dark">
                                <i className="fa-thin fa-shirt"></i><br></br>Shirts-Women
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-smartwatch" viewBox="0 0 16 16">
                                    <path d="M9 5a.5.5 0 0 0-1 0v3H6a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 .5-.5V5z" />
                                    <path d="M4 1.667v.383A2.5 2.5 0 0 0 2 4.5v7a2.5 2.5 0 0 0 2 2.45v.383C4 15.253 4.746 16 5.667 16h4.666c.92 0 1.667-.746 1.667-1.667v-.383a2.5 2.5 0 0 0 2-2.45V8h.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H14v-.5a2.5 2.5 0 0 0-2-2.45v-.383C12 .747 11.254 0 10.333 0H5.667C4.747 0 4 .746 4 1.667zM4.5 3h7A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3z" />
                                </svg><br></br>Smart Watches
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="bi bi-watch" style={{ fontSize: "25px" }}></i><br></br>Watches
                            </a></div>
                            <div className="col"><a href="#Sports" className="text-decoration-none text-dark">
                                <i className="fa-thin fa-baseball"></i><br></br>Sports
                            </a></div>
                            <div className="col"><a href="" className="text-decoration-none text-dark">
                                <i className="fa-thin fa-bicycle"></i><br></br>Bi-Cycles
                            </a></div>
                            <div className="col"><a href="" className="text-decoration-none text-dark">
                                <i className="fa-thin fa-camera"></i><br></br>Cameras
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-child-dress"></i><br></br>Children Dress
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-school"></i><br></br>Education
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-guitar"></i><br></br>Musical Items
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-book-open"></i><br></br>Books
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-gamepad"></i><br></br>Video Games
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-tv"></i><br></br>TV
                            </a></div>
                            <div className="col"><a href="#" className="text-decoration-none text-dark">
                                <i className="fa-solid fa-headphones"></i><br></br>Headfones
                            </a></div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="staticBackdrop" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h4>{info}</h4>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="container-fluid" >
                    <button className="btn btn-primary align-text-center scroll-up"
                        onClick={() => {
                            return (document.documentElement.scrollTop = 0,
                                document.body.scrollTop = 0)
                        }}>
                        <h4><i className="fa-solid fa-angle-up"></i></h4></button>
                </div>

                <ChatBot />

{/* LogOut pop */}
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
                {/* Switch user popup */}
                <div className="modal fade " id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content logout-model">
                            <div className="modal-header">
                                <h5 className="modal-title " id="exampleModalLabel"><img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" /> Shopping mart</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center">
                                <h5>Conform to logout and switch user</h5>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-success" data-bs-dismiss="modal">No</button>
                                <button type="button" className="btn btn-outline-danger"
                                    onClick={() => {
                                        return (localStorage.removeItem("currentuser"),
                                            localStorage.removeItem("Raghu"),
                                            nav("/login"),
                                            window.location.reload())
                                    }}
                                >Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
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
                        Opps! Something went wrong
                        Login required!
                    </h2>
                    <a href='/login' className='btn btn-outline-success text-light' onClick={() => {
                        return (
                            localStorage.removeItem("Raghu"),
                            localStorage.removeItem("currentuser")
                        )
                    }}>Click here to move to Login page</a>
                </div>
            </div>
        )
    }
}
