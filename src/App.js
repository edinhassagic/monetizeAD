import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import MainRouter from "./MainRouter";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
