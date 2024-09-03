import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";
import { LoadingSpinner } from "../custom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [localFile, setLocalFile] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        const {
          firstname,
          lastname,
          email,
          role,
          profilePicture,
          lastProfileUpdate,
        } = response.data.user;
        setUser(response.data.user);
        setFormData({ firstname, lastname, email, role });
        setAvatar(
          profilePicture ||
            "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
        );
        setLastUpdate(new Date(lastProfileUpdate));
      } catch (error) {
        setError("Error fetching profile.");
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please upload a photo in JPEG, JPG, or PNG format.",
        });
        setLocalFile(null);
        return;
      }

      setLocalFile(file);
      const objectURL = URL.createObjectURL(file);
      setAvatar(objectURL);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    return formData.firstname.trim() !== "" && formData.lastname.trim() !== "";
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      setError("First name and last name cannot be empty.");
      return;
    }

    const now = new Date();

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("firstname", formData.firstname);
      formPayload.append("lastname", formData.lastname);
      formPayload.append("email", formData.email);
      formPayload.append("role", formData.role);

      if (localFile) {
        formPayload.append("profile_picture", localFile);
      }

      const response = await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/user/updateprofile`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setUser(response.data.user);
      setAvatar(response.data.user.profilePicture || avatar);
      setLocalFile(null);
      setIsEditing(false);
      URL.revokeObjectURL(avatar);

      localStorage.setItem("lastProfileUpdate", now.toISOString());
      setLastUpdate(now);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated!",
        willClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      setError("Error updating profile.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });
    setAvatar(user.profilePicture);
    setLocalFile(null);
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="text-center mb-6">
        <img
          src={avatar}
          alt="Profile"
          className="w-36 h-36 rounded-full border-2 border-gray-300 shadow-md"
        />
        {isEditing && (
          <label className="block mt-4 cursor-pointer bg-blue-600 text-white rounded-lg py-2 px-4 text-center relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            Upload Photo
          </label>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          Name:
          <div className="flex space-x-2">
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Last Name"
            />
          </div>
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block mb-2">
          Role:
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </label>
      </div>
      <div className="flex space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveChanges}
              disabled={!validateForm() || loading}
              className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
