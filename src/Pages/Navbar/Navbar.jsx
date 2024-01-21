import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { saveadmin, logout } from "../../features/Admin";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./logo.png";
import {
  faBars,
  faCancel,
  faCartShopping,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [menu, setmenu] = useState(false);
  const user = useSelector((state) => state.admin.admin);

  const logoutf = async () => {
    dispatch(logout());
    localStorage.clear();
    window.location.href = "/";
  };

  const isSignupOrLogin =
    location.pathname === "/" ||
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/instructor-dashboard" 

  const menuf = () => {
    setmenu(!menu);
  };

  const isActiveTab = (path) => {
    const parts = path.split("/");
    const result = "/" + parts[1];
    const currentpath = location.pathname.split("/");
    const currentpathresult = "/" + currentpath[1];
    return currentpathresult === result;
  };
  const mobilenavf = (link) => {
    console.log(link);
    navigate(`${link}`);
    setmenu(!menu);
  };

  return isSignupOrLogin ? (
    ""
  ) : (
    <nav
      id="navbar"
      className="fixed top-0 left-0 w-screen flex justify-between items-center py-12 px-12 lg:px-8 z-50 md:px-6"
    >
      {menu ? (
        <div className="hidden md:block">
          <div
            className="fixed w-screen h-screen top-0 left-0 z-30"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.353)" }}
            onClick={menuf}
          ></div>
          <div
            className="flex flex-col w-3/4 h-screen fixed right-0 top-0 justify-center items-center z-50 gap-8 bg-white navbar-mobile-menu"
            style={{ backgroundColor: "white" }}
          >
            <ul className="list-none flex flex-col gap-10 items-center justify-center">
              <li onClick={menuf} className="navbar-mobile-menu-item">
                <Link
                  to="/"
                  className={`${
                    isActiveTab("/") ? "text-blue" : "text-gray2"
                  } hover:text-blue`}
                >
                  Home
                </Link>
              </li>
              <li onClick={menuf} className="navbar-mobile-menu-item">
                <Link
                  to="/about"
                  className={`${
                    isActiveTab("/about") ? "text-navyblue" : "text-gray2"
                  } hover:text-navyblue`}
                >
                  About
                </Link>
              </li>

              <li
                className="cursor-pointer navbar-mobile-menu-item"
                onClick={menuf}
              >
                <Link
                  to="/NBFC"
                  className={`${
                    isActiveTab("/NBFC") ? "text-navyblue" : "text-gray2"
                  } hover:text-navyblue`}
                >
                  NBFC Consulting
                </Link>
              </li>
            </ul>

            {!user.token ? (
              <>
                <Link to="/signup" onClick={menuf}>
                  <button className="bg-bluepurple border-1 border-solid border-bluepurple text-white rounded flex items-center px-12 py-3 navbar-mobile-menu-item">
                    Signup
                  </button>
                </Link>

                <Link to="/login" onClick={menuf}>
                  <button className="bg-navyblue border-1 border-solid border-navyblue text-white rounded flex items-center px-12 py-3 navbar-mobile-menu-item">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <button
                className="bg-bluepurple border-1 border-solid border-bluepurple text-white rounded flex items-center px-12 py-3 navbar-mobile-menu-item"
                onClick={logoutf}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      <ul
        className="flex items-center list-none md:hidden text-gray"
        style={{ gap: "2.5vw" }}
      >
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="w-28 navbar-pc-animation-item"
          />
        </Link>
        <li className="hover:text-navyblue navbar-pc-animation-item">
          <Link
            to="/"
            className={isActiveTab("/") ? "text-navyblue" : "text-gray2"}
          >
            Home
          </Link>
        </li>
        <li className="hover:text-navyblue cursor-pointer navbar-pc-animation-item">
          <Link
            to="/about"
            className={`${
              isActiveTab("/about") ? "text-navyblue" : "text-gray2"
            } hover:text-navyblue`}
          >
            About
          </Link>
        </li>

        <li className="cursor-pointer navbar-pc-animation-item">
          <Link
            to="/NBFC"
            className={`${
              isActiveTab("/NBFC") ? "text-navyblue" : "text-gray2"
            } hover:text-navyblue`}
          >
            NBFC Consulting
          </Link>
        </li>
      </ul>
      {!user.token ? (
        <div className="flex gap-8 md:hidden">
          <Link to="/signup">
            <button className="rounded flex items-center px-12 py-3 navbar-pc-animation-item hover-animated-button bg-bluepurple border-2 border-solid border-bluepurple">
              Signup
            </button>
          </Link>

          <Link to="/login" className="md:hidden">
            <button className=" rounded flex items-center px-12 py-3 navbar-pc-animation-item hover-animated-button bg-navyblue border-2 border-solid border-navyblue">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <button
          className="bg-bluepurple border-1 border-solid border-bluepurple text-white rounded flex items-center px-12 py-3 md:hidden navbar-pc-animation-item hover-animated-button"
          onClick={logoutf}
        >
          Logout
        </button>
      )}

      <div className="hidden w-screen md:flex justify-between md:items-center">
        <Link to="/">
          <img src={logo} alt="logo" className="w-20" />
        </Link>
        {menu ? (
          <FontAwesomeIcon
            icon={faClose}
            onClick={menuf}
            className="cursor-pointer text-2xl cancel-icon fixed top-10 right-6 z-50"
          />
        ) : (
          <FontAwesomeIcon
            icon={faBars}
            onClick={menuf}
            className="cursor-pointer text-2xl"
          />
        )}
      </div>
    </nav>
  );
}
