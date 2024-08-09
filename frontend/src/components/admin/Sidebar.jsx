import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";
import logo from "../../images/bigLogo.png";
import HomeIcon from "@mui/icons-material/Home";
import Person2Icon from "@mui/icons-material/Person2";
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
    <div>
      <div className="sidebar flex flex-col items-center">
        <div className="w-full object-cover">
          <img className="w-full" src={logo} alt="safeplace" />
        </div>
        <div
          className="w-full flex flex-col justify-between items-center"
          style={{ height: "80%" }}
        >
          <ul className="links flex flex-col gap-6 w-full justify-center items-center">
            <li>
              <NavLink
                to="/home"
                activeClassName="active"
                className="sidebar-link"
              >
                <HomeIcon id="icon" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patients"
                activeClassName="active"
                className="sidebar-link"
              >
                <Person2Icon id="icon" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/schedule"
                activeClassName="active"
                className="sidebar-link"
              >
                <CalendarTodayIcon id="icon" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                activeClassName="active"
                className="sidebar-link"
              >
                <EventAvailableIcon id="icon" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                activeClassName="active"
                className="sidebar-link"
              >
                <SettingsIcon id="icon" />
              </NavLink>
            </li>
          </ul>
          <div className="logout ">
            <button
              className="flex text-[#2c6975] font-bold flex-row justify-center items-center"
              onClick={handleLogout}
            >
              <LogoutIcon fontSize="large" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
