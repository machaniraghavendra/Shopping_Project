import axios from 'axios';
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import loadingImg from "../Loading_Card.png";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from '../Items/Rating/Rating';
import timePeriodCalculator from '../Orders/TimePeriodCalculator';
import ShowFullComments from './ShowFullComments';

export default function AllReviewOfItem(props) {

    let itemid = new URLSearchParams(window.location.search).get("item");

    const [viewItem, setviewItem] = useState([]);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [fetchItemDone, setfetchItemDone] = useState(false);

    const [user, setUser] = useState([]);

    const [fetchUserDone, setfetchUserDone] = useState(false);

    const [reviewsOfItem, setReviewsOfItem] = useState([]);

    const [showImagePop, setShowImagePop] = useState(false);

    const [imageUrlForToShow, setImageUrlForToShow] = useState("");

    const [reviewImages, setReviewImages] = useState([]);

    const getUser = () => {
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => {
            if (a.status == "200") {
                setfetchUserDone(true);
                getItem();
            }
            setUser(a.data)
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        });
    }

    const getItem = () => {
        axios.get("http://localhost:8083/items/" + itemid)
            .then((res) => {
                if (res.status == "200") {
                    setfetchItemDone(true);
                    getReviewsOfThisItem();
                    getReviewImages();
                }
                setviewItem(res.data)
            }).catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
    }

    const getReviewsOfThisItem = () => {
        axios.get("http://localhost:8083/review/item?itemId=" + itemid).then(a => {
            setReviewsOfItem(a.data)
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const getReviewImages = () => {
        axios.get("http://localhost:8083/review/images?itemId=" + itemid).then(a => {
            setReviewImages(a.data)
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const check = () => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        let darks = document.getElementsByClassName("view")
        for (const dark of darks) {
            if (sessionStorage.getItem("dark") === "true") {
                dark.classList.add("bg-dark")
                dark.classList.add("text-light")
            } else {
                dark.classList.remove("bg-dark")
                dark.classList.remove("text-light")
            }
        }
    }

    const scrollLeft = () => {
        let scrollLeft = document.getElementById("viewsimilarscroll")
        window.scrollTo({
            left: scrollLeft.scrollLeft -= 345,
            behavior: 'smooth'
        })
    }

    const scrollRight = () => {
        let scrollRight = document.getElementById("viewsimilarscroll")
        window.scrollTo({
            left: scrollRight.scrollLeft += 345,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        check()
        getUser();
    }, [])

    return (
        <div className='container-fluid'>
            <div className='col-12 '>
                <nav className="navbar bg-none navbar-expand-lg sticky-top">
                    <div className="container-fluid ">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa-thin fa-arrow-left btn m-1" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <i className="fa-thin fa-arrow-left btn m-1 d-none d-lg-block" style={{ fontFamily: "fontAwesome" }} onClick={() => { return (window.history.back()) }}></i>
                        <Link to="/mart" className='nav-link' > <h1 className="navbar-brand">
                            <img src={img} alt="" width="30" height="30" className="d-inline-block align-text-top" />
                            &nbsp;Shopping Mart
                        </h1></Link><br></br>
                        <div className="collapse navbar-collapse justify-content-end gap-2" id="navbarTogglerDemo03">
                            <br></br>
                            <div className="btn-group ">
                                <button type="button" className="btn btn-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                    {fetchUserDone ?
                                        <span>{user.profileImgUrl ?
                                            <img src={user.profileImgUrl} width={25} height={25} />
                                            : <i className="fa-solid fa-user"></i>}&nbsp;{user.userName}
                                        </span>
                                        :
                                        <span className="placeholder-glow">
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
                            </div>
                        </div>
                    </div>
                </nav>
                <div className='container my-2 card view' style={{ height: "500px", overflowY: "scroll" }}>
                    <div className='row'>
                        <div className='col-12 col-md-3 overflow-scroll'>
                            {fetchItemDone ?
                                <div className=''>
                                    {viewItem.map((a, i) => {
                                        return (<div className='' key={i}>
                                            <h5 style={{ letterSpacing: "2px", textTransform: "capitalize" }} className='text-center reviewItemName'>{a.itemName}</h5>
                                            <div className='w-100 h-100 d-flex'>
                                                <img src={a.itemImgUrl} alt={a.itemName} className="rounded reviewpageImg" />
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
                                :
                                <div>
                                    <p className="card-text placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                    </p>
                                    <img src={loadingImg} alt="loading..." className="img-fluid mx-auto rounded p-5" />
                                </div>}
                        </div>

                        <div className='col-0 col-md-1'></div>
                        <div className='col-0 col-md-1' id='verticalLine'></div>
                        <div className='col-12 col-md-7 overflow-scroll' style={{ marginTop: "3%" }}>
                            {reviewImages &&
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-1'>
                                            <span style={{ zIndex: "1" }}>
                                                <span className='bg-warning text-dark btn btn-sm my-3 py-5 ' id='scrollleftbutton' onClick={() => { scrollLeft() }}><i className="bi bi-chevron-left "></i></span>
                                            </span>
                                        </div>
                                        <div className='col-10'>
                                            <span className='gap-2 d-flex justify-content-between align-items-center' style={{ height: "auto", display: "flex", overflowX: "scroll" }} id="viewsimilarscroll">
                                                {reviewImages && reviewImages.map((a, i) => {
                                                    return (
                                                        <img key={i} src={a} width={100} height={150} style={{ cursor: "zoom-in" }} onClick={() => { setShowImagePop(true); setImageUrlForToShow(a) }} />
                                                    )
                                                })}
                                            </span>
                                        </div>
                                        <div className='col-1'>
                                            <span style={{ zIndex: "1" }}>
                                                <span className='bg-warning text-dark my-3  float-end btn btn-sm py-5' id="scrollRightButton" onClick={() => { scrollRight() }}><i className="bi bi-chevron-right"></i></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }
                            {fetchItemDone ?
                                reviewsOfItem.map((a, i) => {
                                    check()
                                    return (
                                        <div className='card view my-2' style={{ height: "auto" }} key={i}>
                                            <div className="container-fluid p-1">
                                                <Rating times={a.rating.rating} /><span className="mx-2 fw-bold">{a.commentTitle} : {timePeriodCalculator(a.commentAddedOn)}</span> {a.user.userId === localStorage.getItem("currentuser") &&
                                                    <span className='fs-6 float-end'><i className="bi bi-bookmark-fill your_comment"><span className="your_comment_text">Your comment</span></i></span>}
                                                <p className="my-1 mx-1"><ShowFullComments comment={a.comment} /></p>
                                                {(a.imageDto != null && a.imageDto != []) && a.imageDto.map((a, i) => {
                                                    return (
                                                        <img key={i} src={a.imageUrl} className="mx-2 d-inline-flex justify-content-center" style={{ cursor: "zoom-in" }} width={70} height={100} onClick={() => { setShowImagePop(true); setImageUrlForToShow(a.imageUrl) }} />
                                                    )
                                                })}
                                                <p className="my-2">User : {a.user.userName}</p>
                                                <p className="my-2">Added on : {a.commentAddedOn} at {a.commentAddedAt} IST</p>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="card mb-3  view" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-8 ">
                                                    <div className="card-body">
                                                        <p className="card-text placeholder-glow">
                                                            <span className="placeholder col-7"></span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="col-md-4 d-none d-lg-flex justify-content-center">
                                                                <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                                            </span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="placeholder col-6"></span>
                                                            <span className="placeholder col-8"></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="card mb-3  view" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-8 ">
                                                    <div className="card-body">
                                                        <p className="card-text placeholder-glow">
                                                            <span className="placeholder col-7"></span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="col-md-4 d-none d-lg-flex justify-content-center">
                                                                <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                                            </span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="placeholder col-6"></span>
                                                            <span className="placeholder col-8"></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="card mb-3  view" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-8 ">
                                                    <div className="card-body">
                                                        <p className="card-text placeholder-glow">
                                                            <span className="placeholder col-7"></span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="col-md-4 d-none d-lg-flex justify-content-center">
                                                                <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                                            </span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="placeholder col-6"></span>
                                                            <span className="placeholder col-8"></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="card mb-3  view" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-8 ">
                                                    <div className="card-body">
                                                        <p className="card-text placeholder-glow">
                                                            <span className="placeholder col-7"></span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="col-md-4 d-none d-lg-flex justify-content-center">
                                                                <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                                            </span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="placeholder col-6"></span>
                                                            <span className="placeholder col-8"></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="card mb-3  view" style={{ height: "100%" }} >
                                            <div className="row g-0" >
                                                <div className="col-md-8 ">
                                                    <div className="card-body">
                                                        <p className="card-text placeholder-glow">
                                                            <span className="placeholder col-7"></span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="col-md-4 d-none d-lg-flex justify-content-center">
                                                                <img src={loadingImg} className="img-fluid rounded-start d-lg-block d-none h-75 w-75" alt="loading..." />
                                                            </span>
                                                            <span className="placeholder col-4"></span>
                                                            <span className="placeholder col-6"></span>
                                                            <span className="placeholder col-8"></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
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

            {/* ImagePop */}
            {showImagePop &&
                <div className="d-inline-flex position-fixed" style={{ zIndex: "9", top: "10%", left: "37%" }}>
                    <img src={imageUrlForToShow} height={550} style={{ boxShadow: " rgba(0, 0, 0, 0.5) 100px 220px 700px 3000px" }} />
                    <span className="float-end mx-2 fs-4"><i className="bi bi-x-circle-fill text-light"
                        onClick={() => { setShowImagePop(false); setImageUrlForToShow("") }} style={{ cursor: "pointer" }}></i>
                    </span>
                </div>}

        </div>
    );
}