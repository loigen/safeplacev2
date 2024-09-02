import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";

const NotFound = () => {
  const [redirectPath, setRedirectPath] = useState("/");
  const history = useHistory();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/user/profile",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          const role = response.data.user.role;
          if (role === "admin") {
            setRedirectPath("/home");
          } else {
            setRedirectPath("/Booking");
          }
        }
      } catch (error) {
        setRedirectPath("/");
      }
    };

    fetchUserProfile();
  }, []);

  const handleRedirect = () => {
    history.push(redirectPath);
  };

  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={handleRedirect}>Go Back Home</button>
    </div>
  );
};

export default NotFound;
