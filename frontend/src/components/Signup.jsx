import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../config/axiosConfig";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SignupModal = ({ open, onClose, handleOpenLoginModal }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sex, setSex] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [agreement, setAgreement] = useState(false);
  const [step, setStep] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (step === 1) {
      if (
        firstname.trim() &&
        lastname.trim() &&
        middleName.trim() &&
        birthdate.trim() &&
        sex
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    } else if (step === 2) {
      if (
        email.trim() &&
        password.trim() &&
        repeatPassword.trim() &&
        agreement
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }
  }, [
    step,
    firstname,
    lastname,
    middleName,
    birthdate,
    sex,
    email,
    password,
    repeatPassword,
    agreement,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/auth/signup",
        {
          firstname,
          lastname,
          middleName,
          email,
          password,
          repeatPassword,
          birthdate,
          sex,
        }
      );

      if (response.status === 201) {
        Swal.fire("Success", "Account created successfully", "success");
        onClose();
      } else {
        setError("Failed to create account");
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        setSnackbarOpen(true);
      } else {
        setError("An unexpected error occurred");
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle className="flex gap-2 items-center">
          <ArrowBackIcon
            onClick={handleOpenLoginModal}
            sx={{
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "#2C6975",
            }}
          />
          <Typography variant="h6" component="span">
            {step === 1 ? "Personal Information" : "Account Details"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {step === 1 && (
              <Box>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#4e8e9b",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c6975",
                      },
                    },
                  }}
                  label="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#4e8e9b",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c6975",
                      },
                    },
                  }}
                  label="Middle Name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#4e8e9b",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c6975",
                      },
                    },
                  }}
                  label="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#4e8e9b",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c6975",
                      },
                    },
                  }}
                  label="Birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl
                  component="fieldset"
                  margin="normal"
                  required
                  fullWidth
                >
                  <RadioGroup
                    row
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isButtonDisabled}
                  variant="contained"
                  color="primary"
                >
                  Next
                </Button>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Repeat Password"
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Box display="flex" alignItems="center" marginY={2}>
                  <Checkbox
                    checked={agreement}
                    onChange={() => setAgreement(!agreement)}
                  />
                  <Typography variant="body2">
                    I agree to the Terms of Use and Privacy Policy
                  </Typography>
                </Box>
                <Button
                  type="button"
                  onClick={handlePrev}
                  variant="outlined"
                  color="primary"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  disabled={isButtonDisabled}
                  variant="contained"
                  color="primary"
                  sx={{ marginLeft: 2 }}
                >
                  {loading ? "Signing up..." : "Create Account"}
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
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

export default SignupModal;
