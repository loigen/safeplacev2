import React from "react";

const UserDashboard = ({ children }) => {
  return (
    <div>
      <div>userDashboard</div>
      <div className="contentBody">{children}</div>
    </div>
  );
};

export default UserDashboard;
