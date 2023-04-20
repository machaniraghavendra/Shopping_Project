import React from 'react'
import "../Error/Error.css";
import img from "../imgbin_shopping-bag-shopping-cart-computer-icons-png.png"

export default function ErrorPage() {

  return (
    <div className='justify-content-center text-center text-light error '>
        <div className='position-relative errormsge' >
          <h1 className="" >
            <img src={img} alt="" width="50" height="50" className="d-inline-block align-text-top" />
            &nbsp;Shopping Mart
          </h1>
          <h2 className=' justify-content-center' > ☹️| Page not found ! - 404 |☹️</h2>
          <a className='btn btn-outline-light ' onClick={() => { return (window.history.go(-1)) }}> Click here to go back</a><br></br><br></br>
          <a href='/login' className='btn btn-outline-success text-light'>Click here to move to Login page</a>
        </div>
    </div>
  )
}
