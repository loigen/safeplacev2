import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { LoadingSpinner, PotentialChats, ChatBox, UserChat } from "./index";
import axiosInstance from "../../config/axiosConfig";
import { Topbar } from "../custom";
import pointing from "../../images/pointing.gif";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

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

  const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat } =
    useContext(ChatContext);

  if (isUserChatsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (userChatsError) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {userChatsError.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <br />
      <br />
      <br />
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="flex flex-col lg:flex-row w-full h-full">
          <div className="lg:w-1/3 bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto">
            <PotentialChats />
            {userChats?.length > 0 ? (
              <div className="flex flex-col gap-2 mt-4">
                {userChats.map((chat, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentChat(chat);
                      updateCurrentChat(chat);
                    }}
                    className="cursor-pointer p-2 border hover:bg-gray-200 rounded transition-colors"
                  >
                    <UserChat chat={chat} user={user} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-1/2 text-gray-600">
                No Recent Chats
              </div>
            )}
          </div>
          <div className="lg:w-2/3 flex-1 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
            {currentChat ? (
              <ChatBox chat={currentChat} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <img src={pointing} alt="Pointing gif" />
                <p>Select a chat to start sending messages...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
