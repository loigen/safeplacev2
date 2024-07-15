import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../custom/LoadingSpinner";
import "../../styles/topbar.css";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import profile from "../../images/defaultAvatar.jpg";

const Topbar = () => {
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
  if (!user) {
    return <LoadingSpinner />;
  }
  return (
    <div className="topbarComponent flex flex-row justify-between shadow-md p-5">
      <div></div>
      <div className="conts flex flex-row gap-5">
        <ul className="flex flex-row gap-3 items-center">
          <li>
            <a href="/messenger">
              <ChatBubbleOutlineOutlinedIcon />
            </a>
          </li>
          <li>
            <a href="/notifications">
              <NotificationsNoneOutlinedIcon />
            </a>
          </li>
        </ul>
        <div className="profilePart flex flex-row gap-5 items-center justify-center">
          <div className="profilePicture border-2 border-black p-2 rounded-full">
            {" "}
            <img
              src={profile}
              alt={`${user.firstname} ${user.lastname}`}
              className="w-5"
            />
          </div>
          <div className="nameAndRole">
            <p className="name capitalize">
              {user.firstname} {user.lastname}
            </p>
            <p className="role text-sm text-center">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
