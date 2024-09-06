import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
  Box,
  Divider,
  Link,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import EmailIcon from "@mui/icons-material/Email";
import { Profile } from "../../components/client";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ReviewsIcon from "@mui/icons-material/Reviews";
import {
  ChangePasswordForm,
  UserGuide,
  LoadingSpinner,
  FAQs,
} from "../../components/custom";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import FeedbackPage from "../../components/custom/FeedbackPage";

const UserSettings = () => {
  const { user } = useAuth();
  const [view, setView] = useState("settings");

  if (!user) {
    return <LoadingSpinner />;
  }

  const renderView = () => {
    switch (view) {
      case "profile":
        return <Profile setView={setView} />;
      case "Security":
        return <ChangePasswordForm setView={setView} />;
      case "UserGuide":
        return <UserGuide setView={setView} />;
      case "FAQs":
        return <FAQs setView={setView} />;
      case "feedback":
        return <FeedbackPage setView={setView} />;

      default:
        return (
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={10}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        src={user.profilePicture}
                        alt="Profile"
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                      <Box>
                        <Typography textTransform="capitalize" variant="h6">
                          {user.firstname} {user.lastname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle1"
                      textAlign="center"
                      gutterBottom
                      color="GrayText"
                    >
                      Account Settings
                    </Typography>
                    <Button
                      startIcon={<AccountCircleOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("profile")}
                      sx={{ mb: 1, color: "#2C6975" }}
                    >
                      My Profile
                    </Button>
                    <Button
                      startIcon={<LockOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("Security")}
                      sx={{ mb: 1, color: "#2C6975" }}
                    >
                      Password & Security
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={10}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="GrayText"
                      gutterBottom
                    >
                      More
                    </Typography>
                    <Button
                      startIcon={<LocalLibraryIcon />}
                      fullWidth
                      onClick={() => setView("UserGuide")}
                      sx={{ mb: 1, color: "#2C6975" }}
                    >
                      User Guide
                    </Button>
                    <Button
                      startIcon={<PrivacyTipIcon />}
                      fullWidth
                      onClick={() => setView("UserGuide")}
                      sx={{ mb: 1, color: "#2C6975" }}
                    >
                      Privacy Policy
                    </Button>
                    <Button
                      startIcon={<ReviewsIcon />}
                      fullWidth
                      onClick={() => setView("feedback")}
                      sx={{ mb: 1, color: "#2C6975" }}
                    >
                      Rates & Review
                    </Button>
                    <NavLink to="/contactSupport" underline="none">
                      <Button
                        startIcon={<EmailIcon />}
                        fullWidth
                        sx={{ mb: 1, color: "#2C6975" }}
                      >
                        Contact Support
                      </Button>
                    </NavLink>
                    <Button
                      startIcon={<QuestionMarkOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("FAQs")}
                      sx={{ color: "#2C6975" }}
                    >
                      FAQs
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        );
    }
  };

  return <div>{renderView()}</div>;
};

export default UserSettings;
