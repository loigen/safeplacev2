import React, { useState } from "react";
import Navbar from "./custom/Navbar";
import "../styles/landingpage.css";
import clock from "../images/ph_clock-thin.png";
import exp from "../images/experience.png";
import hq from "../images/hq.png";
import quote from "../images/quote.png";
import clientPhoto from "../images/clientPhoto.png";
import dice from "../images/dice.png";

import Courosel from "./custom/Courosel";
import Footer from "./custom/Footer";

const testimonies = [
  {
    id: 1,
    name: "Rizalyn Q.",
    text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
  },
  {
    id: 2,
    name: "Loigen L.",
    text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
  },
  {
    id: 3,
    name: "Geraldine G.",
    text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
  },
  {
    id: 4,
    name: "Jackilou F.",
    text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
  },
];

const LandingPage = () => {
  const [currentTestimonyIndex, setCurrentTestimonyIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All category");
  const [activeNavLink, setActiveNavLink] = useState("ABOUT");

  const handleNext = () => {
    setCurrentTestimonyIndex(
      (prevIndex) => (prevIndex + 2) % testimonies.length
    );
  };

  const handlePrev = () => {
    setCurrentTestimonyIndex(
      (prevIndex) => (prevIndex - 2 + testimonies.length) % testimonies.length
    );
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleNavLinkClick = (navLink) => {
    setActiveNavLink(navLink);
  };

  return (
    <>
      <div className="navbar flex flex-grow justify-between">
        <Navbar />
      </div>
      <section className="banner">
        <p>Safeplace</p>
      </section>
      <section className="content">
        <div className="titleSection">
          <h2 className="welcome">Welcome to Dr. Jeb Bohol{"'"}s Practice: </h2>
          <h2 className="welcome">Empowering Your</h2>
          <h1 className="title">Mental Wellness Journey</h1>
        </div>
        <b className="subtitle">
          Find Relief, Growth, and Understanding Through Compassionate <br />{" "}
          Counseling
        </b>
        <button className="appointmentButton">Schedule an Appointment</button>
        <section className="cards">
          <div className="card">
            <div className="top">
              <img src={clock} alt="" />
              <p>24/7 Availability </p>
            </div>

            <div>
              <p>
                {" "}
                Access support whenever you need it, day or night, ensuring
                timely care.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="top">
              <img src={exp} alt="" />
              <p>18 experiences </p>
            </div>

            <div>
              <p>
                {" "}
                Access support whenever you need it, day or night, ensuring
                timely care.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="top">
              <img src={hq} alt="" />
              <p>Top-notch Treatment </p>
            </div>

            <div>
              <p>
                {" "}
                Access support whenever you need it, day or night, ensuring
                timely care.
              </p>
            </div>
          </div>
        </section>
        <section className="quote">
          <img src={quote} alt="" />
        </section>
        <section className="about">
          <div className="clientImage">
            <img src={clientPhoto} alt="sir Doe" />
          </div>
          <div className="description">
            <center>
              {" "}
              <h1>About Me </h1>
            </center>
            <p>A dedicated psychologist with a core mission to help.</p>
            <b>Jeb Bohol, PhD , RPsy - Psychologist</b>
            <p>
              Hello! I am a clinical psychologist operating in the Philippines.
              To know more click About Me.
            </p>
            <div className="btns">
              <button className="book">Book an Appointment</button>
              <button className="Aboutlink">About Me</button>
            </div>
          </div>
        </section>
        <section className="services">
          <h1>Services</h1>
          <h2>
            Empowering Therapy <br /> Solutions for Every Individual
          </h2>
          <Courosel />
          <div className="btns2">
            <button className="book">Book an Appointment</button>
            <button className="Aboutlink">Browse Services</button>
          </div>
        </section>
        <section className="testimonies">
          <div>
            <center>
              {" "}
              <h1> Testimonies</h1>
            </center>
            <h2>Client Stories: Real Experiences, Real Result</h2>
          </div>
          <div className="testimonyContainer">
            {testimonies
              .slice(currentTestimonyIndex, currentTestimonyIndex + 2)
              .map((testimony) => (
                <div key={testimony.id} className="testimony">
                  <div className="name">
                    <div className="profile"></div>
                    <p>{testimony.name}</p>
                  </div>
                  <p>{testimony.text}</p>
                </div>
              ))}
          </div>
          <div className="pagination">
            <button onClick={handlePrev}>o</button>
            <button onClick={handleNext}>o</button>
          </div>
        </section>
        <section className="blog">
          <center>
            {" "}
            <h1>Blog</h1>
          </center>
          <div className="Categories">
            {["All category", "Category 1", "Category 2", "Category 3"].map(
              (category) => (
                <div
                  key={category}
                  className={`Category ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </div>
              )
            )}
          </div>

          <div className="blogContent">
            <div className="Articles">
              <img src={dice} alt="" />
              <div className="cardbottom">
                <h2 className="category">category 1</h2>
                <b className="titlePart">Happiness is a choice</b>
                <button>Read Now</button>
              </div>
            </div>
            <div className="Articles second">
              <img src={dice} alt="" />
              <div className="cardbottom">
                <h2 className="category">category 1</h2>
                <b className="titlePart">Happiness is a choice</b>
                <button>Read Now</button>
              </div>
            </div>
            <div className="Articles third">
              <img src={dice} alt="" />
              <div className="cardbottom">
                <h2 className="category">category 1</h2>
                <b className="titlePart">Happiness is a choice</b>
                <button>Read Now</button>
              </div>
            </div>
          </div>
        </section>
        <section className="bottomBanner">
          <button>Schedule an Appointment</button>
        </section>
        <section className="bottomNavlinks">
          {[
            "HOME",
            "ABOUT",
            "SERVICE",
            "CONTACT",
            "PRIVACY POLICY",
            "TERMS OF USE",
          ].map((navLink) => (
            <a
              key={navLink}
              href={`/${navLink.toLowerCase().replace(/ /g, "")}`}
              className={`navlinks ${
                activeNavLink === navLink ? "active" : ""
              }`}
              onClick={() => handleNavLinkClick(navLink)}
            >
              {navLink}
            </a>
          ))}
        </section>
        <h1 className="bottomH1">Opening Hours : Mon-Friday 8AM - 5 PM</h1>
      </section>
      <hr />
      <section>
        <Footer />
      </section>
    </>
  );
};

export default LandingPage;
