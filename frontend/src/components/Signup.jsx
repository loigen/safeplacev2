import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import "./../styles/Signup.css";
import logo from "../images/bannerLogo.png";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sex, setSex] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [agreement, setAgreement] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (
      firstname.trim() &&
      lastname.trim() &&
      email.trim() &&
      password.trim() &&
      repeatPassword.trim() &&
      birthdate.trim() &&
      sex &&
      agreement
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [
    firstname,
    lastname,
    email,
    password,
    repeatPassword,
    birthdate,
    sex,
    agreement,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        firstname,
        lastname,
        email,
        password,
        repeatPassword,
        birthdate,
        sex,
      });

      if (response.status === 201) {
        Swal.fire("Success", "Account created successfully", "success");

        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        setBirthdate("");
        setSex("");

        history.push("/login");
      } else {
        Swal.fire("Error", "Failed to create account", "error");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        Swal.fire("Error", error.response.data.error, "error");
      } else {
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    history.push("/");
  };

  return (
    <div className="containerSignup">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="cardSignup">
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
        <br />
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="inputFields">
              <div className="flex flex-row justify-between">
                <div>
                  <label htmlFor="firstname">
                    <span>
                      <PersonOutlineIcon />
                    </span>
                    First Name:
                  </label>
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastname">
                    <span>
                      <PersonOutlineIcon />
                    </span>
                    Last Name:
                  </label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
              <label htmlFor="email">
                <span>
                  <ContactMailIcon />
                </span>
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
              <label htmlFor="birthdate">
                <span>
                  <PersonOutlineIcon />
                </span>
                Birthdate:
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                placeholder="Birthdate"
                required
              />
              <label htmlFor="sex">
                <span>
                  <PersonOutlineIcon />
                </span>
                Gender:
              </label>
              <div className="radioGroup flex gap-2">
                <label>
                  <input
                    type="radio"
                    value="Male"
                    checked={sex === "Male"}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="Female"
                    checked={sex === "Female"}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  Female
                </label>
              </div>
              <label htmlFor="password">
                <span>
                  <LockOpenIcon />
                </span>
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <label htmlFor="repeatPassword">
                <span>
                  <LockOpenIcon />
                </span>
                Repeat Password:
              </label>
              <input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Repeat Password"
                required
              />
            </div>

            <div className="agreement">
              <p>
                The Safe Place platform may keep me informed with personalized
                emails about services and activities. See our Privacy Policy for
                more details or to opt-out at any time.
              </p>
              <div className="checkbox">
                <input
                  type="checkbox"
                  name="agree"
                  id="agree"
                  checked={agreement}
                  onChange={() => setAgreement(!agreement)}
                />
                <span>Please contact me via email</span>
              </div>
              <p>
                By clicking Create account, I agree that I have read and
                accepted the Terms of Use and Privacy Policy.
              </p>
            </div>
            <div className="bottompart w-full">
              <div></div>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={isButtonDisabled ? "disabled" : ""}
              >
                {loading ? "Signing up..." : "Create Account"}
              </button>
            </div>
            <div className="forSignup">
              <p>Already have an account? </p>
              <Link className="login" to="/login">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
