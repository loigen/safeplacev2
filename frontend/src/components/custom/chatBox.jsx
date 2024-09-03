import React, { useContext, useState, useEffect, useRef } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import SendIcon from "@mui/icons-material/Send";

const ChatBox = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (error) {
    return <p className="text-center w-full text-red-500">{error}</p>;
  }

  if (!currentChat) {
    return (
      <p className="text-center w-full text-gray-500">
        <span>No Conversation Selected</span>
      </p>
    );
  }

  if (!recipientUser) {
    return (
      <p className="text-center w-full text-gray-500">
        <span>Loading recipient information...</span>
      </p>
    );
  }

  const handleSendMessage = () => {
    if (textMessage.trim()) {
      sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
      setTextMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg">
      {/* Topbar */}
      <div className="flex items-center w-full justify-between p-4 border-b border-gray-200 bg-[#2c6975] rounded-t-lg">
        <strong className="text-lg md:text-xl font-semibold text-white flex flex-row items-center gap-2 md:gap-4 capitalize">
          <img
            src={recipientUser?.profilePicture}
            className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#2c6975] rounded-full shadow-2xl"
            alt={`${recipientUser?.name}'s profile`}
          />
          <p>
            {recipientUser?.firstname} {recipientUser?.lastname}
          </p>
        </strong>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {isMessagesLoading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message?.senderId === user?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
              ref={scroll}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md ${
                  message?.senderId === user?._id
                    ? "bg-[#2c6975] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs text-gray-400">
                  {moment(message.createdAt).calendar()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            You haven't sent a message to{" "}
            <span className="capitalize">
              {" "}
              {recipientUser?.firstname} {recipientUser?.lastname}{" "}
            </span>{" "}
            . Say hi!
          </p>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center p-4 border-t border-gray-200 bg-gray-100">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="Nunito, sans-serif"
          borderColor="rgba(44, 105, 117, 0.2)"
          placeholder="Type a message..."
          className="flex-1 border-none focus:ring-0 outline-none"
        />
        <button
          className="ml-4 p-2 rounded-full bg-[#2c6975] text-white hover:bg-[#2c5e6a] transition duration-200"
          onClick={handleSendMessage}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
