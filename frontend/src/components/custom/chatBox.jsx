import React, { useContext, useState, useEffect, useRef } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
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
    return <p className="text-center w-full">{error}</p>;
  }

  if (!currentChat) {
    return (
      <p className="text-center w-full">
        <span>No Conversation Selected</span>
      </p>
    );
  }

  if (!recipientUser) {
    return (
      <p className="text-center w-full">
        <span>Loading recipient information...</span>
      </p>
    );
  }

  const handleSendMessage = () => {
    sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
    setTextMessage("");
  };

  return (
    <Stack gap={4} className="chat-box w-full">
      <div className="chat-header">
        <strong>{recipientUser?.firstname}</strong>
      </div>
      <Stack
        gap={5}
        className="messages flex flex-col gap-10 h-[50vh] overflow-y-auto"
      >
        {isMessagesLoading ? (
          <p className="text-center w-full">Loading messages...</p>
        ) : messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message?.senderId === user?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <Stack
                className={`message p-3 rounded-lg flex flex-wrap ${
                  message?.senderId === user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                ref={scroll}
              >
                <span className="text-sm text-wrap">{message.text}</span>
                <br />
                <span className="text-xs text-gray-400">
                  {moment(message.createdAt).calendar()}
                </span>
              </Stack>
            </div>
          ))
        ) : (
          <p className="text-center w-full">No messages to display</p>
        )}
      </Stack>

      <Stack
        direction="horizontal"
        gap={3}
        className="chat-input flex items-center flex-grow-0"
      >
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          className="send-btn p-2 rounded-full bg-blue-500 text-white"
          onClick={handleSendMessage}
        >
          <SendIcon />
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
