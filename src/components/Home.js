import React from "react";
import Header from "./Header";
import svg from "../assets/about-us.svg"
import "./Header.css"
const Home = () => {
  return (
    <>
      <Header />
      <div className="home-main">
      <img className="monetize-img" src={svg} alt="About Us" />
      </div>
    </>
  );
};

export default Home;
