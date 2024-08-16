import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../custom/LoadingSpinner";
import "../../styles/topbar.css";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import profile from "../../images/defaultAvatar.jpg";
import { NavLink } from "react-router-dom";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [showNotificationDropdown, setShowNotificationDropdown] =
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
        const response = await axios.get(
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

    const fetchUnreadCounts = async () => {
      try {
        const messagesResponse = await axios.get(
          "http://localhost:5000/messages/unreadCount",
          { withCredentials: true }
        );
        const notificationsResponse = await axios.get(
          "http://localhost:5000/notifications/unreadCount",
          { withCredentials: true }
        );
        const notificationsListResponse = await axios.get(
          "http://localhost:5000/notifications",
          { withCredentials: true }
        );

        setUnreadMessages(messagesResponse.data.count);
        setUnreadNotifications(notificationsResponse.data.count);
        setNotifications(notificationsListResponse.data.notifications);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          setUnreadMessages(3);
          setUnreadNotifications(3);
          setNotifications([
            { id: 1, message: "Notification 1", read: false },
            { id: 2, message: "Notification 2", read: false },
            { id: 3, message: "Notification 3", read: false },
          ]);
        } else {
          console.error("Error fetching unread counts:", error);
        }
      }
    };

    fetchProfile();
    fetchUnreadCounts();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const notification = notifications.find(
        (notif) => notif.id === notificationId
      );

      if (notification.read) {
        return;
      }

      if (process.env.NODE_ENV !== "development") {
        await axios.post(
          `http://localhost:5000/notifications/markAsRead/${notificationId}`,
          {},
          { withCredentials: true }
        );
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      setUnreadNotifications((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
            <NavLink to="/messenger">
              <div className="relative">
                <ChatBubbleOutlineOutlinedIcon />
                {unreadMessages > 0 && (
                  <span className="badge text-white left-4 bg-red-600 px-1 rounded-full absolute">
                    {unreadMessages}
                  </span>
                )}
              </div>
            </NavLink>
          </li>
          <li onClick={handleNotificationClick} className="relative">
            <NotificationsNoneOutlinedIcon />
            {unreadNotifications > 0 && (
              <span className="badge text-white absolute bg-red-600 px-1 rounded-full left-4">
                {unreadNotifications}
              </span>
            )}
            {showNotificationDropdown && (
              <div className="notificationDropdown absolute top-8 right-0 w-64 bg-white shadow-lg p-4">
                <ul className="flex flex-col gap-2">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`notificationItem ${
                        notification.read ? "read" : "unread"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
