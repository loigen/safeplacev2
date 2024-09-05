import React from "react";

const Help = ({ setView }) => {
  return (
    <div>
      <p
        onClick={() => setView("settings")}
        className="text-black"
        style={{ cursor: "pointer", marginBottom: "1rem" }}
      >
        Back
      </p>
      ;Help
    </div>
  );
};

export default Help;
