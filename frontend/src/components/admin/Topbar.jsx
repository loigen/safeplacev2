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
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);

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

    const fetchUnreadCounts = async () => {
      if (process.env.NODE_ENV === "development") {
        setUnreadMessages(3);
        setUnreadNotifications(3);
        setNotifications([
          { id: 1, message: "Notification 1", read: false },
          { id: 2, message: "Notification 2", read: false },
          { id: 3, message: "Notification 3", read: false },
        ]);
      } else {
        try {
          const messagesResponse = await axios.get(
            "http://localhost:5000/messages/unreadCount",
            {
              withCredentials: true,
            }
          );
          const notificationsResponse = await axios.get(
            "http://localhost:5000/notifications/unreadCount",
            {
              withCredentials: true,
            }
          );
          const notificationsListResponse = await axios.get(
            "http://localhost:5000/notifications",
            {
              withCredentials: true,
            }
          );

          setUnreadMessages(messagesResponse.data.count);
          setUnreadNotifications(notificationsResponse.data.count);
          setNotifications(notificationsListResponse.data.notifications);
        } catch (error) {
          console.error("Error fetching unread counts:", error);
        }
      }
    };

    fetchProfile();
    fetchUnreadCounts();
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
        return; // If the notification is already read, do nothing
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
    <div className="topbarComponent flex flex-row justify-between shadow-md p-5">
      <div></div>
      <div className="conts flex flex-row gap-5">
        <ul className="flex flex-row gap-5 items-center">
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
                <ul className="flex flex-col gap-2 ">
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
        <div className="profilePart flex flex-row gap-5 items-center justify-center">
          <div className="profilePicture border-2 border-black p-2 rounded-full">
            <img
              src={profile}
              alt={`${user.firstname} ${user.lastname}`}
              className="w-5"
            />
          </div>
          <div className="nameAndRole">
            <p className="name capitalize font-bold">
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
