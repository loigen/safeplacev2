import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Container } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { LoadingSpinner, PotentialChats, ChatBox, UserChat } from "./index";
import axiosInstance from "../../config/axiosConfig";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        const { profilePicture } = response.data.user;
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
    return <div>Loading...</div>;
  }

  if (userChatsError) {
    return <div>Error: {userChatsError.message}</div>;
  }

  return (
    <Container className="h-full">
      <PotentialChats />

      {userChats?.length < 1 ? null : (
        <Stack className="flex items-start h-full" gap={3}>
          <Stack className="messages-box flex-gow-0 h-full">
            {isUserChatsLoading && <LoadingSpinner />}
            {userChats?.map((chat, index) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
