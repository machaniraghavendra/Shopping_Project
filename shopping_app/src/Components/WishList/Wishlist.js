import React, { useEffect, useState } from "react";
import axios from "axios";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import ChatBot from "../ChatBot/ChatBot";
import loadingImg from "../Loading_Card.png";
import LogOut from "../Login/LogOut";
import Rating from "../Items/Rating/Rating";

export default function Wishlist(props) {
  const [search, setSearch] = useState("");

  const [data, setData] = useState([]);

  const [findvalue, setFindvalue] = useState("");

  const [find, setFind] = useState(false);

  const [info, setInfo] = useState("");

  const [user, setUser] = useState([]);

  const [showToast, setShowToast] = useState(false);

  const [fetchDone, setfetchDone] = useState(false);

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const timeout = () => {
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };
  let total = 0;
  let totalAmount = "";

  var count = 0;

  const fetch = () => {
    axios
      .get("http://localhost:8083/fav/userId/" + props.user)
      .then((res) => {
        if (res.status == "200") {
          setfetchDone(true);
        }
        return setData(res.data);
      })
      .catch((error) => {
        setError(true);
        if (error.response.data === undefined) {
          setErrorMessage("Something went wrong");
        } else {
          setErrorMessage(
            error.response.data.message +
            " of status = '" +
            error.response.data.status +
            "'"
          );
        }
      });
  };


  const addIntoInterest = (id) => {
    axios.post("http://localhost:8083/items/history?user=" + localStorage.getItem("currentuser") + "&id=" + id)
      .catch((error) => {
        setError(true);
        if (error.response.data === undefined) {
          setErrorMessage("Something went wrong")
        } else {
          setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
        }
      })
  }

  setTimeout(() => {
    window.onload = document.querySelector(
      ".check .container-fluid h1"
    ).innerHTML = "Contents";
  }, 100);

  const check = () => {
    let top = document.querySelector(".check");
    let title = document.querySelector(".check .container-fluid h1");
    let title2 = document.querySelector(".check .container-fluid h2");

    let scroll = document.querySelector(".scroll-up");
    if (
      document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150
    ) {
      top.classList.add("fixed-top");
      title.innerHTML =
        ' <img src="https://media.istockphoto.com/vectors/shopping-bag-flat-icon-pixel-perfect-for-mobile-and-web-vector-id1145783156?k=20&m=1145783156&s=612x612&w=0&h=RJdFiHDeaQJt3KbyIfJmWS12iQrD63DUCMWPrFLumwk=" alt="" width="35" height="35" className="d-inline-block align-text-top" />&nbsp;Shopping Mart';
      title2.innerHTML = "";
    }
    if (
      document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150
    ) {
      scroll.style.display = "block";
      title2.classList.remove("d-none");
    } else {
      top.classList.remove("fixed-top");
      title.innerHTML = "Contents";
      scroll.style.display = "none";
    }
  };

  useEffect(() => {
    sessionStorage.getItem("dark") === "true"
      ? (document.body.style =
        " background: linear-gradient(140deg, #050505 60%, rgb(22, 14, 132) 0%)")
      : (document.body.style =
        "background: radial-gradient( #f5ff37, rgb(160, 255, 97))");
    window.onscroll = () => check();
    document.title = "WishList | Shopping Mart";
    axios
      .get("http://localhost:8083/user/userid/" + props.user)
      .then((a) => {
        return setUser(a.data);
      })
      .catch((error) => {
        setError(true);
        if (error.response.data === undefined) {
          setErrorMessage("Something went wrong");
        } else {
          setErrorMessage(
            error.response.data.message +
            " of status = '" +
            error.response.data.status +
            "'"
          );
        }
      });
    return fetch();
  }, []);

  return (
    <div className="container-fluid">
      {/* Header */}
      <header className="cart-head">
        <div className="container-fluid ">
          <nav className="navbar bg-none navbar-expand-lg sticky-top">
            <div className="container-fluid ">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo03"
                aria-controls="navbarTogglerDemo03"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i
                  className="fa-thin fa-arrow-left btn m-1"
                  style={{ fontFamily: "fontAwesome" }}
                  onClick={() => {
                    return window.history.back();
                  }}
                ></i>
                <span className="navbar-toggler-icon"></span>
              </button>
              <i
                className="fa-thin fa-arrow-left btn m-1 d-none d-lg-block"
                style={{ fontFamily: "fontAwesome" }}
                onClick={() => {
                  return window.history.back();
                }}
              ></i>
              <Link to="/mart" className="nav-link">
                {" "}
                <h1 className="navbar-brand">
                  <img
                    src={img}
                    alt=""
                    width="30"
                    height="30"
                    className="d-inline-block align-text-top"
                  />
                  &nbsp;Shopping Mart
                </h1>
              </Link>
              <br></br>
              <div
                className="collapse navbar-collapse justify-content-end gap-2"
                id="navbarTogglerDemo03"
              >
                <br></br>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                    aria-expanded="false"
                  >
                    {fetchDone ?
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
                    <li>
                      <Link className="dropdown-item" to={"/profile/settings"}>
                        <i className="fa-solid fa-gear"></i> Settings
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item text-center">
                        <button
                          className="btn btn-outline-danger  justify-content-end "
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal3"
                          data-bs-whatever="@fat"
                        >
                          <i className="fa-solid fa-power-off"></i> Sign out
                        </button>
                      </a>
                    </li>
                  </ul>
                </div>
                &nbsp;
              </div>
            </div>
          </nav>

          <br></br>

          <nav className="navbar navbar-expand-lg check bg-light">
            <div className="container-fluid  ">
              <button
                className="navbar-toggler "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <h2 className=" d-sm-block d-md-none d-lg-none navbar-brand"></h2>
              <h1 className="navbar-brand"></h1>
              <div
                className="collapse navbar-collapse "
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0  ">
                  <div className="container-fluid text-center">
                    <div className="row row-cols-3 row-cols-lg-5 g-2 g-lg-5 ">
                      <li className="nav-item ">
                        <a
                          className=" d-lg-none nav-link"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasResponsive"
                          aria-controls="offcanvasResponsive"
                        >
                          <h5>
                            <i className="fa-solid fa-list"></i> Browse contents
                          </h5>
                        </a>
                      </li>
                      <li className="nav-item ">
                        <Link
                          className="nav-link text-dark"
                          aria-current="page"
                          to="/cart"
                        >
                          <h5> Cart</h5>
                        </Link>
                      </li>
                    </div>
                  </div>
                </ul>
                <div className="d-flex justify-content-center">
                  <div
                    className="search p-2"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-bs-whatever="@mdo"
                  >
                    <i className="fa-solid fa-search"></i>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className="container-fluid middle">
        <div className="cart-aside ">
          <aside className=" ">
            <div
              className="offcanvas-lg offcanvas-start alert alert-info"
              tabIndex="-1"
              id="offcanvasResponsive"
              aria-labelledby="offcanvasResponsiveLabel"
            >
              <div className="alert alert-warning d-none d-lg-block">
                <i className="fa-solid fa-circle-dot"></i> Browse Contents{" "}
              </div>
              <div className="offcanvas-header">
                <h5
                  className="offcanvas-title text-dark"
                  id="offcanvasResponsiveLabel"
                >
                  Browse contents
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  data-bs-target="#offcanvasResponsive"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body bg-warning">
                <ul className="navbar-nav me-auto mb mb-lg-0  listss">
                  <li className="nav-item">
                    <Link
                      className="nav-link text-auto"
                      aria-current="page"
                      to="/cart"
                    >
                      <i className="fa-solid fa-cart-shopping text-info"></i>{" "}
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>
              <div className='offcanvas-footer down my-3 d-lg-none '>
                <h5>Name :  {fetchDone ? <span> {user.userName}</span> : <span className="placeholder-glow"><span className="placeholder col-12"></span> </span>}
                </h5>
                <button className="btn btn-outline-danger  justify-content-end " data-bs-toggle="modal" data-bs-target="#exampleModal3" data-bs-whatever="@fat"
                ><i className="fa-solid fa-power-off"></i>
                </button>
              </div>
            </div>
          </aside>
        </div>
        <div className="cart-body float-md-left float-lg-right">
          {fetchDone ? (
            data.length == [] || data.includes(null) ? (
              <div className="container-fluid cart-no">
                <br></br>
                <h1>No Items Found in Wishlist !</h1>
                <img
                  className="img-fluid cart-no-img"
                  src="https://img.freepik.com/free-photo/portrait-sad-woman-holding-shopping-bags-bank-card-isolated-blue-background_1258-80590.jpg?w=900&t=st=1661337619~exp=1661338219~hmac=2216603151e8e22d07a13935e4d02c5b9629f1482b776df503c439b83528628f"
                  width="70%"
                />
              </div>
            ) : (
              <div className="container-fluid ">
                <div className="  row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 gap-4 justify-content-center text-center ">
                  {data.map((a) => {
                    return a.map((e) => {
                      return (
                        <div className=" col row " key={e.itemId}>
                          &nbsp;
                          <div className="card" data-aos="fade-up">
                            <div className="card-header row">
                              <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                <Rating times={e.ratingOfItem} />
                              </div>
                              <div className='col-7 justify-content-end text-end'>
                                <button
                                  className="btn  m-2"
                                  onClick={() => {
                                    axios
                                      .delete(
                                        "http://localhost:8083/fav/" +
                                        e.itemName +
                                        "?" +
                                        "userId=" +
                                        localStorage.getItem("currentuser")
                                      )
                                      .then((res) => {
                                        return (
                                          setInfo(res.data),
                                          setShowToast(true),
                                          timeout(),
                                          fetch()
                                        );
                                      })
                                      .catch((error) => {
                                        setError(true);
                                        if (error.response.data === undefined) {
                                          setErrorMessage("Something went wrong");
                                        } else {
                                          setErrorMessage(
                                            error.response.data.message +
                                            " of status = '" +
                                            error.response.data.status +
                                            "'"
                                          );
                                        }
                                      });
                                  }}
                                >
                                  <i className="fa-solid fa-trash text-danger"></i>
                                </button>
                                <button
                                  className="btn "
                                  onClick={() => {
                                    if (

                                      localStorage.getItem("currentuser")
                                    ) {
                                      axios
                                        .post(
                                          "http://localhost:8083/cart/",
                                          {
                                            itemId: e.itemId,
                                            userId:
                                              localStorage.getItem("currentuser"),
                                          },
                                          []
                                        )
                                        .then((res) => {
                                          return (
                                            setInfo(res.data),
                                            setShowToast(true),
                                            timeout()
                                          );
                                        })
                                        .catch((error) => {
                                          setError(true);
                                          if (error.response.data === undefined) {
                                            setErrorMessage(
                                              "Something went wrong"
                                            );
                                          } else {
                                            setErrorMessage(
                                              error.response.data.message +
                                              " of status = '" +
                                              error.response.data.status +
                                              "'"
                                            );
                                          }
                                        });
                                    } else {
                                      setInfo("Login required !");
                                    }
                                  }}
                                >
                                  <i className="fa-solid fa-cart-shopping text-info"></i>{" "}
                                </button>
                              </div>
                            </div>
                            <img
                              src={e.itemImgUrl}
                              className="card-img-top"
                              alt="..."
                            />

                            <div className="card-body">
                              <h6
                                className="card-title text-truncate"
                                id={e.itemName}
                              >
                                {e.itemName}
                              </h6>
                              <p className="card-text text-truncate">
                                {" "}
                                ₹{e.itemPrice}
                              </p>
                            </div>
                            <Link
                              to={"/view/" + e.itemId + "/" + e.itemName}
                              className="btn btn-info"
                              onClick={() => { addIntoInterest(e.itemId) }}
                            >
                              View More...
                            </Link>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
                <br></br>
                &nbsp;
                <div className="card" style={{ height: "10%" }}>
                  <div className="card-footer">
                    <h5>List of products in Wishlist :</h5>
                    {data.map((a) => {
                      return a.map((e) => {
                        total += parseInt(
                          e.itemPrice.replaceAll(",", "")
                        );
                        totalAmount = Intl.NumberFormat("hi-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(total);
                        return (
                          <div key={e.itemId}>
                            <li>
                             {e.itemName} = ₹{e.itemPrice} -&gt;
                              <button
                                className="btn btn-outline-danger m-2"
                                onClick={() => {
                                  setfetchDone(false);
                                  axios
                                    .delete(
                                      "http://localhost:8083/fav/" +
                                      e.itemName +
                                      "?" +
                                      "userId=" +
                                      localStorage.getItem("currentuser")
                                    )
                                    .then((res) => {
                                      return (
                                        setInfo(res.data),
                                        setShowToast(true),
                                        timeout(),
                                        fetch()
                                      );
                                    })
                                    .catch((error) => {
                                      setError(true);
                                      if (error.response.data === undefined) {
                                        setErrorMessage("Something went wrong");
                                      } else {
                                        setErrorMessage(
                                          error.response.data.message +
                                          " of status = '" +
                                          error.response.data.status +
                                          "'"
                                        );
                                      }
                                    });
                                }}
                              >
                                <i className="fa-solid fa-trash "></i>
                              </button>
                              <Link
                                className="btn btn-warning"
                                to={"/purchase"}
                                onClick={() => {
                                  axios
                                    .post(
                                      "http://localhost:8083/purchase/" +
                                      e.itemId +
                                      "?userId=" +
                                      props.user
                                    )
                                    .catch((error) => {
                                      setError(true);
                                      if (error.response.data === undefined) {
                                        setErrorMessage("Something went wrong");
                                      } else {
                                        setErrorMessage(
                                          error.response.data.message +
                                          " of status = '" +
                                          error.response.data.status +
                                          "'"
                                        );
                                      }
                                    });
                                }}
                              >
                                {" "}
                                Buy now
                              </Link>
                            </li>
                            &nbsp;
                          </div>
                        );
                      });
                    })}
                    <br></br>
                  </div>
                  <b className="justify-content-end text-end">
                    {" "}
                    Total products amount =
                    <span className="text-success"> {totalAmount} </span>
                  </b>
                </div>
              </div>
            )
          ) : (
            <div className="container-fluid">
              <div className="  row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 gap-4 justify-content-center text-center ">
                <div className="card" aria-hidden="true">
                  <img src={loadingImg} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title placeholder-glow">
                      <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-7"></span>
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-6"></span>
                      <span className="placeholder col-8"></span>
                    </p>
                    <a className="btn btn-primary disabled placeholder col-6"></a>
                  </div>
                </div>
                <div className="card" aria-hidden="true">
                  <img src={loadingImg} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title placeholder-glow">
                      <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-7"></span>
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-6"></span>
                      <span className="placeholder col-8"></span>
                    </p>
                    <a className="btn btn-primary disabled placeholder col-6"></a>
                  </div>
                </div>
              </div>
            </div>
          )}{" "}
          <br></br>
        </div>
      </div>
      {/* Footer */}

      <Footer />

      {/* scroll Button */}

      <div className="container-fluid">
        <button
          className="btn btn-primary align-text-center scroll-up"
          onClick={() => {
            return (
              (document.documentElement.scrollTop = 0),
              (document.body.scrollTop = 0)
            );
          }}
        >
          <h4>
            <i className="fa-solid fa-angle-up"></i>
          </h4>
        </button>
      </div>

      {/* Popup */}
      {showToast && (
        <div
          className="toast  fade show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body ">
              <p className="text-truncate">{info}</p>
              <div className="mt-2 pt-2">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  data-bs-dismiss="toast"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error pop */}
      {error && (
        <>
          <div
            className="toast fade show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body text-danger text-center">
                <h6>Error !</h6>
                {errorMessage}
                <div className="mt-2 pt-2">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    data-bs-dismiss="toast"
                    onClick={() => {
                      setError(false);
                      setErrorMessage("");
                    }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search bar */}

      <div
        className="modal fade "
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-lg-down modal-dialog-scrollable modal-lg ">
          <div className="modal-content bg-info">
            <div className="modal-header ">
              <h5 className="modal-title text-end" id="exampleModalLabel"></h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-floating mb-3 ">
                  <input
                    type="search"
                    className="form-control"
                    onChange={(e) => {
                      return (
                        (setSearch(e.target.value), setFindvalue(count)),
                        setFind(true)
                      );
                    }}
                    onKeyUp={() => {
                      return setFindvalue(count), setFind(true);
                    }}
                    id="floatingInput"
                    placeholder="Search here..."
                  />
                  <label htmlFor="floatingInput">Search/Name...</label>
                  {!(search != "") ? (
                    ""
                  ) : (
                    <>
                      {find == true ? (
                        <>
                          <p className="container-fluid">
                            <b>Search results :</b>Found {findvalue}{" "}
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </div>
              </form>
              <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-3 gap-4 justify-content-center text-center ">
                {data.map((a) => {
                  if (data.length > 0 && a != null) {
                    return a
                      .filter((val) => {
                        if (search == "") {
                          count = 0;
                          return null;
                        }
                        if (
                          val.itemName
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        ) {
                          return val;
                        }
                      })
                      .map((e) => {
                        count++;
                        return (
                          <div className=" col row " key={e.itemId}>
                            &nbsp;
                            <div className="card " data-aos="fade-up">
                              <div className="card-header row'">
                                <div className='col-5 justify-content-start text-start gap-1 d-flex'>
                                  <Rating times={e.ratingOfItem} />
                                </div>
                                <div className='col-7 justify-content-end text-end'>
                                  <button className="btn m-2" onClick={() => {
                                    setfetchDone(false);
                                    axios.delete("http://localhost:8083/fav/" + e.itemName + "?" + "userEmail=" + localStorage.getItem("currentuser")).then((res) => {
                                      return (
                                        setInfo(res.data), setShowToast(true), timeout(), fetch());
                                    })
                                      .catch((error) => {
                                        setError(true);
                                        if (error.response.data === undefined) {
                                          setErrorMessage("Something went wrong");
                                        } else {
                                          setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                                        }
                                      });
                                  }}>
                                    <i className="fa-solid fa-trash text-danger"></i>
                                  </button>
                                  <button
                                    className="btn "
                                    onClick={() => {
                                      if (
                                        localStorage.getItem("currentuser")
                                      ) {
                                        axios
                                          .post(
                                            "http://localhost:8083/cart/",
                                            {
                                              itemId: e.itemId,
                                              userId:
                                                localStorage.getItem(
                                                  "currentuser"
                                                ),
                                            },
                                            []
                                          )
                                          .then((res) => {
                                            return (
                                              setInfo(res.data),
                                              setShowToast(true),
                                              timeout()
                                            );
                                          })
                                          .catch((error) => {
                                            setError(true);
                                            if (
                                              error.response.data === undefined
                                            ) {
                                              setErrorMessage(
                                                "Something went wrong"
                                              );
                                            } else {
                                              setErrorMessage(
                                                error.response.data.message +
                                                " of status = '" +
                                                error.response.data.status +
                                                "'"
                                              );
                                            }
                                          });
                                      } else {
                                        setInfo("Login required !");
                                      }
                                    }}
                                  >
                                    <i className="fa-solid fa-cart-shopping text-info"></i>{" "}
                                  </button>
                                </div>
                              </div>
                              <img
                                src={e.itemImgUrl}
                                className="card-img-top"
                                alt="..."
                              />
                              <div className="card-body">
                                <h6
                                  className="card-title text-truncate"
                                  id={e.itemName}
                                >
                                  {e.itemName}
                                </h6>
                                <p className="card-text"> ₹{e.itemPrice}</p>
                              </div>
                              <a
                                href={"/view/" + e.itemId + "/" + e.itemName}
                                className="btn btn-info"
                              >
                                View More...
                              </a>
                            </div>
                          </div>
                        );
                      });
                  }
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn=outline-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div >
      </div >
      <ChatBot />

      {/* Logout Popup */}
      <LogOut user={props.user} />

    </div >
  );
}
