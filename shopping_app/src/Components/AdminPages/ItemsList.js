import axios from "axios";
import { useEffect, useState } from "react";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from "../Error/ErrorPage";
import ChatBot from '../ChatBot/ChatBot';

export default function ItemsList(props) {

    const [isAdmin, setIsAdmin] = useState(false);

    const [user, setUser] = useState([]);

    const [itemsList, setItemsList] = useState([]);

    const [fetchDone, setfetchDone] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [itemDetails, setItemDetails] = useState({ itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false });

    const [errors, setErrors] = useState({ itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false });

    const [isSubmit, setIsSubmit] = useState(false);

    const [classname, setClassname] = useState("");

    const [search, setSearch] = useState("");

    const [filters, setfilters] = useState("");

    const [info, setInfo] = useState("");

    const [informationPop, setInformationPop] = useState("");

    const [sortitems, setSortItems] = useState({ NameSort: false, DescSort: false, SpecSort: false, TypeSort: false, PriceSort: false, TrendingSort: true, DimensionsSort: false })

    const [itemsLimit, setItemsLimit] = useState(10);

    const paginationsAttributes = [];

    const paginationButtons = [];

    const showItemsInPagination = [];

    const nav = useNavigate();

    let pageNumber = Number.parseInt(window.location.href.substring(window.location.href.indexOf("=") + 1))

    let currentPage = 1;

    let prevRange;

    let currRange;

    let i = 0;

    for (let index = 0; index <= Number.parseInt(itemsList.length / itemsLimit); index++) {
        paginationsAttributes.push(index)
    }

    // Pagination
    if (itemsList) {
        currentPage = pageNumber;
        prevRange = (pageNumber - 1) * itemsLimit;
        currRange = (pageNumber) * itemsLimit
        if (filters || search) {
            for (let i = 0; i < itemsList.length; i++) {
                showItemsInPagination.push(itemsList[i])
            }
        } else {
            for (let i = prevRange; i < currRange; i++) {
                showItemsInPagination.push(itemsList[i]);
            }
        }

        if (pageNumber == 1) {
            paginationButtons.push(pageNumber)
            paginationButtons.push(pageNumber + 1)
        }
        else if (pageNumber == paginationsAttributes[paginationsAttributes.length - 1] + 1) {
            paginationButtons.push(pageNumber - 1)
            paginationButtons.push(pageNumber)
        }
        else {
            paginationButtons.push(pageNumber - 1)
            paginationButtons.push(pageNumber)
            paginationButtons.push(pageNumber + 1)
        }
    }

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

    const getAllItemsList = () => {
        axios.get("http://localhost:8083/items/").then(a => { setItemsList(a.data) }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const sortItems = (a) => {
        if (a === "name") {
            setSortItems({ NameSort: !sortitems.NameSort, DescSort: sortitems.DescSort, SpecSort: sortitems.SpecSort, TypeSort: sortitems.TypeSort, PriceSort: sortitems.PriceSort, DimensionsSort: sortitems.DimensionsSort, TrendingSort: sortitems.TrendingSort })
        }
        if (a === "trending") {
            setSortItems({ TrendingSort: !sortitems.TrendingSort, NameSort: sortitems.NameSort, DescSort: sortitems.DescSort, SpecSort: sortitems.SpecSort, TypeSort: sortitems.TypeSort, PriceSort: sortitems.PriceSort, DimensionsSort: sortitems.DimensionsSort })
        }
        if (a === "dimensions") {
            setSortItems({ DimensionsSort: !sortitems.DimensionsSort, TrendingSort: sortitems.TrendingSort, NameSort: sortitems.NameSort, DescSort: sortitems.DescSort, SpecSort: sortitems.SpecSort, TypeSort: sortitems.TypeSort, PriceSort: sortitems.PriceSort })
        }
        if (a === "price") {
            setSortItems({ PriceSort: !sortitems.PriceSort, TrendingSort: sortitems.TrendingSort, NameSort: sortitems.NameSort, DescSort: sortitems.DescSort, SpecSort: sortitems.SpecSort, TypeSort: sortitems.TypeSort, DimensionsSort: sortitems.DimensionsSort })
        }
        if (a === "type") {
            setSortItems({ TypeSort: !sortitems.TypeSort, TrendingSort: sortitems.TrendingSort, NameSort: sortitems.NameSort, DescSort: sortitems.DescSort, SpecSort: sortitems.SpecSort, PriceSort: sortitems.PriceSort, DimensionsSort: sortitems.DimensionsSort })
        }
        if (a === "spec") {
            setSortItems({ SpecSort: !sortitems.SpecSort, TrendingSort: sortitems.TrendingSort, NameSort: sortitems.NameSort, DescSort: sortitems.DescSort, TypeSort: sortitems.TypeSort, PriceSort: sortitems.PriceSort, DimensionsSort: sortitems.DimensionsSort })
        }
        if (a === "desc") {
            setSortItems({ DescSort: !sortitems.DescSort, TrendingSort: sortitems.TrendingSort, NameSort: sortitems.NameSort, SpecSort: sortitems.SpecSort, TypeSort: sortitems.TypeSort, PriceSort: sortitems.PriceSort, DimensionsSort: sortitems.DimensionsSort })
        }
    }

    const setToItemDetails = (a) => {
        const { name, value } = a.target
        setItemDetails({ ...itemDetails, [name]: value })
        validate(itemDetails)
    }

    const clearFields = () => {
        setItemDetails({ itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false })
        clearErrorFields()
    }

    const clearErrorFields = () => {
        setErrors({ itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false })
    }

    const addItem = () => {
        if (isSubmit) {
            axios.post("http://localhost:8083/items/", itemDetails).then(a => {
                clearFields(); getAllItemsList(); setInfo(a.data); setInformationPop(true);
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

    const validate = (item) => {
        const errors = { itemName: "", itemDesc: "", itemImgUrl: "", itemDimensions: "", itemPrice: "", itemSpec: "", itemType: "", trending: false }
        const regexprice = /^[0-9]+$/;

        if (!item.itemName) {
            errors.itemName = "Name is required"
        } else {
            errors.itemName = "";
        }

        if (!item.itemDesc) {
            errors.itemDesc = "Description is required"
        }
        else if (item.itemDesc.length > 250) {
            errors.itemDesc = "Must be less than 250 characters"
        }
        else {
            errors.itemDesc = "";
        }

        if (!item.itemImgUrl) {
            errors.itemImgUrl = "URL is required"
        } else {
            errors.itemImgUrl = "";
        }
        if (!item.itemDimensions) {
            errors.itemDimensions = "Dimensions are required"
        } else {
            errors.itemDimensions = "";
        }

        if (!item.itemPrice) {
            errors.itemPrice = "Price is required"
        }
        else if (!regexprice.test(item.itemPrice)) {
            errors.itemPrice = "Price Should be numbers"
        }
        else {
            errors.itemPrice = "";
        }
        if (!item.itemSpec) {
            errors.itemSpec = "Specifications are required"
        } else {
            errors.itemSpec = "";
        }
        if (!item.itemType) {
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

    useEffect(() => {
        sessionStorage.getItem("dark") == "true" ? setClassname("modal-content bg-dark text-light") : setClassname("modal-content")
        sessionStorage.getItem("dark") === "true" ? document.body.style = " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)"
            : document.body.style = "background: radial-gradient( #f5ff37, rgb(160, 255, 97))"
        checkIsAdmin();
        currentuser();
        getAllItemsList();
        if (window.location.href == "http://localhost:3000/admin/itemsList") {
            nav("/admin/itemsList?page=1")
        }
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

                <div className="container-fluid my-3 viewbg py-2">
                    <div className="container-fluid row my-4 ">
                        <div className="col-xl-2 col-12 my-2 my-xl-0">
                            <input type='search' className='form-control form-control-sm w-lg-75 w-100 ' id="viewSearchbar" placeholder='Search for Type/Name/Price'
                                onChange={(a) => {
                                    setSearch(a.target.value)
                                }} />
                        </div>
                        <div className="col-xl-8 col my-md-3 my-lg-0">
                            <div className="gap-2 justify-content-center btn-group-sm gap-2 d-none d-lg-flex" role="group" >
                                <input type="radio" className="btn-check " name="btnradio" id="all" autoComplete="off" onClick={() => setfilters("")} checked={filters === "" && true} />
                                <label className="btn btn-outline-light " htmlFor="all">All</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Mobile" autoComplete="off" onClick={() => { setfilters("Mobile"); }} />
                                <label className="btn btn-outline-warning " htmlFor="Mobile">Mobiles</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Sports" autoComplete="off" onClick={() => setfilters("Sports")} />
                                <label className="btn btn-outline-warning " htmlFor="Sports">Sports</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Smart_watches" autoComplete="off" onClick={() => setfilters("Smart_watches")} />
                                <label className="btn btn-outline-warning " htmlFor="Smart_watches">Smart Wa..</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Analog_Watches" autoComplete="off" onClick={() => { setfilters("Analog_Watches") }} />
                                <label className="btn btn-outline-warning " htmlFor="Analog_Watches">Analog Wa..</label>

                                <input type="radio" className="btn-check " name="btnradio" id="TV" autoComplete="off" onClick={() => setfilters("TV")} />
                                <label className="btn btn-outline-warning " htmlFor="TV">TV</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Headfones" autoComplete="off" onClick={() => setfilters("Headfones")} />
                                <label className="btn btn-outline-warning " htmlFor="Headfones">Headfo..</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Cameras" autoComplete="off" onClick={() => setfilters("Cameras")} />
                                <label className="btn btn-outline-warning " htmlFor="Cameras">Cameras</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Musical_Instruments" autoComplete="off" onClick={() => setfilters("Musical_Instruments")} />
                                <label className="btn btn-outline-warning " htmlFor="Musical_Instruments">Musical Ins..</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Books" autoComplete="off" onClick={() => setfilters("Books")} />
                                <label className="btn btn-outline-warning " htmlFor="Books">Books</label>

                                <input type="radio" className="btn-check " name="btnradio" id="Dresses" autoComplete="off" onClick={() => setfilters("Dresses")} />
                                <label className="btn btn-outline-warning " htmlFor="Dresses">Dresses</label>
                            </div>
                            <div className="btn-group d-block d-lg-none d-flex gap-2 justify-content-center">
                                <button type="button" className="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Fllters
                                </button>
                                <ul className="dropdown-menu bg-black gap-1 p-2  text-center dropdown-menu-start dropdown-menu-lg-end">
                                    <li className="">
                                        <input type="radio" className="btn-check" name="btnradiodrop" id="alldrop" autoComplete="off" onClick={() => setfilters("")} checked={filters === "" && true} />
                                        <label className="btn btn-outline-light d-flex" htmlFor="alldrop">All</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check" name="btnradiodrop" id="Mobiledrop" autoComplete="off" onClick={() => { setfilters("Mobile"); }} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Mobiledrop">Mobiles</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check" name="btnradiodrop" id="Sportsdrop" autoComplete="off" onClick={() => setfilters("Sports")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Sportsdrop">Sports</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="Smart_watchesdrop" autoComplete="off" onClick={() => setfilters("Smart_watches")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Smart_watchesdrop">Smart Watches</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="Analog_Watchesdrop" autoComplete="off" onClick={() => { setfilters("Analog_Watches") }} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Analog_Watchesdrop">Analog Watches</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="TVdrop" autoComplete="off" onClick={() => setfilters("TV")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="TVdrop">TV</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="Headfonesdrop" autoComplete="off" onClick={() => setfilters("Headfones")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Headfonesdrop">Headfones</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="Camerasdrop" autoComplete="off" onClick={() => setfilters("Cameras")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Camerasdrop">Cameras</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="Musical_Instrumentsdrop" autoComplete="off" onClick={() => setfilters("Musical_Instruments")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Musical_Instrumentsdrop">Musical Inst..</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="Booksdrop" autoComplete="off" onClick={() => setfilters("Books")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Booksdrop">Books</label>
                                    </li>
                                    <li>
                                        <input type="radio" className="btn-check " name="btnradiodrop" id="Dressesdrop" autoComplete="off" onClick={() => setfilters("Dresses")} />
                                        <label className="btn btn-outline-warning d-flex" htmlFor="Dressesdrop">Dresses</label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-2 col btn-group gap-2">
                            <button type="button" className="btn btn-outline-info dropdown-toggle btn-sm" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                Set Items Limit
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start bg-secondary p-2">
                                <input type="radio" className="btn-check " name="btnradiolimit" id="5" autoComplete="off" onClick={() => { setItemsLimit(5) }} checked={itemsLimit == 5 && true} />
                                <label className="btn btn-outline-light " htmlFor="5">5</label>
                                <input type="radio" className="btn-check " name="btnradiolimit" id="10" autoComplete="off" onClick={() => { setItemsLimit(10) }} checked={itemsLimit == 10 && true} />
                                <label className="btn btn-outline-light " htmlFor="10">10</label>
                                <input type="radio" className="btn-check " name="btnradiolimit" id="15" autoComplete="off" onClick={() => { setItemsLimit(15) }} checked={itemsLimit == 15 && true} />
                                <label className="btn btn-outline-light " htmlFor="15">15</label>
                                <input type="radio" className="btn-check " name="btnradiolimit" id="20" autoComplete="off" onClick={() => { setItemsLimit(20) }} checked={itemsLimit == 20 && true} />
                                <label className="btn btn-outline-light " htmlFor="20">20</label>
                                <div className=" my-3 mx-1 text-light">
                                    <label htmlFor="limittext">Set limit...</label>
                                    <input type="number" className="form-control" name="btntextlimit" id="limittext" autoComplete="off" onChange={(a) => { setItemsLimit(a.target.value == 0 || a.target.value > itemsList.length ? 1 : a.target.value) }} value={itemsLimit} />
                                </div>
                            </ul>
                            <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#popUpforItemAdd">Add Item +</button>
                        </div>
                    </div>

                    <div className="table-responsive-xl">
                        <table className="table table-dark table-bordered border-warning table-hover border-0 ">
                            <thead style={{ cursor: "pointer" }}>
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col"  >Image</th>
                                    <th scope="col" onClick={() => { return (sortItems("name")) }}>Name {sortitems.NameSort ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up"></i>}</th>
                                    <th scope="col" onClick={() => { return (sortItems("desc")) }}>Description {sortitems.DescSort ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up"></i>}</th>
                                    <th scope="col" onClick={() => { return (sortItems("spec")) }}>Specifications {sortitems.SpecSort ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up"></i>}</th>
                                    <th scope="col" onClick={() => { return (sortItems("type")) }}>Type {sortitems.TypeSort ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up"></i>}</th>
                                    <th scope="col" onClick={() => { return (sortItems("price")) }}>Price {sortitems.PriceSort ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up"></i>}</th>
                                    <th scope="col" onClick={() => { return (sortItems("dimensions")) }}>Dimensions {sortitems.DimensionsSort ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up"></i>}</th>
                                    <th scope="col" onClick={() => { return (sortItems("trending")) }}>Trending {!sortitems.TrendingSort ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up"></i>}</th>
                                </tr>
                            </thead>
                            {fetchDone ?
                                showItemsInPagination
                                    .sort((a, b) => {
                                        if (sortitems.NameSort) {
                                            return a.itemName.length - b.itemName.length
                                        }
                                        else {
                                            return b.itemName.length - a.itemName.length;
                                        }
                                    })
                                    .sort((a, b) => {
                                        if (sortitems.DescSort) {
                                            return a.itemDesc.length - b.itemDesc.length
                                        }
                                    })
                                    .sort((a, b) => {
                                        if (sortitems.SpecSort) {
                                            return a.itemSpec.length - b.itemSpec.length
                                        }
                                    })
                                    .sort((a, b) => {
                                        if (sortitems.TypeSort) {
                                            return a.itemType.length - b.itemType.length
                                        }
                                    })
                                    .sort((a, b) => {
                                        if (sortitems.PriceSort) {
                                            return Number.parseInt(a.itemPrice.replaceAll(",", "").replaceAll("₹", "").replaceAll(".00", ""))
                                                - Number.parseInt(b.itemPrice.replaceAll(",", "").replaceAll("₹", "").replaceAll(".00", ""))
                                        }
                                    })
                                    .sort((a, b) => {
                                        if (sortitems.DimensionsSort) {
                                            return a.itemDimensions.length - b.itemDimensions.length
                                        }
                                    })
                                    .sort((a, b) => {
                                        if (sortitems.TrendingSort) {
                                            return b.trending - a.trending
                                        }
                                    })
                                    .filter(a => {
                                        if (search === "") {
                                            return a;
                                        }
                                        if (a.itemName.toLowerCase().includes(search.toLowerCase())
                                            || a.itemType.toLowerCase().includes(search.toLowerCase())
                                            || a.itemPrice.toLowerCase().replaceAll(",", "").includes(search.toLowerCase())) {
                                            return a;
                                        }
                                    })
                                    .filter(a => {
                                        if (filters === "") {
                                            return a;
                                        }
                                        if (a.itemType.toLowerCase().includes(filters.toLowerCase())) {
                                            return a;
                                        }
                                        if (a.itemType.toLowerCase().includes(filters.replaceAll("_", " ").toLowerCase())) {
                                            return a;
                                        }
                                    }
                                    )
                                    .map((a, index) => {
                                        i++;
                                        return (
                                            <tbody key={index}>
                                                <tr id="items_list_row">
                                                    <th scope="row">{filters || search ? index + 1 : Number.parseInt(prevRange++) + 1}</th>
                                                    <td>{a.itemImgUrl ? <img src={a.itemImgUrl} width="30" height="30" /> : <i className='fa-solid fa-user'></i>}</td>
                                                    <td className="text-truncate"><Link to={"/admin/updateitem/" + a.itemId} className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{a.itemName.length > 15 ? a.itemName.substring(0, 15) + "..." : a.itemName}</Link></td>
                                                    <td className="text-truncate">{a.itemDesc.length > 15 ? a.itemDesc.substring(0, 15) + "..." : a.itemDesc}</td>
                                                    <td className="text-truncate">{a.itemSpec.length > 15 ? a.itemSpec.substring(0, 15) + "..." : a.itemSpec}</td>
                                                    <td className="text-truncate">{a.itemType.length > 15 ? a.itemType.substring(0, 15) + "..." : a.itemType}</td>
                                                    <td className="text-truncate text-warning">₹{a.itemPrice}</td>
                                                    <td className="text-truncate">{a.itemDimensions.length > 15 ? a.itemDimensions.substring(0, 15) + "..." : a.itemDimensions}</td>
                                                    <td className="text-truncate">{a.trending ? <span className=" badge text-bg-success">Yes</span> : <span className=" badge text-bg-danger">No</span>}</td>
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
                            {i == 0 && <tbody >
                                <tr className="text-center">
                                    <td colSpan="10" className="h5">
                                        No items found
                                    </td>
                                </tr>
                            </tbody>}
                        </table>


                        {/* Pagination */}
                        {(!(filters || search) && !(itemsLimit == itemsList.length) )&&
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-xl-end justify-content-center pagination-sm mx-3 gap-2">

                                    <li className={pageNumber == 1 ? "page-item disabled" : "page-item active"}>
                                        <Link className="page-link" to={"/admin/itemsList?page=" + (pageNumber - 1)}
                                        ><i className="bi bi-chevron-double-left"></i>
                                        </Link>
                                    </li>

                                    <div className="d-flex gap-2 justify-content-center btn-group-sm gap-2" role="group" key={i} >

                                        {pageNumber != 2 && <li className={pageNumber == 1 ? "page-item active" : "page-item"} hidden={pageNumber == 1 ? true : false}>
                                            <Link className="page-link" to={"/admin/itemsList?page=" + 1}>1</Link>
                                        </li>}

                                        {!(pageNumber == 1 || pageNumber == 2) && <span className="text-light">....</span>}

                                        {paginationButtons.map(a => {
                                            return (
                                                <li className={pageNumber == (a) ? "page-item active" : "page-item"} key={a}>
                                                    <Link className="page-link" to={"/admin/itemsList?page=" + a}>{a}</Link>
                                                </li>
                                            )
                                        })}

                                        {!(pageNumber == paginationsAttributes[paginationsAttributes.length - 1] + 1
                                            || pageNumber == paginationsAttributes[paginationsAttributes.length - 1])
                                            && <span className="text-light">....</span>}

                                    </div>

                                    {pageNumber != paginationsAttributes[paginationsAttributes.length - 1] + 1 &&
                                        <li className={pageNumber == paginationsAttributes[paginationsAttributes.length - 1] + 1 ? "page-item active" : "page-item"} hidden={pageNumber == paginationsAttributes[paginationsAttributes.length - 1] ? true : false}>
                                            <Link className="page-link" to={"/admin/itemsList?page=" + paginationsAttributes[paginationsAttributes.length - 1]}>{paginationsAttributes[paginationsAttributes.length - 1] + 1}</Link>
                                        </li>}

                                    <li className={pageNumber == paginationsAttributes[paginationsAttributes.length - 1] + 1 ? "page-item disabled" : "page-item active"}>
                                        <Link className="page-link" to={"/admin/itemsList?page=" + (pageNumber + 1)}>
                                            <i className="bi bi-chevron-double-right"></i>
                                        </Link>
                                    </li>

                                </ul>

                            </nav>
                        }

                    </div>
                </div>

                <ChatBot />

                {/* Add item popup */}
                <div className="modal fade" id="popUpforItemAdd" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className={classname}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="popUpforItemAdd">Add Item</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form className="card-color p-3">
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

                                            <div className="col-md g-4">
                                                <div className="form-floating">
                                                    <textarea className="form-control" name="itemImgUrl" placeholder="Image url here"
                                                        onChange={setToItemDetails}
                                                        value={itemDetails.itemImgUrl}
                                                        type={"text"} id="floatingInput"></textarea>
                                                    <label htmlFor="floatingTextarea">Image Url</label>
                                                    <span className="text-danger">{errors.itemImgUrl}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md g-4">
                                                <div className="form-floating">
                                                    <textarea className="form-control" name="itemDesc"
                                                        placeholder="description here" type={"text"} id="floatingInput"
                                                        value={itemDetails.itemDesc}
                                                        onChange={setToItemDetails}
                                                    ></textarea>
                                                    <label htmlFor="floatingTextarea">Description</label>
                                                    <span className="text-info text-muted fs-6">{250 - itemDetails.itemDesc.length < 0 ? "" : <span> Characters can fill : {250 - itemDetails.itemDesc.length}</span>}</span><br />
                                                    <span className="text-danger">{errors.itemDesc}</span>
                                                </div>
                                            </div>

                                            <div className="col-md g-4">
                                                <div className="form-floating">
                                                    <textarea className="form-control" name="itemSpec"
                                                        placeholder="Specifications here" type={"text"} id="floatingInput"
                                                        value={itemDetails.itemSpec} onChange={setToItemDetails}
                                                    ></textarea>
                                                    <label htmlFor="floatingTextarea">Specifications</label>
                                                    <span className="text-info text-muted fs-6">{250 - itemDetails.itemSpec.length < 0 ? "" : <span> Characters can fill : {250 - itemDetails.itemSpec.length}</span>}</span><br />
                                                    <span className="text-danger">{errors.itemSpec}</span>
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
                                                    <label className="form-check-label text-bg-light px-2" htmlFor="flexCheckDefault">
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
                                                        placeholder="Dimensions here" id="floatingInput" value={itemDetails.itemDimensions} onChange={setToItemDetails}></textarea>
                                                    <label htmlFor="floatingTextarea">Dimensions </label>
                                                    <span className="text-info text-muted fs-6">{250 - itemDetails.itemDimensions.length < 0 ? "" : <span> Characters can fill : {250 - itemDetails.itemDimensions.length}</span>}</span><br></br>
                                                    <span className="text-danger">{errors.itemDimensions}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { clearFields() }}>Clear fields</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary" id="addItem" onClick={() => { addItem() }}>Add</button>
                            </div>
                        </div>
                    </div>
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

                {/* Message pop */}
                {informationPop && <div className="toast  fade show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            {info}
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => {
                                    setInformationPop(false)
                                    return (
                                        setInfo("")
                                    )
                                }}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>}

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