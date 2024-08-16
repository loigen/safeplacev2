import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";
import logo from "../../images/bigLogo.png";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="sidebar flex flex-col items-center h-full bg-white shadow-lg">
      <div className="w-full object-cover p-4">
        <img className="w-full" src={logo} alt="safeplace" />
      </div>
      <div className="w-full flex flex-col justify-between items-center flex-grow">
        <ul className="links flex flex-col gap-6 w-full justify-center items-center">
          <li>
            <NavLink
              to="/booking"
              activeClassName="active"
              className="sidebar-link"
            >
              <CalendarTodayIcon className="sidebar-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/MR_JEB_BLOG"
              activeClassName="active"
              className="sidebar-link"
            >
              <EventAvailableIcon className="sidebar-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              activeClassName="active"
              className="sidebar-link"
            >
              <SettingsIcon className="sidebar-icon" />
            </NavLink>
          </li>
        </ul>
        <div className="logout p-4">
          <button
            className="flex text-[#2c6975] font-bold flex-row justify-center items-center"
            onClick={handleLogout}
          >
            <LogoutIcon fontSize="large" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;