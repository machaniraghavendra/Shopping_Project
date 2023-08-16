import axios from 'axios';
import React, { useEffect, useState } from 'react';
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link, useNavigate } from "react-router-dom";
import Rating from '../Items/Rating/Rating';
import Footer from '../Footer/Footer';

export default function SearchScreen(props) {

    const [searchResult, setSearchResult] = useState([]);

    const [actualResultItems, setActualResultItems] = useState([]);

    const [relatedResultItems, setRelatedResultItems] = useState([]);

    const [suggestionsItems, setSuggestionsItems] = useState([]);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [search, setSearch] = useState("");

    const [info, setInfo] = useState("");

    const [fetchDone, setfetchDone] = useState(false);

    let query = search == "" ? new URLSearchParams(window.location.search).get("query") : search;

    const nav = useNavigate();

    const getSearchItems = () => {
        setSearch(query)
        let config = {
            headers: {
                userId: localStorage.getItem("currentuser")
            }
        }
        axios.get("http://localhost:8083/items/search?query=" + query, config).then(a => {
            return (
                setSearchResult(a.data),
                setSuggestionsItems(a.data.suggestions),
                setActualResultItems(a.data.actualResult),
                setRelatedResultItems(a.data.relatedResult),
                setfetchDone(true))
        })
            .catch((error) => {
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

    useEffect(() => {
        getSearchItems();
        check();
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-1 d-inline-flex justify-content-center '>
                    <i className="fa-thin fa-arrow-left btn btn-light m-1" style={{ fontFamily: "fontAwesome", paddingTop: "15%" }} onClick={() => { return (window.history.back()) }}></i>
                </div>
                <div className='col-11'>
                    <form onSubmit={(e) => { e.preventDefault(); nav("/mart/search?query=" + search); getSearchItems() }}>
                        <div className="form-floating">
                            <input type="search"
                                className="form-control form-control-sm"
                                onChange={(e) => { return (setSearch(e.target.value)) }}
                                id="floatingInput"
                                placeholder="Search here..."
                                value={search}
                            />
                            <label htmlFor="floatingInput">Search/Name...</label>
                        </div>
                    </form>
                </div>
            </div>
            <hr></hr>
            <h6 className='view p-1'>Search results : Found {searchResult.count}</h6>
            <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 gap-4 justify-content-center text-center ">
                {searchResult && fetchDone &&
                    actualResultItems && actualResultItems.map((e, i) => {
                        return (
                            <div className=' col row ' key={e.itemId}>&nbsp;
                                <div className="card " data-aos="fade-up" >
                                    <div className='card-header row'>
                                        <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                            <Rating times={e.ratingOfItem} />
                                        </div>
                                        <div className='col-7 justify-content-end text-end'>
                                            <button className='btn  m-2' onClick={() => {
                                                axios.post("http://localhost:8083/cart/", {
                                                    "itemId": e.itemId,
                                                    "userId": localStorage.getItem("currentuser")
                                                }, []).then((res) => { return (setInfo(res.data)) })
                                            }}
                                                data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"

                                            ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                            <button className='btn ' onClick={() => {
                                                axios.post("http://localhost:8083/fav/", {
                                                    "itemId": e.itemId,
                                                    "userId": localStorage.getItem("currentuser")
                                                }, []).then((res) => { return (setInfo(res.data)) })
                                            }}
                                                data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"
                                            ><i className="fa-solid fa-heart text-danger"></i> </button>
                                        </div>
                                    </div>
                                    <img src={e.itemImgUrl} className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                        <p className="card-text"> ₹{e.itemPrice}</p>
                                    </div>
                                    <a href={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info' >View More...</a>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {actualResultItems.length == 0 && <p className='view'>No results found</p>}

            <hr></hr>
            <h6 className='view p-1'>Related results :</h6>
            <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 gap-4 justify-content-center text-center ">
                {relatedResultItems && relatedResultItems.map((e, i) => {
                    return (
                        <div className=' col row ' key={e.itemId}>&nbsp;
                            <div className="card " data-aos="fade-up" >
                                <div className='card-header row'>
                                    <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                        <Rating times={e.ratingOfItem} />
                                    </div>
                                    <div className='col-7 justify-content-end text-end'>
                                        <button className='btn  m-2' onClick={() => {
                                            axios.post("http://localhost:8083/cart/", {
                                                "itemId": e.itemId,
                                                "userId": localStorage.getItem("currentuser")
                                            }, []).then((res) => { return (setInfo(res.data)) })
                                        }}
                                            data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"

                                        ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                        <button className='btn ' onClick={() => {
                                            axios.post("http://localhost:8083/fav/", {
                                                "itemId": e.itemId,
                                                "userId": localStorage.getItem("currentuser")
                                            }, []).then((res) => { return (setInfo(res.data)) })
                                        }}
                                            data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"
                                        ><i className="fa-solid fa-heart text-danger"></i> </button>
                                    </div>
                                </div>
                                <img src={e.itemImgUrl} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                    <p className="card-text"> ₹{e.itemPrice}</p>
                                </div>
                                <a href={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info' >View More...</a>
                            </div>
                        </div>
                    )
                })}
            </div>
            {relatedResultItems.length == 0 && <p className='view'>No Related items</p>}

            <hr></hr>
            {suggestionsItems && <h6 className='view p-1'>Suggestions :</h6>}
            <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 gap-4 justify-content-center text-center ">
                {suggestionsItems && suggestionsItems.map((e, i) => {
                    return (
                        <div className=' col row ' key={e.itemId}>&nbsp;
                            <div className="card " data-aos="fade-up" >
                                <div className='card-header row'>
                                    <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                        <Rating times={e.ratingOfItem} />
                                    </div>
                                    <div className='col-7 justify-content-end text-end'>
                                        <button className='btn  m-2' onClick={() => {
                                            axios.post("http://localhost:8083/cart/", {
                                                "itemId": e.itemId,
                                                "userId": localStorage.getItem("currentuser")
                                            }, []).then((res) => { return (setInfo(res.data)) })
                                        }}
                                            data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"

                                        ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                        <button className='btn ' onClick={() => {
                                            axios.post("http://localhost:8083/fav/", {
                                                "itemId": e.itemId,
                                                "userId": localStorage.getItem("currentuser")
                                            }, []).then((res) => { return (setInfo(res.data)) })
                                        }}
                                            data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-whatever="@mdo"
                                        ><i className="fa-solid fa-heart text-danger"></i> </button>
                                    </div>
                                </div>
                                <img src={e.itemImgUrl} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                    <p className="card-text"> ₹{e.itemPrice}</p>
                                </div>
                                <a href={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info' >View More...</a>
                            </div>
                        </div>
                    )
                })}

            </div>
            {suggestionsItems.length == 0 && <p className='view'>No suggestion items</p>}
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
            <br></br>
            <Footer />
        </div>
    );
}