import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../../styles/topbar.css";
import profile from "../../images/defaultAvatar.jpg";
import axiosInstance from "../../config/axiosConfig";
import { Notification, LoadingSpinner } from "../custom";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();

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
          profilePicture
            ? `${profilePicture}?t=${new Date().getTime()}`
            : "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="topbarComponent fixed w-full bg-gray-400 z-50 flex flex-row justify-between shadow-2xl p-3 h-16 md:h-20">
      <button
        className="goBackButton w-1/4 p-2 text-left md:p-4"
        onClick={() => history.goBack()}
      >
        Back to Dashboard
      </button>
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
          {!isMobile && (
            <div className="nameAndRole">
              <p className="name capitalize font-bold text-xs md:text-sm">
                {user.firstname} {user.lastname}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;