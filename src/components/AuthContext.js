import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    // Retrieve user information from local storage on initial load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to set the user after successful login
  const loginUser = ({ jwt, username, id }) => {
    setLoggedInUser({ jwt, username, id });
    // Store user information in local storage
    localStorage.setItem("user", JSON.stringify({ jwt, username, id }));
  };

  // Function to log out the user
  const logoutUser = () => {
    setLoggedInUser(null);
    // Remove user information from local storage on logout
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
