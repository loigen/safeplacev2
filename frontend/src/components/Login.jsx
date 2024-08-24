import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/login.css";
import logo from "../images/bigLogo.png";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (email.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const handleBackClick = () => {
    history.push("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      const userRole = response.data.role;

      if (userRole === "user") {
        history.push("/booking");
      } else {
        history.push("/home");
      }
    } catch (error) {
      setError("Invalid credentials, Please try again!");
      setEmail("");
      setPassword("");
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="containerLogin">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="cardLogin">
        <div className="back">
          <ArrowBackIcon
            onClick={handleBackClick}
            style={{
              cursor: "pointer",
              width: "10%",
              fontSize: "1.5rem",
              color: "#2C6975",
            }}
          />
          <div className="subtitle">
            <h1>Welcome to Safe Place</h1>
            <p>Please take a moment to complete your account</p>
          </div>
        </div>
        <div className="form">
          <form onSubmit={handleLogin}>
            <label htmlFor="email">
              <span>
                <ContactMailIcon />
              </span>
              Email Address:
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
            <div className="forgotpass">
              <label htmlFor="password">
                <span>
                  <LockOpenIcon />
                </span>
                Password:
              </label>
              <p>Forgot Password?</p>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
            {error && <p className="errorMessage">{error}</p>}
            <div className="bottompart">
              <div className="forgotpass">
                <input type="checkbox" /> <span>Remember password</span>
              </div>
            </div>
            <div className="buttonSubmit">
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={isButtonDisabled ? "disabled" : ""}
              >
                Login
              </button>
            </div>
            <div className="forSignup">
              <p>Don{"'"}t have an account? </p>
              <Link className="signup" to="/signup">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
