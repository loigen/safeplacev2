import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProfileModal from "./UpdateProfileModal";
import profile from "../../images/defaultAvatar.jpg";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const updateUser = (updatedUser) => setUser(updatedUser);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2>Admin Profile</h2>
      {/* Display Profile Photo */}
      {user.profilePicture && (
        <div>
          <img
            src={profile} // Assuming your server serves images from this path
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
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
