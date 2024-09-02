import React from "react";
import "../../styles/loadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading, Please Wait...</p>
    </div>
  );
};

export default LoadingSpinner;
