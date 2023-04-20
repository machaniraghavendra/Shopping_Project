import React from 'react'
import "../Trending/Trend.css";

export default function Trending() {
    return (
        <div className='container-fluid'>
            <h2 id='trending'  className='dark'>Trending <i className="bi bi-stars"></i></h2>
            <div id="carouselExampleIndicators" data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" className="carousel slide" data-bs-ride="true">
                <div className="carousel-inner text-center ">
                    <div className="carousel-item active" data-bs-interval="4000">
                        <div className="row row-cols-1 row-cols-md-3 g-4" >
                            <div className="col">
                                <div className="card">
                                    <img src="https://m.media-amazon.com/images/I/619n6kxuGsL._SX679_.jpg" className="card-img-top " alt="Image not found" />
                                    <div className="card-body">
                                        <h5 className="card-title">OnePlus Nord CE 2 5G (Gray Mirror, 8GB RAM, 128GB Storage)</h5>
                                        <p className="card-text">₹24,999.00</p>
                                        <p>Size : <b>6GB RAM+128GB Storage</b></p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3 '>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card" >
                                    <img src="https://images-eu.ssl-images-amazon.com/images/I/41ucScT1aWL._SX300_SY300_QL70_FMwebp_.jpg" className="card-img-top " alt="Image Not Found" />
                                    <div className="card-body">
                                        <h5 className="card-title">Realme Narzo 50 Pro 5G (Hyper Blue 6GB RAM+128GB Storage) Dimensity 920 5G Processor |48MP Ultra HD Camera, Medium</h5>
                                        <p className="card-text">₹21,999.00</p>
                                        <p>Size : <b>6GB RAM+128GB Storage</b></p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card ">
                                    <img src="https://www.reliancedigital.in/medias/Realme-RMX3491-GSMHANDSETSANDROID-492575026-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wxMDMxMTh8aW1hZ2UvanBlZ3xpbWFnZXMvaGMzL2g0YS85ODE1ODE5MDI2NDYyLmpwZ3wzM2I5Y2E2ZWI1MDRkZGY3ZTg3ZDIwMmJmNjUyMWQ4ZjYyN2Q4ZDNjOGU1YTc2MGMyZGZmMDM5MWJlZGRkYzI2" className="card-img-top" alt="Image Not Found" />
                                    <div className="card-body">
                                        <h5 className="card-title">Realme 9i 6 GB RAM, 128 GB, Prism Blue, Mobile Phone</h5>
                                        <p className="card-text">₹15,999.00</p>
                                        <p>Size : <b>6GB RAM+128GB Storage</b></p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="4000">
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            <div className="col">
                                <div className="card">
                                    <img src="https://images.samsung.com/is/image/samsung/p6pim/in/2108/gallery/in-galaxy-buds2-r177-sm-r177nlvainu-481740552?$684_547_PNG$" className="card-img-top" alt="Image not found" />
                                    <div className="card-body">
                                        <h5 className="card-title">Galaxy Buds2</h5>
                                        <p className="card-text">₹11999.00</p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <img src="https://d2d22nphq0yz8t.cloudfront.net/88e6cc4b-eaa1-4053-af65-563d88ba8b26/https://media.croma.com/image/upload/v1651039637/Croma%20Assets/Entertainment/Headphones%20and%20Earphones/Images/252109_qojkbv.png/mxw_2048,f_auto" className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">Boat Rockerz 255 Pro In-Ear Wireless Earphone with Mic (Voice Assistant, Active Black)</h5>
                                        <p className="card-text">₹929.00</p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <img src="https://cdn.shopify.com/s/files/1/0057/8938/4802/products/3_4_600x.png?v=1655534211" className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">Rockerz 450 DC edition</h5>
                                        <p className="card-text">₹1,499</p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="4000">
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            <div className="col">
                                <div className="card">
                                    <img src="https://images.samsung.com/is/image/samsung/p6pim/in/ua58aue70aklxl/gallery/in-uhd-4k-tv-ua58aue70aklxl-front--gray-436266849?$684_547_PNG$" className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">1m 46cm (58") AUE70 Crystal 4K UHD Smart TV</h5>
                                        <p className="card-text">₹54490.00</p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <img src="https://d2d22nphq0yz8t.cloudfront.net/88e6cc4b-eaa1-4053-af65-563d88ba8b26/https://media.croma.com/image/upload/v1633329208/Croma%20Assets/Entertainment/Television/Images/244467_hqjovo.png/mxw_2048,f_auto" className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">OnePlus Y Series 100cm (40 Inch) Full HD LED Android Smart TV (OxygenPlay, 40FA1A00, Black)</h5>
                                        <p className="card-text">₹21,999.00</p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <img src="https://d2d22nphq0yz8t.cloudfront.net/88e6cc4b-eaa1-4053-af65-563d88ba8b26/https://media.croma.com/image/upload/v1630563911/Croma%20Assets/Entertainment/Television/Images/242860_dz1zzx.png/mxw_2048,f_auto" className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">Xiaomi Mi TV 5X 108cm (43 Inch) Ultra HD 4K LED Android Smart TV (Google and Alexa Supported, L43M6-ES, Metallic Grey)</h5>
                                        <p className="card-text">₹31,999.00</p>
                                        <a href='/login' className='btn btn-info '>View More...</a>
                                        <a href='/login' className='btn btn-outline-info m-3'>Add to Cart</a>
                                        <a href='/login' className='btn btn-outline-info '>Add to Wishlist</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><br></br>
                <div className='button-card'>
                    <button className=" btn" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="btn" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <hr />
        </div>
    )
}
