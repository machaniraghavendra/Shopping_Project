import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Footer from './Components/Footer/Footer';
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import MainPage from './Components/MainPage/Mainpage';
import Mobiles from './Components/Mobiles/Mobiles';
import Shirts from './Components/Shirts/Shirts';
import Sports from './Components/Sports/Sports';
import Trending from './Components/Trending/Trending';
import MainpageAfterLog from "./Components/MainPage/MainnpageAfterLogin"
import ErrorPage from "./Components/Error/ErrorPage";
import Cartpage from "./Components/Cart/Cartpage";
import Wishlist from "./Components/WishList/Wishlist";
import ForgotPass from "./Components/Login/ForgotPass";
import MobileLog from "./Components/Mobiles/MobileLog";
import View from "./Components/View/View";
import { useState } from "react";
import axios from "axios";
import Settings from "./Components/Settings/Settings";
import Buypage from "./Components/PurchasePage/BuyPage";
import Orders from "./Components/Orders/Orders";
import OrderDetails from "./Components/Orders/OrderDetails";

function App() {
  let user = localStorage.getItem("currentuser");

  const [userPresent, setUserPresent] = useState(false);

  const currentuser = () => {
    axios.get("http://localhost:8083/user/id/" + user).then(() => {
      return (setUserPresent(true))
    }).catch(() => { setUserPresent(false) })
  }

  currentuser();

  if (localStorage.getItem("Raghu") && localStorage.getItem("currentuser") && userPresent) {

    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={<Login user={user} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<Cartpage user={user} />} />
            <Route path="/wishlist" element={<Wishlist user={user} />} />
            <Route path="/login/forgot/password" element={<ForgotPass user={user} />} />
            <Route path="/view/*" element={<View user={user} />} />
            <Route path="/purchase" element={<Buypage user={user} />} />
            <Route path="/profile/settings" element={<Settings user={user} />} />
            <Route path="/orders" element={<Orders user={user} />} />
            <Route path="/orderdetails" element={<OrderDetails user={user} />} />
            <Route path="/mart" element={
              <>
                <MainpageAfterLog user={user} />
                <Trending />
                <MobileLog />
                <Sports />
                <Shirts />
                <Footer />
              </>
            } />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </div>
    )
  }
  else {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login/forgot/password" element={<ForgotPass user={user} />} />
          <Route path="/mart" element={<MainpageAfterLog user={user} />} />
          <Route path="/" element={
            <>
              <MainPage />
              <Trending />
              <Mobiles />
              <Sports />
              <Shirts />
              <Footer />
            </>
          } />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Router>
    )
  }
}
export default App;
