import React, { useState } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./../styles/Signup.css";

function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        firstname,
        lastname,
        email,
        password,
        repeatPassword,
      });

      if (response.status === 201) {
        alert("Account created successfully");

        // Clear input fields after successful signup
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");

        // Navigate to login page
        history.push("/login");
      } else {
        setError("Failed to create account");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    history.push("/LandingPage");
  };

  return (
    <form onSubmit={handleSubmit}>
      <ArrowBackIcon onClick={handleBackClick} style={{ cursor: "pointer" }} />
      <input
        type="text"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        placeholder="Repeat Password"
        required
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">{loading ? "Signing up..." : "Signup"}</button>
    </form>
  );
}

export default Signup;
