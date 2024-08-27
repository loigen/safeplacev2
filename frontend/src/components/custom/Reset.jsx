import React, { Component } from "react";

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      submitted: false,
      link: "", // Add link state property
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email } = this.state;

    fetch("http://localhost:5000/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          this.setState({
            submitted: true,
            link: data.link, // Set the link received from the backend
          });
        } else {
          alert(data.status);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  }

  render() {
    const { submitted, link } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Forgot Password</h3>
        {!submitted ? (
          <>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="reset-link">
            <p>Your password reset link is ready:</p>
            <a href={link} target="_blank" rel="noopener noreferrer">
              Reset Password
            </a>
            <p className="forgot-password text-right">
              <a href="/signup">Signup</a>
            </p>
          </div>
        )}
      </form>
    );
  }
}
