import { useEffect, useState } from "react";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"
import axios from "axios"

export default function LogOut(props) {

    const [user, setUser] = useState([]);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [updateDone, setUpdateDone] = useState(false);

    const fetchUser = () => {
        axios.get("http://localhost:8083/user/userid/" + props.user).then(a => {
            return (setUser(a.data))
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    const updateUserAsLogin = (status) => {
        axios.put("http://localhost:8083/user/", {
            "userEmail": user.userEmail,
            "userName": user.userName,
            "userId": user.userId,
            "mobileNumber": user.mobileNumber,
            "profileImgUrl": user.profileImgUrl,
            "loggedIn": status,
            "admin": user.admin
        }, []).then(a => {
            return (setUpdateDone(true), localStorage.removeItem("currentuser"), window.location.reload())
        }).catch((error) => {
            setError(true);
            if (error.response.data === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        })
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
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
                                updateUserAsLogin(false);
                            }}
                        >Yes</button>
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

        </div >
    )
}