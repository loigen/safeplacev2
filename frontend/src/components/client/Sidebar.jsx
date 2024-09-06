import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";
import logo from "../../images/bigLogo.png";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = () => {
  return (
    <div className="sidebar flex flex-col items-center  bg-white shadow-2xl">
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

          <NavLink
            to="/clientSettings"
            activeClassName="active"
            className="sidebar-link"
          >
            <SettingsIcon className="sidebar-icon" />
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
