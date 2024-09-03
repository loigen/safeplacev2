import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import "./../styles/Signup.css";
import logo from "../images/bannerLogo.png";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axiosInstance from "../config/axiosConfig";

function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sex, setSex] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [agreement, setAgreement] = useState(false);
  const [step, setStep] = useState(1);

  const history = useHistory();

  useEffect(() => {
    if (step === 1) {
      if (
        firstname.trim() &&
        lastname.trim() &&
        middleName.trim() &&
        birthdate.trim() &&
        sex
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    } else if (step === 2) {
      if (
        email.trim() &&
        password.trim() &&
        repeatPassword.trim() &&
        agreement
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }
  }, [
    step,
    firstname,
    lastname,
    middleName,
    birthdate,
    sex,
    email,
    password,
    repeatPassword,
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
      const response = await axiosInstance.post(
        "http://localhost:5000/auth/signup",
        {
          firstname,
          lastname,
          middleName,
          email,
          password,
          repeatPassword,
          birthdate,
          sex,
        }
      );

      if (response.status === 201) {
        Swal.fire("Success", "Account created successfully", "success");

        setFirstname("");
        setLastname("");
        setMiddleName("");
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

  const handleNext = () => {
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
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
            {step === 1 && (
              <div className="inputFields">
                <div className="flex flex-col">
                  <div>
                    <label htmlFor="firstname">
                      <span></span>
                      First Name:
                    </label>
                    <input
                      className="capitalize"
                      type="text"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="middleName">
                      <span></span>
                      Middle Name:
                    </label>
                    <input
                      className="capitalize"
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Middle Name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastname">
                      <span></span>
                      Last Name:
                    </label>
                    <input
                      className="capitalize"
                      type="text"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                <label htmlFor="birthdate">
                  <span></span>
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
                  <span></span>
                  Sex:
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
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isButtonDisabled}
                  className={`px-6 py-2 rounded-md text-white font-semibold transition duration-300 ${
                    isButtonDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="inputFields">
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
                <div className="agreement">
                  <p>
                    The Safe Place platform may keep me informed with
                    personalized emails about services and activities. See our
                    Privacy Policy for more details or to opt-out at any time.
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
                  <button type="button" onClick={handlePrev}>
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={isButtonDisabled ? "disabled" : ""}
                  >
                    {loading ? "Signing up..." : "Create Account"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
