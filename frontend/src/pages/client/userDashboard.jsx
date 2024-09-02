import React, { useState, useEffect } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Sidebar, Topbar } from "../../components/client";

const UserDashboard = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div onClick={closeSidebar} className="relative h-screen overflow-hidden">
      <div>
        <Topbar />
      </div>
      <div className="contentBody flex flex-row justify-between h-full">
        {isMobile ? (
          <div className="burgerMenu flex flex-col items-start z-50">
            <button onClick={toggleSidebar} className="p-2">
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            {isSidebarOpen && (
              <div
                className="mobileSidebar absolute top-16 left-0 w-3/4 bg-white shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar />
              </div>
            )}
          </div>
        ) : (
          <div className="sidebarWrapper">
            <Sidebar />
          </div>
        )}
        <div
          className="flex-grow"
          style={{
            overflow: "scroll",
            height: "90vh",
            appearance: "none",
            overflowX: "hidden",
            backgroundColor: "#d9f4f9",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
