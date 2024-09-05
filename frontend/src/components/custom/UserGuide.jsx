import { Typography } from "@mui/material";
import React from "react";

const UserGuide = ({ setView }) => {
  return (
    <div>
      <p
        onClick={() => setView("settings")}
        className="text-black"
        style={{ cursor: "pointer", marginBottom: "1rem" }}
      >
        Back
      </p>
      UserGuide
    </div>
  );
};

export default UserGuide;
