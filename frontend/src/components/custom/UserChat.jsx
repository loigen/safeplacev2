import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import useFetchLatestMessage from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId === recipientUser?._id
  );

  if (!recipientUser) {
    return <div>Loading...</div>;
  }

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const truncateText = (text) => {
    if (!text) return ""; // Handle cases where text is null or undefined

    let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText = shortText + "...";
    }
    return shortText;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card flex flex-row items-center p-2 justify-between"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length > 0) {
          markThisUserNotificationsAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2 flex flex-row gap-1 capitalize">
          {recipientUser.profilePicture && (
            <img
              src={recipientUser.profilePicture}
              className="h-[35px] rounded-full"
              alt={`${recipientUser.firstname}'s profile`}
            />
          )}
          <div
            className={isOnline ? "p-2 bg-green-600 rounded-full w-5 h-5" : ""}
          ></div>
        </div>
        <div className="text-content">
          <div className="name text-black">{recipientUser.firstname}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-col flex items-end p-2">
        <div className="date">
          {latestMessage?.createdAt
            ? moment(latestMessage.createdAt).calendar()
            : "No Date"}
        </div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications.length
            : ""}
        </div>
      </div>
    </Stack>
  );
};

export default UserChat;
