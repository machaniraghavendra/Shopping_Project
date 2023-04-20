import React, { useEffect, useState } from 'react'
import "../Shirts/shirt.css"
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Shirts() {

    const [shirt, setShirts] = useState([]);

    const [info, setInfo] = useState("");

    const [showToast, setShowToast] = useState(false);

    const timeout = () => {
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    }

    const fetch = () => {
        axios.get("http://localhost:8083/items/")
            .then((res) => { return (setShirts(res.data)) })
    }

    useEffect(() => {
        return (fetch())
    }, [])
    return (
        <div className='container-fluid'>
            <h2 id='Dresses' className='dark'>Dresses <i className="fa-duotone fa-shirt" style={{ fontFamily: "fontAwesome" }}></i></h2>

            {shirt.length == [] || !shirt.map(e => { e.itemType.toLowerCase().includes("Dresses".toLowerCase()) }) ?

                <div className='container-fluid justify-content-center text-center'>
                    <h1>No Items Found !</h1>
                </div>
                :
                <>
                    <div className='container-fluid justify-content-center text-center' id='back-card-bg-menshirts'>
                        <h2 id='Shirts-men' className='m-3'>Shirts For Men</h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4 justify-content-center text-center">
                            {shirt.map(e => {
                                if (e.itemType.toLowerCase().includes("Dresses for men".toLowerCase())) {
                                    return (
                                        <div className='col row' key={e.itemId}>
                                            <div className="card" data-aos="zoom-in-right">
                                                <div className='card-header justify-content-end text-end'>
                                                    <button className='btn  m-2' onClick={() => {
                                                        if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
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
                                                            }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                        } else {
                                                            return (setInfo("Login required !"), setShowToast(true), timeout())
                                                        }

                                                    }}

                                                    ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                    <button className='btn ' onClick={() => {
                                                        if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
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
                                                            }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                        } else {
                                                            return (setInfo("Login required !"), setShowToast(true), timeout())
                                                        }
                                                    }}
                                                        data-bs-toggle="modal" data-bs-target="#exampleModal4" data-bs-whatever="@mdo"
                                                    ><i className="fa-solid fa-heart text-danger"></i> </button>
                                                </div>
                                                <img src={e.itemImgUrl} className="card-img-top" alt="..." />
                                                <div className="card-body">
                                                    <h6 className="card-title text-truncate">{e.itemName}</h6>
                                                    <p className="card-text text-truncate"><b>Price : </b>{e.itemPrice}</p>
                                                </div>
                                                <Link to={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info'>View More...</Link>

                                            </div>
                                        </div>
                                    )
                                }
                            })
                            }
                        </div><br></br>
                        <Link className='btn btn-info' to={"/men-dresses"}>View More Men Dresses....</Link><br></br>
                        &nbsp;
                    </div>
                    <br ></br>
                    <div className='container-fluid justify-content-center text-center' id='back-card-bg-womenshirts'>
                        <h2 id='Shirts-women' className='m-3'>Shirts For Women</h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4 justify-content-center text-center">
                            {shirt.map(e => {
                                if (e.itemType.toLowerCase().includes("Dresses for Women".toLowerCase())) {
                                    return (
                                        <div className='col row' key={e.itemId}>
                                            <div className="card" data-aos="zoom-in-right">
                                                <div className='card-header justify-content-end text-end'>
                                                    <button className='btn  m-2' onClick={() => {
                                                        if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
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
                                                            }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                        } else {
                                                            return (setInfo("Login required !"), setShowToast(true), timeout())
                                                        }
                                                    }}
                                                    ><i className='fa-solid fa-cart-shopping text-info'></i></button>
                                                    <button className='btn' onClick={() => {
                                                        if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser")) {
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
                                                            }, []).then((res) => { return (setInfo(res.data), setShowToast(true), timeout()) })
                                                        } else {
                                                            return (setInfo("Login required !"), setShowToast(true), timeout())
                                                        }
                                                    }}
                                                    ><i className="fa-solid fa-heart text-danger"></i> </button>
                                                </div>
                                                <img src={e.itemImgUrl} className="card-img-top" alt="..." />
                                                <div className="card-body">
                                                    <h6 className="card-title text-truncate" id={e.itemName}>{e.itemName}</h6>
                                                    <p className="card-text"><b>Price : </b>{e.itemPrice}</p>
                                                </div>
                                                <Link to={'/view/' + e.itemId + "/" + e.itemName} className='btn btn-info'>View More...</Link>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                            }
                        </div><br></br>
                        <Link className='btn btn-info' to={"/women-dresses"}>View More Women Dresses....</Link><br></br>
                        &nbsp;
                    </div>
                </>

            }
            <hr />
            {showToast && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body ">
                        <p className='text-truncate'>{info}</p>
                        <div className="mt-2 pt-2">
                            <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast">Ok</button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
