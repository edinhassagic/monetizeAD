import React, { useState } from "react";
import { useAuth } from "./AuthContext.js";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./Header.js";
import "./Login.css";

const Login = () => {
  const { loginUser, loggedInUser } = useAuth(); // Check if the user is already logged in
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  if (loggedInUser) {
    navigate("/");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://junior-test.mntzdevs.com/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const { jwt } = await response.json();

        // Use jwt-decode to extract user information from the JWT token
        const decodedToken = jwtDecode(jwt);

        // Use the loginUser function from useAuth to set the logged-in user
        loginUser({
          jwt,
          id: decodedToken.id,
          username: decodedToken.username,
        });

        // Save JWT token in localStorage
        localStorage.setItem("jwt", jwt);

        setResponseMessage("Login successful!");

        navigate("/");
      } else if (response.status === 401) {
        setResponseMessage("Invalid username or password.");
      } else {
        const errorData = await response.json();
        setResponseMessage(`Server error: ${errorData.message}`);
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <Header />
      <div className="login-main">
        <h2>Login</h2>
        <form>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
        {responseMessage && (
          <p
            style={{
              color: responseMessage.includes("successful") ? "green" : "red",
            }}
          >
            {responseMessage}
          </p>
        )}
        <p>
          Don't have an account? <Link to="/registration">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
