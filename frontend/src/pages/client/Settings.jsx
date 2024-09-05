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
import SettingsIcon from "@mui/icons-material/Settings";
import { Profile } from "../../components/client";
import {
  ChangePasswordForm,
  UserGuide,
  LoadingSpinner,
  FAQs,
} from "../../components/custom";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";

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
      default:
        return (
          <Container maxWidth="md" sx={{ py: 4 }}>
            <IconButton onClick={() => setView("settings")} sx={{ mb: 2 }}>
              <SettingsIcon color="primary" />
            </IconButton>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        src={user.profilePicture}
                        alt="Profile"
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">
                          {user.firstname} {user.lastname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Account Settings
                    </Typography>
                    <Button
                      startIcon={<AccountCircleOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("profile")}
                      sx={{ mb: 1 }}
                    >
                      My Profile
                    </Button>
                    <Button
                      startIcon={<LockOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("Security")}
                      sx={{ mb: 1 }}
                    >
                      Password and Security
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      More
                    </Typography>
                    <Button
                      startIcon={<LocalLibraryIcon />}
                      fullWidth
                      onClick={() => setView("UserGuide")}
                      sx={{ mb: 1 }}
                    >
                      User Guide
                    </Button>
                    <NavLink to="/contactSupport" underline="none">
                      <Button
                        startIcon={<EmailIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Contact Support
                      </Button>
                    </NavLink>
                    <Button
                      startIcon={<QuestionMarkOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("FAQs")}
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
