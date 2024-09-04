import React, { useState, useEffect } from "react";
import LoadingSpinner from "../custom/LoadingSpinner";
import "../../styles/topbar.css";
import profile from "../../images/defaultAvatar.jpg";
import axiosInstance from "../../config/axiosConfig";
import { Notification } from "../custom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Topbar = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useHistory();
  useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        const { profilePicture } = response.data.user;
        setUser(response.data.user);
        setAvatar(
          `${profilePicture}?t=${new Date().getTime()}` ||
            "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
        );
      } catch (error) {
        setError("Error fetching profile.");
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    navigate.push("/AdminSettings"); // Redirect to the /profile route
  };
  const handleLogout = async () => {
    setLoading(true);

    try {
      await axiosInstance.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      setLoading(false);
    }
  };
  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="topbarComponent flex flex-row justify-between shadow-md p-3 h-16 md:h-20">
      <div className="flex flex-row w-full justify-end gap-10">
        <ul className="flex flex-row gap-4 md:gap-6 items-center">
          <li>
            <Notification />
          </li>
        </ul>
        <div className="profilePart flex flex-row gap-4 md:gap-6 items-center justify-center">
          <div className="profilePicture border-2 border-black rounded-full w-10 h-10 md:w-12 md:h-12">
            <img
              src={avatar || profile}
              alt={`${user.firstname} ${user.lastname}`}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="relative">
            {!isMobile && (
              <div className="nameAndRole" onClick={toggleDropdown}>
                <p className="name capitalize font-bold text-xs md:text-sm cursor-pointer">
                  {user.firstname} {user.lastname}
                </p>
              </div>
            )}

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Go to Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
