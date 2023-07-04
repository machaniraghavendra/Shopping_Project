import axios from "axios";
import { useEffect, useState } from "react";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from "../Error/ErrorPage";

export default function UpdateItem(props) {

    const [isAdmin, setIsAdmin] = useState(false);

    const [fetchDone, setfetchDone] = useState(false);

    const [user, setUser] = useState([]);

    const [item, setItem] = useState([]);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [itemDetails, setItemDetails] = useState({ itemId: "", itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false, itemUpdatedOn: "", itemAddedOn: "" });

    const [errors, setErrors] = useState({ itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false });

    const [isSubmit, setIsSubmit] = useState(false);

    const nav = useNavigate();

    let num = window.location.href.substring(window.location.href.indexOf("/", window.location.href.length - 6)).replace("/", "").trim();

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

    const getItem = () => {
        axios.get("http://localhost:8083/items/" + num)
            .then((res) => {
                if (res.status == "200") {
                    setItem(res.data); setToItemDetail(res.data)
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

    const updateItem = () => {
        if (isSubmit) {
            axios.put("http://localhost:8083/items/", itemDetails).then(a => {
                nav("/admin/itemsList")
            }).catch((error) => {
                setError(true);
                if (error.response.data === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            })
        }
    }

    const deleteItem = () => {
        axios.delete("http://localhost:8083/items/" + itemDetails.itemId).then(a => {
            nav("/admin/itemsList")
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const setToItemDetail = (a) => {
        a.map(a => {
            setItemDetails({
                itemId: a.itemId,
                itemName: a.itemName,
                itemAddedOn: a.itemAddedOn,
                itemDesc: a.itemDesc,
                itemDimensions: a.itemDimensions,
                itemImgUrl: a.itemImgUrl,
                itemPrice: a.itemPrice,
                itemSpec: a.itemSpec,
                itemType: a.itemType,
                itemUpdatedOn: a.itemUpdatedOn,
                trending: a.trending
            })
        })
    }

    const setToItemDetails = (a) => {
        const { name, value } = a.target
        setItemDetails({ ...itemDetails, [name]: value })
        validate(itemDetails)
    }

    const validate = (item) => {
        const errors = { itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false }
        const regexprice = /^[0-9 , .]+$/;

        if (!item.itemName.trim()) {
            errors.itemName = "Name is required"
        } else {
            errors.itemName = "";
        }

        if (!item.itemDesc.trim()) {
            errors.itemDesc = "Description is required"
        }
        else if (item.itemDesc.trim().length > 250) {
            errors.itemDesc = "Must be less than 250 characters"
        }
        else {
            errors.itemDesc = "";
        }

        if (!item.itemImgUrl.trim()) {
            errors.itemImgUrl = "URL is required"
        } else {
            errors.itemImgUrl = "";
        }
        if (!item.itemDimensions.trim()) {
            errors.itemDimensions = "Dimensions are required"
        } else {
            errors.itemDimensions = "";
        }

        if (!item.itemPrice.trim()) {
            errors.itemPrice = "Price is required"
        }
        else if (!regexprice.test(item.itemPrice.trim())) {
            errors.itemPrice = "Price Should be numbers"
        }
        else {
            errors.itemPrice = "";
        }
        if (!item.itemSpec.trim()) {
            errors.itemSpec = "Specifications are required"
        } else {
            errors.itemSpec = "";
        }
        if (!item.itemType.trim()) {
            errors.itemType = "Type is required"
        } else {
            errors.itemType = "";
        }

        if (errors.itemName == "" && errors.itemDesc == "" && errors.itemDimensions == "" && errors.itemImgUrl == "" && errors.itemPrice == "" && errors.itemType == "" && errors.itemSpec == "") {
            setIsSubmit(true);
        }
        else {
            setIsSubmit(false);
        }
        setErrors(errors)
        return errors;
    }

    const setTheme = () => {
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        let card = document.getElementsByClassName("card-color");
        if (sessionStorage.getItem("dark") === "true") {
            for (const cards of card) {
                cards.classList.add("bg-dark");
                cards.classList.add("text-light")
                cards.classList.remove("bg-warning")
                cards.classList.remove("text-dark")
            }
        } else {
            for (const cards of card) {
                cards.classList.remove("bg-dark")
                cards.classList.add("bg-warning")
                cards.classList.add("text-dark")
                cards.classList.remove("text-light")
            }
        }
    }

    useEffect(() => {
        checkIsAdmin(); getItem(); currentuser(); setTheme()
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

                <div className="container viewbg text-light py-3 my-2">
                    {item.map(a => {
                        return (
                            <div className="container-fluid">
                                <h5 className="text-truncate">{itemDetails.itemName}</h5>
                                <div className="row  p-3">
                                    <form className="card-color col-12 col-lg-9" onSubmit={(e) => { updateItem(); return (e.preventDefault()) }}>
                                        <div className="row text-black" >
                                            <div className='row'>
                                                <div className="col-md g-4">
                                                    <div className="form-floating">
                                                        <input className="form-control" name="itemName" placeholder="name here" type={"text"} id="floatingInput" required
                                                            value={itemDetails.itemName}
                                                            onChange={setToItemDetails}
                                                        ></input>
                                                        <label htmlFor="floatingTextarea">Name</label>
                                                        <span className="text-danger">{errors.itemName}</span>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md g-4">
                                                        <div className="form-floating">
                                                            <textarea className="form-control " name="itemImgUrl" placeholder="Image url here"
                                                                onChange={setToItemDetails}
                                                                value={itemDetails.itemImgUrl}
                                                                type={"text"} id="floatingTextarea2" style={{ height: "130px" }}></textarea>
                                                            <label htmlFor="floatingTextarea2">Image Url</label>
                                                            <span className="text-danger">{errors.itemImgUrl}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md g-4">
                                                    <div className="form-floating">
                                                        <textarea className="form-control" name="itemDesc"
                                                            placeholder="description here" type={"text"} id="floatingTextarea2" style={{ height: "130px" }}
                                                            value={itemDetails.itemDesc}
                                                            onChange={setToItemDetails}
                                                        ></textarea>
                                                        <label htmlFor="floatingTextarea2">Description</label>
                                                        <span className="text-info text-muted fs-6">{250 - itemDetails.itemDesc.length < 0 ? "" : <span> Characters can fill : {250 - itemDetails.itemDesc.length}</span>}</span><br />
                                                        <span className="text-danger">{errors.itemDesc}</span>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md g-4">
                                                        <div className="form-floating">
                                                            <textarea className="form-control" name="itemSpec"
                                                                placeholder="Specifications here" type={"text"} id="floatingTextarea2" style={{ height: "130px" }}
                                                                value={itemDetails.itemSpec} onChange={setToItemDetails}
                                                            ></textarea>
                                                            <label htmlFor="floatingTextarea2">Specifications</label>
                                                            <span className="text-info text-muted fs-6">{250 - itemDetails.itemSpec.length < 0 ? "" : <span> Characters can fill : {250 - itemDetails.itemSpec.length}</span>}</span><br />
                                                            <span className="text-danger">{errors.itemSpec}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md g-4">
                                                    <select className="form-select form-select-sm" aria-label=".form-select-sm example"
                                                        name="itemType" value={itemDetails.itemType} onChange={setToItemDetails}>
                                                        <option value="">Types</option>
                                                        <option value="Mobile">Mobiles</option>
                                                        <option value="Sports">Sports</option>
                                                        <option value="Dresses for men">Dresses for men</option>
                                                        <option value="Dresses for women">Dresses for women</option>
                                                        <option value="Smart watches">Smart watches</option>
                                                        <option value="Analog Watches">Analog Watches</option>
                                                        <option value="TV">Television</option>
                                                        <option value="Headfones">Headfones</option>
                                                        <option value="Cameras">Cameras</option>
                                                        <option value="Musical Instruments">Musical Instruments</option>
                                                        <option value="Books">Books</option>
                                                    </select>
                                                    <span className="text-danger">{errors.itemType}</span>
                                                </div>
                                                <div className="col-md g-4">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" name="trending" value={!itemDetails.trending}
                                                            onChange={setToItemDetails}
                                                            id="flexCheckDefault" />
                                                        <label className="form-check-label text-light" htmlFor="flexCheckDefault">
                                                            Trending
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md g-4">
                                                    <div className="form-floating">
                                                        <input className="form-control" name="itemPrice"
                                                            placeholder="Price here" id="floatingInput" value={itemDetails.itemPrice} onChange={setToItemDetails}></input>
                                                        <label htmlFor="floatingTextarea">Price</label>
                                                        <span className="text-danger">{errors.itemPrice}</span>
                                                    </div>
                                                </div>

                                                <div className="col-md g-4">
                                                    <div className="form-floating">
                                                        <textarea className="form-control" name="itemDimensions"
                                                            placeholder="Dimensions here" id="floatingTextarea2" style={{ height: "130px" }} value={itemDetails.itemDimensions} onChange={setToItemDetails}></textarea>
                                                        <label htmlFor="floatingTextarea">Dimensions </label>
                                                        <span className="text-info text-muted fs-6">{250 - itemDetails.itemDimensions.length < 0 ? "" : <span> Characters can fill : {250 - itemDetails.itemDimensions.length}</span>}</span><br></br>
                                                        <span className="text-danger">{errors.itemDimensions}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="justify-content-center d-flex m-3 btn-group btn-sm">
                                            <button className="btn btn-success px-5"> Update</button>
                                            <button className="btn btn-danger px-5" onClick={() => { deleteItem() }}> Delete item</button>

                                        </div>
                                    </form>

                                    <div className="col-12 col-lg-3 py-2">
                                        <div className="justify-content-center d-flex my-4">
                                            <img src={itemDetails.itemImgUrl} width={200} height={200} alt="No image found with URL" />
                                        </div>
                                        <h6>Update History : </h6>
                                        <p className="px-2">1. {itemDetails.itemUpdatedOn == null ?
                                            itemDetails.itemAddedOn.replaceAll("T", " ").substring(itemDetails.itemAddedOn.indexOf("."), itemDetails.itemAddedOn)
                                            :
                                            itemDetails.itemUpdatedOn.replaceAll("T", " ").substring(itemDetails.itemUpdatedOn.indexOf("."), itemDetails.itemUpdatedOn)}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>

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