import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import adlogo from "../assets/Monetizead-logo.png"
import "./Header.css";

const Header = () => {
  const { loggedInUser, logoutUser } = useAuth();
  const [isMobileNavVisible, setMobileNavVisible] = useState(false);
  const navigate = useNavigate();

  const decodedToken = loggedInUser ? jwtDecode(loggedInUser.jwt) : null;
  const userId = decodedToken ? decodedToken.id : null;
  const username = decodedToken ? decodedToken.username : null;

  const toggleMobileNav = () => {
    setMobileNavVisible(!isMobileNavVisible);
  };

  const handleProductListClick = () => {
    if (loggedInUser) {
      navigate("/product-list");
    } else {
      navigate("/login");
    }
  };

  const handleLogoutClick = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={adlogo} alt="monetize-logo" />
        </Link>
      </div>
      <div className="nav">
        <div className="mobile-nav-toggle" onClick={toggleMobileNav}>
          ☰
        </div>
        <div className={`desktop-nav ${isMobileNavVisible ? 'mobile-visible' : ''}`}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <button onClick={handleProductListClick}>Product List</button>
            </li>
            {loggedInUser ? (
              <>
               
                <li>
                  <button onClick={handleLogoutClick}>Logout</button>
                </li>
                <li>
                  <p>{`${username} - ID: ${userId}`}</p>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
