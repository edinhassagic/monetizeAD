import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.js";
import { jwtDecode } from "jwt-decode";
import Header from "./Header.js";
import "./Registration.css";
const Registration = () => {
  const navigate = useNavigate();
  const { loginUser, loggedInUser } = useAuth();

  if (loggedInUser) {
    navigate("/");
  }

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    subscribeToNewsLetter: false,
    gender: "male",
    status: "active",
    yearOfBirth: 1990,
  });

  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = name === "yearOfBirth" ? parseInt(value, 10) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : inputValue,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://junior-test.mntzdevs.com/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Registration successful, log in the user automatically
        const loginResponse = await fetch(
          "https://junior-test.mntzdevs.com/api/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          }
        );

        if (loginResponse.ok) {
          const { jwt } = await loginResponse.json();
          const decodedToken = jwtDecode(jwt);

          loginUser({
            jwt,
            id: decodedToken.id,
            username: decodedToken.username,
          });

          localStorage.setItem("jwt", jwt);
          navigate("/");
        } else {
          const loginErrorData = await loginResponse.json();
          setRegistrationStatus(
            `Login after registration failed: ${loginErrorData.message}`
          );
        }
      } else {
        const errorData = await response.json();
        setRegistrationStatus(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      setRegistrationStatus("Error during registration");
    }
  };

  return (
    <div>
      <Header />
      <div className="register-main">
        <h2>Registration</h2>
        <form onSubmit={handleRegistration}>
          <label>
            Username:
            <input
              style={{ width: "100%" }}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Password:
            <input
              style={{ width: "100%" }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Repeat Password:
            <input
              style={{ width: "100%" }}
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Subscribe to Newsletter:
            <input
              type="checkbox"
              name="subscribeToNewsLetter"
              checked={formData.subscribeToNewsLetter}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Gender:
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleInputChange}
                />
                Male
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleInputChange}
                />
                Female
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleInputChange}
                />
                Other
              </label>
            </div>
          </label>

          <label>
            Status:
            <select
              style={{ width: "100%" }}
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label>
            Year of Birth:
            <input
              style={{ width: "100%" }}
              type="number"
              name="yearOfBirth"
              value={formData.yearOfBirth}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="submit">Register</button>
        </form>
        {registrationStatus && (
          <p style={{ color: "red" }}>{registrationStatus}</p>
        )}
      </div>
    </div>
  );
};

export default Registration;
