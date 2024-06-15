import React, { useState } from "react";
import logo from "../../images/logo.png";
import "../../styles/navlink.css";

const Navpar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = (route) => {
    window.location.href = route;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="logo-container">
          <img src={logo} alt="" className="logo" />
        </div>
        <div className={`nav-links ${isOpen ? "hidden md:flex" : "md:flex"}`}>
          <div
            className="nav-link"
            onClick={() => handleCardClick("/landingpage")}
          >
            Home
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Apout")}>
            About
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Contact")}>
            Services
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Contact")}>
            Contact
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Contact")}>
            Blog
          </div>
        </div>
        <div className="menu-toggle md-hidden">
          <button className="menu-button" onClick={toggleMenu}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="#000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mobile-menu md-hidden">
          <div className="nav-link" onClick={() => handleCardClick("/Apout")}>
            About
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Contact")}>
            Contact
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Contact")}>
            Services
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Contact")}>
            Contact
          </div>
          <div className="nav-link" onClick={() => handleCardClick("/Contact")}>
            Blog
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navpar;
