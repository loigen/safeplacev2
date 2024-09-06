import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import LoadingSpinner from "./LoadingSpinner";
import { Tooltip } from "@mui/material";
import axios from "axios";

const PotentialChats = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile.");
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 font-bold text-center">{error}</div>;
  }

  return (
    <div className=" flex overflow-x-auto space-x-4 p-4">
      {potentialChats &&
        potentialChats.map((u, index) => (
          <Tooltip title={u.firstname}>
            <div
              className="single-user flex flex-col items-center flex-shrink-0"
              key={index}
              onClick={() => user && createChat(user._id, u._id)}
            >
              <div className="relative">
                <img
                  src={u.profilePicture}
                  className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#2c6975] rounded-full shadow-2xl"
                  alt={`${u.name}'s profile`}
                />
                {onlineUsers?.some((user) => user?.userId === u?._id) && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 text-center">
                {u.name}
              </span>
            </div>
          </Tooltip>
        ))}
    </div>
  );
};

export default PotentialChats;
