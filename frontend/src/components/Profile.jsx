import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./custom/LoadingSpinner";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>
        Name: {user.firstname} {user.lastname}
      </p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
