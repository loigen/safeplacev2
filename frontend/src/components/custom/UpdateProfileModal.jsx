import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const UpdateProfileModal = ({ user, isOpen, onRequestClose, updateUser }) => {
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: "",
    photo: null, // Add photo field for file input
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0], // Store the selected file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("firstname", formData.firstname);
      formDataUpload.append("lastname", formData.lastname);
      formDataUpload.append("email", formData.email);
      formDataUpload.append("password", formData.password);
      formDataUpload.append("photo", formData.photo); // Append the photo file

      const response = await axios.put(
        "http://localhost:5000/user/updateprofile",
        formDataUpload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );
      if (response.data.success) {
        updateUser(response.data.user);
        alert("Profile updated successfully");
        onRequestClose(); // Close modal on success
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Profile"
      ariaHideApp={false}
    >
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Update Profile</button>
        <button type="button" onClick={onRequestClose}>
          Close
        </button>
      </form>
    </Modal>
  );
};

export default UpdateProfileModal;
