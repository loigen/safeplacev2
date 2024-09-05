import React from "react";

const FAQs = ({ setView }) => {
  return (
    <div>
      <p
        onClick={() => setView("settings")}
        className="text-black"
        style={{ cursor: "pointer", marginBottom: "1rem" }}
      >
        Back
      </p>
      FAQs
    </div>
  );
};

export default FAQs;
