import React, { Component } from "react";
import emailjs from "emailjs-com"; // Import EmailJS

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      submitted: false,
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
          this.setState({ submitted: true });
          this.sendEmail(email, data.link); // Pass the email and link directly to sendEmail
        } else {
          alert(data.status);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  }

  sendEmail(email, link) {
    console.log(link);
    const templateParams = {
      user_email: email,
      reset_link: link,
    };

    emailjs
      .send(
        "service_hpvcujb",
        "template_r7aw2c2",
        templateParams,
        "rJ5kPXerBg9bonHix"
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
        },
        (error) => {
          console.error("Error sending email:", error.text);
        }
      );
  }

  render() {
    const { submitted } = this.state;

    return (
      <form
        className="flex flex-col w-full justify-center gap-2 items-center h-[80vh]"
        onSubmit={this.handleSubmit}
      >
        {!submitted ? (
          <div className="w-1/4 shadow-2xl shadow-[#2C6975] p-2 rounded-lg  items-center gap-2 h-1/4 flex flex-col justify-center">
            <h3 className="font-sans font-bold text-4xl">Forgot Password</h3>

            <div className="mb-3 w-full border-b-2 border-[#2C6975]">
              <input
                type="email"
                className="form-control text-center py-2 w-full rounded-lg outline-none"
                placeholder="Enter Email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <div className="d-grid w-full flex justify-end">
              <button
                type="submit"
                className="btn btn-primary bg-[#46666d] text-white p-2 rounded-md hover:bg-[#2C6975]"
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="reset-link w-1/4 shadow-2xl shadow-[#2C6975] p-2 rounded-lg  items-center gap-2 h-1/4 flex flex-col justify-center">
            <p>Your password reset link has been sent to your email.</p>
          </div>
        )}
      </form>
    );
  }
}
