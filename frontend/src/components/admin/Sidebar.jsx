import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";
import logo from "../../images/bigLogo.png";
import HomeIcon from "@mui/icons-material/Home";
import Person2Icon from "@mui/icons-material/Person2";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import axiosInstance from "../../config/axiosConfig";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      setLoading(false);
    }
  };

  return (
    <div className="sidebar flex flex-col items-center bg-white shadow-lg">
      <div className="w-full object-cover p-4">
        <img className="w-full" src={logo} alt="safeplace" />
      </div>
      <div className="w-full flex flex-col justify-between items-center flex-grow">
        <ul className="links flex flex-col gap-6 w-full justify-center items-center">
          <li>
            <NavLink
              to="/home"
              activeClassName="active"
              className="sidebar-link"
            >
              <HomeIcon fontSize="large" className="sidebar-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patients"
              activeClassName="active"
              className="sidebar-link"
            >
              <Person2Icon fontSize="large" className="sidebar-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/schedule"
              activeClassName="active"
              className="sidebar-link"
            >
              <CalendarTodayIcon fontSize="large" className="sidebar-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              activeClassName="active"
              className="sidebar-link"
            >
              <EventAvailableIcon fontSize="large" className="sidebar-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/messenger"
              activeClassName="active"
              className="sidebar-link"
            >
              <ChatBubbleIcon fontSize="large" className="sidebar-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/AdminSettings"
              activeClassName="active"
              className="sidebar-link"
            >
              <SettingsIcon fontSize="large" className="sidebar-icon" />
            </NavLink>
          </li>
        </ul>
        <div className="p-4 mb-10">
          <button
            className="flex text-[#2c6975] font-bold flex-row justify-center items-center"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <span>Logging out...</span>
            ) : (
              <LogoutIcon fontSize="large" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
