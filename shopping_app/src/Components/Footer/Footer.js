import React from 'react'
import "../Footer/Foot.css";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"

export default function Footer() {
    return (
        <footer >
            <div className='container-fluid'>
                <div className="card" style={{ backgroundColor: "#0099ff", borderRadius: "0px", height: "auto" }}>
                    <div className="card-body  text-center" >
                        <h2 className="card-title">
                        <img src={img} alt="Img not found" width="40" height="40" className="img-fluid d-inline-block align-text-top" /> Shopping Mart  
                        </h2><br></br>
                        <p className="card-text " style={{ fontWeight: "900", fontSize: "200%", textDecoration: "none", letterSpacing: "15px" }}>
                            <a href="https://www.facebook.com/profile.php?id=100009449169869" ><i className="fa-brands fa-facebook text-light"></i></a>
                            <a href="https://www.instagram.com/raghavendra_machani/"><i className="fa-brands fa-instagram text-light "></i></a>
                            <a href="https://www.linkedin.com/in/raghavendra-machani-027b57214"><i className="fa-brands fa-linkedin text-light"></i>
                            </a>
                        </p>
                        <p>@2023-All rights reserved</p>
                    </div>
                    <div className='text-end'>
                        <h6>Created By RAGHU</h6>
                    </div>
                </div>
            </div><br></br>
        </footer>
    )
}
