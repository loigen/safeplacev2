import React, { useState } from "react";
import Swal from "sweetalert2";
import { LoadingSpinner } from "../custom";
import { useAuth } from "../../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
  Input,
  Paper,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#2c6975",
  "&:hover": {
    backgroundColor: "#1e4d54",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#d9534f",
  "&:hover": {
    backgroundColor: "#c9302c",
  },
}));

const Profile = ({ setView }) => {
  const { user, loading, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(
    user?.profilePicture ||
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
  );
  const [localFile, setLocalFile] = useState(null);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    role: user?.role || "",
  });
  const [saving, setSaving] = useState(false);
  const [fileInputId] = useState("profile-picture-upload");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please upload a photo in JPEG, JPG, or PNG format.",
        });
        setLocalFile(null);
        return;
      }

      setLocalFile(file);
      const objectURL = URL.createObjectURL(file);
      setAvatar(objectURL);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    return formData.firstname.trim() !== "" && formData.lastname.trim() !== "";
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      setError("First name and last name cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const formPayload = new FormData();
      formPayload.append("firstname", formData.firstname);
      formPayload.append("lastname", formData.lastname);
      formPayload.append("email", formData.email);
      formPayload.append("role", formData.role);

      if (localFile) {
        formPayload.append("profile_picture", localFile);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/updateprofile`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      await fetchUserProfile();

      setIsEditing(false);
      setLocalFile(null);
      URL.revokeObjectURL(avatar);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated!",
        willClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      setError("Error updating profile.");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });
    setAvatar(user.profilePicture);
    setLocalFile(null);
  };

  const handleAvatarClick = () => {
    document.getElementById(fileInputId).click();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Typography
          onClick={() => setView("settings")}
          className="text-black"
          style={{ cursor: "pointer", marginBottom: "1rem" }}
        >
          <Tooltip title="Back to settings" arrow>
            <ArrowBackIcon />
          </Tooltip>
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Box
            position="relative"
            onClick={isEditing ? handleAvatarClick : undefined}
            sx={{ cursor: isEditing ? "pointer" : "default" }}
          >
            <Avatar
              src={avatar}
              sx={{ width: 120, height: 120, mb: 2, boxShadow: 3 }}
            />

            {isEditing && (
              <AddCircleIcon
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  fontSize: 40,
                  color: "#2c6975",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  border: "2px solid #2c6975",
                  padding: 1,
                }}
              />
            )}
            <Input
              id={fileInputId}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              sx={{ display: "none" }}
            />
          </Box>
          <Typography
            fontSize={20}
            textTransform="capitalize"
            fontWeight="bold"
          >
            {user.firstname} {user.lastname}
          </Typography>
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#4e8e9b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2c6975",
                },
              },
            }}
          />
          <TextField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#4e8e9b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2c6975",
                },
              },
            }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#4e8e9b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2c6975",
                },
              },
            }}
          />
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#4e8e9b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2c6975",
                },
              },
            }}
          />
          <Box mt={2} display="flex" justifyContent="right" gap={1}>
            {isEditing ? (
              <>
                <PrimaryButton
                  variant="contained"
                  onClick={handleSaveChanges}
                  disabled={!validateForm() || saving}
                >
                  {saving ? <CircularProgress size={24} /> : "Save Changes"}
                </PrimaryButton>
                <SecondaryButton variant="contained" onClick={handleCancel}>
                  Cancel
                </SecondaryButton>
              </>
            ) : (
              <PrimaryButton
                variant="contained"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </PrimaryButton>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
