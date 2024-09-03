import React, { useState, useEffect } from "react";
import { Topbar, Sidebar } from "../../components/admin";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Dashboard = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Topbar />
      </header>

      <div className="flex flex-row pt-[56px] h-full">
        {/* Sidebar */}
        {isMobile ? (
          <div className="flex flex-col items-start z-50">
            <button onClick={toggleSidebar} className="p-2">
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            {isSidebarOpen && (
              <aside
                className="absolute top-16 left-0 w-3/4 bg-white shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar />
              </aside>
            )}
          </div>
        ) : (
          <aside className="w-64 bg-white shadow-md">
            <Sidebar />
          </aside>
        )}

        <main
          className="flex-grow overflow-auto"
          style={{ backgroundColor: "#d9f4f9" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
