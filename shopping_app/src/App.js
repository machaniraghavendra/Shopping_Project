import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Footer from './Components/Footer/Footer';
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import MainPage from './Components/MainPage/Mainpage';
import Mobiles from './Components/Items/Mobiles/Mobiles';
import Shirts from './Components/Items/Shirts/Shirts';
import Sports from './Components/Items/Sports/Sports';
import Trending from './Components/Trending/Trending';
import MainpageAfterLog from "./Components/MainPage/MainnpageAfterLogin"
import ErrorPage from "./Components/Error/ErrorPage";
import Cartpage from "./Components/Cart/Cartpage";
import Wishlist from "./Components/WishList/Wishlist";
import ForgotPass from "./Components/Login/ForgotPass";
import MobileLog from "./Components/Items/Mobiles/MobileLog";
import View from "./Components/View/View";
import { useEffect, useState } from "react";
import axios from "axios";
import Settings from "./Components/Settings/Settings";
import Buypage from "./Components/PurchasePage/BuyPage";
import Orders from "./Components/Orders/Orders";
import OrderDetails from "./Components/Orders/OrderDetails";
import LoadingPage from "./Components/Error/LoadingPage";
import SmartWatches from "./Components/Items/SmartWatches/SmartWatches";
import Watches from "./Components/Items/Watches/watches";
import Cameras from "./Components/Items/Cameras/Cameras";
import MusicalInstruments from "./Components/Items/MusicalItems/MusicalItems";
import Books from "./Components/Items/Books/Books";
import TV from "./Components/Items/TV/Tv";
import Headfones from "./Components/Items/Headfones/Headfones";
import ViewMoreItems from "./Components/View/ViewMoreItems";
import UsersList from "./Components/AdminPages/UsersList";
import ItemsList from "./Components/AdminPages/ItemsList";
import UpdateItem from "./Components/AdminPages/UpdateItem";
import AllReviewOfItem from "./Components/View/AllReviewOfItem";

function App() {
  let user = localStorage.getItem("currentuser");

  const [currentUser, setcurrentUser] = useState([]);

  const [userPresent, setUserPresent] = useState(false);

  const [fetchUserDone, setfetchUserDone] = useState(false);

  const [isDarkModeInSystem, setIsDarkModeInSystem] = useState(false);

  const currentuser = () => {
    if (user) {
      axios.get("http://localhost:8083/user/userid/" + user).then(res => {
        if (res.status == "200") {
          setfetchUserDone(true);
          setcurrentUser(res.data);
          setUserPresent(true);
        }
      }).catch(a => { localStorage.removeItem("currentuser") })
    } else {
      setfetchUserDone(true);
      setUserPresent(false);
    }
  }

  const getTheme = (mode) => {
    sessionStorage.setItem("dark", mode);
  }
  
  const checkSystemTheme = () => {
    if (window.matchMedia) {
      if (localStorage.getItem("customMode") == "true" ? false : true) {
        setIsDarkModeInSystem(window.matchMedia('(prefers-color-scheme: dark)').matches);
        getTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }
  }

  useEffect(() => {
    currentuser(); checkSystemTheme()
  }, [])

  if (fetchUserDone) {
    if (localStorage.getItem("currentuser") && userPresent) {
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
              <Route path="/view/review" element={<AllReviewOfItem user={user} />} />
              <Route path="/purchase" element={<Buypage user={user} />} />
              <Route path="/profile/settings" element={<Settings user={user} />} />
              <Route path="/orders" element={<Orders user={user} />} />
              <Route path="/orderdetails" element={<OrderDetails user={user} />} />
              <Route path="/viewmore/*" element={<ViewMoreItems user={user} />} />
              <Route path="/admin/userslist" element={<UsersList user={user} />} />
              <Route path="/admin/itemslist" element={<ItemsList user={user} />} />
              <Route path="/admin/updateitem/*" element={<UpdateItem user={user} />} />
              <Route path="/mart" element={
                <>
                  <MainpageAfterLog user={user} />
                  <Trending />
                  <MobileLog />
                  <Sports />
                  <Shirts />
                  <SmartWatches />
                  <Watches />
                  <Cameras />
                  <MusicalInstruments />
                  <Books />
                  <TV />
                  <Headfones />
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
  } else {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<LoadingPage />} />
        </Routes>
      </Router>
    )
  }
}
export default App;
