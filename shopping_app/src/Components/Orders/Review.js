import { useEffect, useState } from "react"
import Avatar from "react-avatar-edit";
import axios from "axios";
import Rating from "../Items/Rating/Rating";
import timePeriodCalculator from "./TimePeriodCalculator";
import ShowFullComments from "../View/ShowFullComments";

export default function Review(item) {
    const [images, setImages] = useState([]);

    const [imageUrls, setImageUrls] = useState([]);

    const [showView, setShowView] = useState(false)

    const [comment, setComment] = useState({ commentTitle: "", comment: "" });

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [reviewsOfUserForItem, setReviewsOfUserForItem] = useState([]);

    const [showImagePop, setShowImagePop] = useState(false);

    const [imageUrlForToShow, setImageUrlForToShow] = useState("");

    let listOfImages = [];

    let files = images

    const showImage = () => {
        setShowView(true)
        for (let i = 0; i < files.length; i++) {
            (function (file) {
                var reader = new FileReader();
                reader.onload = (file) => {
                    listOfImages.push(reader.result);
                    setImageUrls(listOfImages)
                }
                reader.readAsDataURL(file)
            })(files[i]);
        }
    }

    const removeElemets = () => {
        for (const img of document.getElementsByClassName("img")) {
            img.remove()
        }
    }

    const setComments = (a) => {
        const { name, value } = a.target
        setComment({ ...comment, [name]: value })
    }

    const addComment = () => {
        if (comment) {
            axios.post("http://localhost:8083/review/", {
                "itemReview": {
                    "itemId": item.itemId,
                    "userId": localStorage.getItem("currentuser"),
                    "commentTitle": comment.commentTitle.trim(),
                    "comment": comment.comment.trim()
                },
                "imageUrls": imageUrls
            }).then(a => {
                getReviewOfItem();
                clearAllFileds()
            }).catch((error) => {
                setError(true);
                if (error.response === undefined) {
                    setErrorMessage("Something went wrong")
                } else {
                    setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
                }
            });
        }
    }

    const clearAllFileds = () => {
        setImageUrls([]);
        setComment({ comment: "", commentTitle: "" });
        showView(false);
        getReviewOfItem();
    }

    const getReviewOfItem = () => {
        axios.get("http://localhost:8083/review/useritemreview/" + item.itemId + "?userId=" + localStorage.getItem("currentuser")).then(a => {
            setReviewsOfUserForItem(a.data)
        }).catch((error) => {
            setError(true);
            if (error.response === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        });
    }

    const deleteReview = (reviewId) => {
        let id = "";
        reviewId.map(a => { id = a })
        axios.delete("http://localhost:8083/review/" + id).then(a => {
            getReviewOfItem()
        }).catch((error) => {
            setError(true);
            if (error.response === undefined) {
                setErrorMessage("Something went wrong")
            } else {
                setErrorMessage(error.response.data.message + " of status = '" + error.response.data.status + "'");
            }
        });
    }

    // const timePeriodCalculator = (date) => {
    //     if (reviewsOfUserForItem && date) {
    //         let returnStatement = "";
    //         let currentDate = new Date();
    //         let setGivenDate = new Date();
    //         let needTosetDate = date.substr(0, 2).trim();
    //         let needTosetMonth = Number(date.substr(3, 2).trim()) - 1;
    //         let needTosetYear = date.substr(6).trim();
    //         setGivenDate.setDate(needTosetDate);
    //         setGivenDate.setMonth(needTosetMonth);
    //         setGivenDate.setFullYear(needTosetYear);
    //         switch (currentDate.getMonth() - setGivenDate.getMonth()) {
    //             case 0:
    //                 if (currentDate.getDay() - setGivenDate.getDay() == 0) {
    //                     returnStatement = "Today"
    //                 } else if (Math.abs(currentDate.getDay() - setGivenDate.getDay()) == 1) {
    //                     returnStatement = "! day ago"
    //                 } else if (Math.abs(currentDate.getDay() - setGivenDate.getDay()) == 2) {
    //                     returnStatement = "2 days ago"
    //                 } else if (Math.abs(currentDate.getDay() - setGivenDate.getDay()) == 3) {
    //                     returnStatement = "3 days ago"
    //                 } else if (Math.abs(currentDate.getDay() - setGivenDate.getDay()) == 4) {
    //                     returnStatement = "4 days ago"
    //                 } else if (Math.abs(currentDate.getDay() - setGivenDate.getDay()) == 5) {
    //                     returnStatement = "5 days ago"
    //                 } else if (Math.abs(currentDate.getDay() - setGivenDate.getDay()) == 6) {
    //                     returnStatement = "6 days ago"
    //                 } else {
    //                     returnStatement = "1 week ago"
    //                 }
    //                 break;
    //             case 1:
    //                 returnStatement = "1 month ago";
    //                 break;
    //             case 2:
    //                 returnStatement = "2 months ago";
    //                 break;
    //             case 3:
    //                 returnStatement = "3 months ago";
    //                 break;
    //             case 4:
    //                 returnStatement = "4 months ago";
    //                 break;
    //             case 4:
    //                 returnStatement = "4 months ago";
    //                 break;
    //             case 5:
    //                 returnStatement = "5 months ago";
    //                 break;
    //             case 6:
    //                 returnStatement = "6 months ago";
    //                 break;
    //             case 7:
    //                 returnStatement = "7 months ago";
    //                 break;
    //             case 8:
    //                 returnStatement = "8 months ago";
    //                 break;
    //             case 9:
    //                 returnStatement = "9 months ago";
    //                 break;
    //             case 10:
    //                 returnStatement = "10 months ago";
    //                 break;
    //             case 11:
    //                 returnStatement = "11 months ago";
    //                 break;
    //             case 12:
    //                 returnStatement = "12 months ago";
    //                 break;
    //             default:
    //                 returnStatement = "1 year ago";
    //                 break;
    //         }
    //         return returnStatement;
    //     }
    // }

    if (listOfImages.length == 0) {
        removeElemets()
    }

    useEffect(() => {
        getReviewOfItem();
    }, [])

    return (
        <div className="container-fluid">
            <div className="container-fluid my-3">
                {reviewsOfUserForItem && <h6>Your Reviews</h6>}
                {reviewsOfUserForItem && reviewsOfUserForItem.map((a, i) => {
                    return (
                        <div className="" key={i}>
                            <span className="d-flex float-end fs-5"><i style={{ cursor: "pointer" }} className="bi bi-trash-fill text-danger" onClick={() => { deleteReview(a.imageDto.map(a => { return (a.reviewId) })) }}></i></span>
                            <div className="container-fluid">
                                <Rating times={a.rating.rating} /><span className="mx-2  fw-bold">{a.commentTitle} : {timePeriodCalculator(a.commentAddedOn)}</span>
                                <p className="my-1 mx-1"><ShowFullComments comment={a.comment} /></p>
                                {(a.imageDto != null || a.imageDto != []) && a.imageDto.map((a, i) => {
                                    return (
                                        <img key={i} src={a.imageUrl} className="mx-2 d-inline-flex justify-content-center" style={{ cursor: "zoom-in" }} width={70} height={100} onClick={() => { setShowImagePop(true); setImageUrlForToShow(a.imageUrl) }} />
                                    )
                                })}
                                <p className="my-2">Customer : {a.user.userName}</p>
                                <p className="my-2">Added on : {a.commentAddedOn} at {a.commentAddedAt} IST </p>
                            </div>
                            <hr></hr>
                        </div>
                    )
                })}
            </div>

            <div className="container">
                <h6>Add review : </h6>
                <div className="container-fluid">
                    <form className="">
                        <div className="input-group mb-3 ">
                            <input type="file" className="form-control bg-secondary text-light" id="itemReviewImages" multiple accept="image/png, image/jpeg" onChange={(a) => { return (setImages(a.target.files), setShowView(false ? true : false), removeElemets()) }} />
                            <button className="btn btn-info" type="button" onClick={showImage} disabled={showView}>View</button>
                            <button className="btn btn-success" type="button">Upload</button>
                        </div>
                        <div id="image" className="justify-content-center d-flex m-3">
                            {imageUrls.map((a, i) => {
                                return (
                                    <img key={i} src={a} className="mx-2 d-inline-flex justify-content-center" width={120} height={150} onClick={() => { setShowImagePop(true); setImageUrlForToShow(a) }} />
                                )
                            })}
                        </div>
                        <div className="form-floating my-3">
                            <input type="text" className="form-control bg-secondary text-light" maxLength={20} placeholder="Give opinion on this product..." name="commentTitle" id="commentTitle" value={comment.commentTitle} onChange={setComments} />
                            <label htmlFor="commentTitle" className="text-light">Add short review of product (20 letters)</label>
                            {comment.commentTitle && <span className={comment.commentTitle.length === 20 ? "text-danger" : "text-light"}>Letters can type upto : {20 - comment.commentTitle.length}</span>}
                        </div>
                        <div className="form-floating">
                            <textarea className="form-control bg-secondary text-light" maxLength={250} value={comment.comment} name="comment" placeholder="Leave a comment here" id="itemComment" style={{ height: "120px", width: "100%" }} onChange={setComments}></textarea>
                            <label htmlFor="itemComment" className="text-light">Describe product here (250 letters)</label>
                            {comment.comment && <span className={comment.comment.length === 250 ? "text-danger" : "text-light"}>Letters can type upto : {250 - comment.comment.length}</span>}
                            <span className="my-3 d-flex justify-content-center">
                                <button className="btn btn-secondary" type="button" disabled={!(showView || comment.commentTitle)} onClick={() => { addComment() }}>Add comment</button>
                            </span>
                        </div>
                    </form>
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

            {showImagePop &&
                <div className="justify-content-center d-inline-flex ">
                    <div className="d-inline-flex position-fixed" style={{ zIndex: "9", top: "10%", left: "30%" }}>
                        <img src={imageUrlForToShow} height={550} style={{ boxShadow: " rgba(0, 0, 0, 0.5) 100px 220px 700px 3000px" }} />
                        <span className="float-end mx-2 fs-4"><i className="bi bi-x-circle-fill"
                            onClick={() => { setShowImagePop(false); setImageUrlForToShow("") }} style={{ cursor: "pointer" }}></i>
                        </span>
                    </div>
                </div>}
        </div >
    )
}

