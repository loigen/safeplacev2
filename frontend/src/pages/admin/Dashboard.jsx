import React, { useState, useEffect } from "react";
import { Topbar, Sidebar } from "../../components/admin";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

const Dashboard = ({ children }) => {
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

  return (
    <div className="relative h-screen overflow-hidden">
      <Topbar />
      <div className="contentBody flex flex-row justify-between h-full">
        {isMobile ? (
          <div className="burgerMenu flex flex-col items-start z-50">
            <IconButton onClick={toggleSidebar} className="p-2">
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Drawer
              anchor="left"
              open={isSidebarOpen}
              onClose={toggleSidebar}
              PaperProps={{ style: { width: "25%" } }}
            >
              <Sidebar />
            </Drawer>
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

export default Dashboard;
