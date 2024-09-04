import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";
import logo from "../../images/bigLogo.png";
import HomeIcon from "@mui/icons-material/Home";
import Person2Icon from "@mui/icons-material/Person2";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = () => {
  return (
    <div className="sidebar flex flex-col items-center bg-white">
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
              to="/AdminSettings"
              activeClassName="active"
              className="sidebar-link"
            >
              <SettingsIcon fontSize="large" className="sidebar-icon" />
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
