// Dashboard.js
import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const Dashboard = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Topbar className="side" />
      <div className="contentBody flex flex-row justify-between">
        <div>
          <Sidebar />
        </div>
        <div
          className="flex-grow "
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
