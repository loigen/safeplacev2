import React, { useContext, useState, useEffect, useRef } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

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
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!currentChat) {
    return (
      <Typography color="textSecondary" align="center">
        No Conversation Selected
      </Typography>
    );
  }

  if (!recipientUser) {
    return (
      <Typography color="textSecondary" align="center">
        Loading recipient information...
      </Typography>
    );
  }

  const handleSendMessage = () => {
    if (textMessage.trim()) {
      sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
      setTextMessage("");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="background.paper"
      borderRadius={1}
      boxShadow={3}
    >
      {/* Topbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Avatar
            src={recipientUser?.profilePicture}
            alt={`${recipientUser?.name}'s profile`}
            sx={{ mr: 2 }}
          />
          <Typography variant="h6">
            {recipientUser?.firstname} {recipientUser?.lastname}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box
        flex={1}
        overflow="auto"
        p={2}
        sx={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {isMessagesLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message?.senderId === user?._id ? "flex-end" : "flex-start"
              }
              mb={1}
              ref={scroll}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  maxWidth: "75%",
                  bgcolor:
                    message?.senderId === user?._id
                      ? "primary.main"
                      : "background.paper",
                  color:
                    message?.senderId === user?._id ? "white" : "text.primary",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    width: "100%",
                  }}
                >
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    mt: 1,
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    width: "100%",
                  }}
                >
                  {moment(message.createdAt).calendar()}
                </Typography>
              </Paper>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary" align="center">
            You haven't sent a message to{" "}
            <strong>
              {recipientUser?.firstname} {recipientUser?.lastname}
            </strong>{" "}
            . Say hi!
          </Typography>
        )}
      </Box>

      {/* Input Area */}
      <Box
        component="form"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderTop={1}
        borderColor="divider"
        bgcolor="background.paper"
        sx={{ width: "100%" }}
      >
        <div className="w-[95%] flex">
          <InputEmoji
            value={textMessage}
            onChange={setTextMessage}
            fontFamily="Nunito, sans-serif"
            borderColor="rgba(44, 105, 117, 0.2)"
            placeholder="Type a message..."
            className="flex-1 border-none focus:ring-0 outline-none"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            aria-label="Send message"
          >
            <SendIcon />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default ChatBox;
