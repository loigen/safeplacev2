import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/service";

const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

        if (response.error) {
          throw new Error(response.error);
        }

        const lastMessage = response[response?.length - 1];
        setLatestMessage(lastMessage);
      } catch (error) {
        console.error("Error getting messages:", error);
        setError(error);
      }
    };

    if (chat?._id) {
      getMessages();
    }
  }, [newMessage, notifications, chat?._id]);

  return { latestMessage, error };
};

export default useFetchLatestMessage;
