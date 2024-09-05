import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { changePassword } from "../../api/userAPI/changePassword";
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ChangePasswordForm = ({ setView }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const blockTime = localStorage.getItem("blockTime");
    const lastChangeTime = localStorage.getItem("lastChangeTime");
    const currentTime = Date.now();

    if (blockTime) {
      const timeDifference = currentTime - blockTime;
      if (timeDifference < 86400000) {
        setIsBlocked(true);
        Swal.fire({
          title: "Blocked!",
          text: "You have been blocked from changing the password for 24 hours due to multiple incorrect attempts.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        localStorage.removeItem("blockTime");
      }
    }

    if (lastChangeTime) {
      const timeDifference = currentTime - lastChangeTime;
      if (timeDifference < 86400000) {
        setIsDisabled(true);
        Swal.fire({
          title: "Please wait!",
          text: "You have recently changed your password. You need to wait 24 hours before changing it again.",
          icon: "info",
          confirmButtonText: "OK",
        });
      } else {
        localStorage.removeItem("lastChangeTime");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      Swal.fire({
        title: "Blocked!",
        text: "You are blocked from changing the password.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (isDisabled) {
      Swal.fire({
        title: "Please wait!",
        text: "You cannot change the password at this time.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "New passwords don't match. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        setNewPassword("");
        setConfirmPassword("");
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await changePassword(
        currentPassword,
        newPassword,
        token
      );

      Swal.fire({
        title: "Success",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      });

      setIncorrectAttempts(0);
      setIsDisabled(true);

      const currentTime = Date.now();
      localStorage.setItem("lastChangeTime", currentTime);

      setCurrentPassword("");
    } catch (err) {
      const newAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newAttempts);

      Swal.fire({
        title: "Error",
        text: err.error || "Failed to change password.",
        icon: "error",
        confirmButtonText: "OK",
      });

      if (newAttempts >= 3) {
        const blockTime = Date.now();
        localStorage.setItem("blockTime", blockTime);
        setIsBlocked(true);

        Swal.fire({
          title: "Blocked!",
          text: "You have been blocked from changing the password for 24 hours due to multiple incorrect attempts.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <IconButton onClick={() => setView("settings")}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={isBlocked || isDisabled}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isBlocked || isDisabled}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isBlocked || isDisabled}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isBlocked || isDisabled}
            style={{ marginTop: "1rem" }}
          >
            Change Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePasswordForm;
