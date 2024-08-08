import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProfileModal from "./UpdateProfileModal";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        setError("Error fetching profile.");
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      setError("Error logging out.");
      console.error("Error logging out:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const updateUser = (updatedUser) => setUser(updatedUser);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user.avatar && (
        <div>
          <img
            src={user.avatar}
            alt="Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "red",
            }}
          />
        </div>
      )}
      <p>
        Name: {user.firstname} {user.lastname}
      </p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={openModal}>Update Profile</button>
      <button onClick={handleLogout}>Logout</button>
      <UpdateProfileModal
        user={user}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        updateUser={updateUser}
      />
    </div>
  );
};

export default Profile;
