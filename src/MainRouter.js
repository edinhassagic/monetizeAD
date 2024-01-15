import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Registration from "./components/Registration";
import Login from "./components/Login";
import ProductList from "./components/ProductList";

function MainRouter() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/product-list" element={<ProductList />} />
    </Routes>
  );
}

export default MainRouter;
