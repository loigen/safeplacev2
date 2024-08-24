import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/custom/LoadingSpinner";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import EmailIcon from "@mui/icons-material/Email";
import { NavLink } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import Profile from "../../components/client/Profile";
import ChangePassword from "../../components/custom/ChangePassword";
import axiosInstance from "../../config/axiosConfig";

const AdminSettings = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(null);
  const [view, setView] = useState("settings");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        const { profilePicture } = response.data.user;
        setUser(response.data.user);
        setAvatar(
          profilePicture ||
            "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
        );
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <LoadingSpinner />;
  }
  const renderView = () => {
    switch (view) {
      case "profile":
        return <Profile />;
      case "Security":
        return <ChangePassword />;
      default:
        return (
          <div className="flex flex-row justify-center py-16">
            <div className="bg-[#2c6975] h-[10%] flex items-center justify-center p-2">
              <SettingsIcon className="text-white" />
            </div>
            <div
              style={{ paddingBottom: "1rem" }}
              className=" bg-white  shadow-2xl max-w-xl w-[50%]  py-1"
            >
              <div
                className="flex flex-row  items-center px-10 py-5 gap-8"
                style={{ borderBottom: "gray 1px solid" }}
              >
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-md"
                />
                <div className="flex flex-row gap-2 capitalize font-semibold text-xl">
                  <p>{user.firstname}</p>
                  <p>{user.lastname}</p>
                </div>
              </div>
              <div
                style={{ borderBottom: "1px solid gray" }}
                className="px-10 py-2 flex flex-col gap-5"
              >
                <p className="text-gray-700 font-bold capitalize">
                  account settings
                </p>
                <button
                  className="flex gap-2 px-2 text-gray-700 capitalize font-semibold"
                  onClick={() => setView("profile")}
                >
                  <AccountCircleOutlinedIcon className="text-[#2c6975]" />
                  <p>my profile</p>
                </button>
                <button
                  className="flex gap-2 px-2"
                  onClick={() => setView("Security")}
                >
                  <LockOutlinedIcon className="text-[#2c6975]" />
                  <p className=" font-semibold text-gray-700">
                    Password and Security
                  </p>
                </button>
              </div>
              <div className="px-10 py-5 flex flex-col gap-5">
                <p className="text-gray-700 font-bold capitalize">More</p>
                <button
                  className="flex gap-2 px-2"
                  onClick={() => setView("profile")}
                >
                  <LocalLibraryIcon className="text-[#2c6975]" />
                  <p className=" font-semibold text-gray-700">User Guide</p>
                </button>
                <button
                  className="flex gap-2 px-2"
                  onClick={() => setView("profile")}
                >
                  <EmailIcon className="text-[#2c6975]" />
                  <p className=" font-semibold text-gray-700">
                    Contact Support
                  </p>
                </button>
                <button
                  className="flex gap-2 px-2"
                  onClick={() => setView("profile")}
                >
                  <QuestionMarkOutlinedIcon className="text-[#2c6975]" />
                  <p className="capitalize font-semibold text-gray-700">FAQs</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <div>
      {view !== "settings" && (
        <button
          onClick={() => setView("settings")}
          className="text-[#2c6975]  rounded-lg px-4 py-2  mb-4"
        >
          <ArrowBackIcon style={{ fontSize: "3rem" }} />
        </button>
      )}
      {renderView()}
    </div>
  );
};

export default AdminSettings;
