import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import logo from "../images/bigLogo.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

const LoginModal = ({ open, onClose, handleOpenRegisterModal }) => {
  const { fetchUserProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    if (remembered) {
      setEmail(localStorage.getItem("rememberedEmail") || "");
      setPassword(localStorage.getItem("rememberedPassword") || "");
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (email.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);

      if (rememberMe) {
        localStorage.setItem("rememberMe", true);
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      await fetchUserProfile();

      const Blocked = response.data.status;

      if (Blocked === "blocked") {
        setError("Your account has been blocked");
      }
      const userRole = response.data.role;
      if (userRole === "user") {
        history.push("/booking");
      } else {
        history.push("/home");
      }
      onClose();
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.error;

        if (status === 403) {
          setError("Your account has been blocked. Please contact support.");
        } else if (status === 401) {
          if (errorMessage.includes("password")) {
            setError("Incorrect password. Please try again.");
          } else if (errorMessage.includes("email")) {
            setError("Email not found. Please check your email address.");
          } else {
            setError("Invalid credentials. Please try again.");
          }
        } else {
          setError("An error occurred. Please try again later.");
        }
        setSnackbarOpen(true);
      } else {
        setError("Network error. Please check your connection.");
        setSnackbarOpen(true);
      }
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <ArrowBackIcon
            onClick={onClose}
            sx={{
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "#2C6975",
            }}
          />
        </DialogTitle>
        <DialogContent>
          <Box alignItems="center" className="flex justify-center" mb={4}>
            <img src={logo} alt="Logo" style={{ width: "150px" }} />
          </Box>
          <Box textAlign="center" mb={2}>
            <Typography variant="h5" component="h1" gutterBottom>
              Welcome to Safe Place
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please take a moment to complete your account
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              id="email"
              label="Email Address"
              variant="outlined"
              type="email"
              fullWidth
              value={email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4e8e9b",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2c6975",
                  },
                },
              }}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              margin="normal"
              required
            />
            <Box
              textAlign="right"
              mt={1}
              sx={{
                ":hover": {
                  color: "#2C6975",
                },
              }}
            >
              <Link to="/forgot-password">Forgot Password?</Link>
            </Box>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4e8e9b",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2c6975",
                  },
                },
              }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              margin="normal"
              required
            />

            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#2C6975",
                    "& .MuiSvgIcon-root": {
                      fontSize: 28,
                    },
                    "& .MuiCheckbox-root": {
                      borderColor: "#4e8e9b",
                    },
                    "& .Mui-checked": {
                      color: "#4e8e9b",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    "& .MuiCheckbox-root.Mui-checked": {
                      backgroundColor: "#2c6975",
                    },
                  }}
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
              }
              label="Remember password"
            />
          </Box>
        </DialogContent>
        <DialogActions className="flex flex-col">
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "20%",
              backgroundColor: "#4e8e9b",
              "&:hover": { backgroundColor: "#2c6975" },
            }}
            disabled={isButtonDisabled}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Don{"'"}t have an account?{" "}
              <Button onClick={handleOpenRegisterModal}>Sign Up</Button>
            </Typography>
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginModal;
