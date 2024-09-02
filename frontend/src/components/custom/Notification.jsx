import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import axiosInstance from "../../config/axiosConfig";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.firstname,
    };
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        setError("Error fetching profile.");
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  console.log("unread", unreadNotifications);
  console.log("modified", modifiedNotifications);
  return (
    <div className="notifications">
      <div
        className="notifications-icon text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChatBubbleIcon />
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationAsRead(notifications)}
            >
              Mark all as read
            </div>
            <a className="text-green-800 text-right w-full" href="/messenger">
              Go to messenger
            </a>
          </div>

          <br />
          {modifiedNotifications?.length === 0 ? <span>no notif</span> : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  onClick={() => {
                    markNotificationAsRead(n, userChats, user, notifications);
                    setIsOpen(false);
                  }}
                >
                  <span>{`${n.senderName} sent you a new message`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
