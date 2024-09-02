import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import axiosInstance from "../../config/axiosConfig";

const PotentialChats = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    console.log("Chat component mounted");
  }, []);
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

  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="all-users">
      {potentialChats &&
        potentialChats.map((u, index) => (
          <div
            className="single-user"
            key={index}
            onClick={() => user && createChat(user._id, u._id)}
          >
            {u.firstname}
            <span
              className={
                onlineUsers?.some((user) => user?.userId === u?._id)
                  ? "user-online"
                  : ""
              }
            ></span>
          </div>
        ))}
    </div>
  );
};

export default PotentialChats;
