import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import {
  RatesandReview,
  ChangePasswordForm,
  LoadingSpinner,
  Help,
} from "../../components/custom";
import { Profile, ManageUsers } from "../../components/admin";
import { useAuth } from "../../context/AuthContext";
import FeedbackList from "../../components/custom/FeedbackList";

const AdminSettings = () => {
  const [view, setView] = useState("settings");
  const { user } = useAuth();

  if (!user) {
    return <LoadingSpinner />;
  }

  const renderView = () => {
    switch (view) {
      case "profile":
        return <Profile setView={setView} />;
      case "Security":
        return <ChangePasswordForm setView={setView} />;
      case "manage":
        return <ManageUsers setView={setView} />;

      case "Help":
        return <Help setView={setView} />;
      case "userFeedback":
        return <FeedbackList />;
      default:
        return (
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Grid container spacing={2}>
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
                        <Typography variant="h6" component="div">
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
                    <Button
                      startIcon={<GroupsOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("manage")}
                      sx={{ mb: 1, color: "#2C6975" }}
                    >
                      Manage Users
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={10}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      color="GrayText"
                    >
                      More
                    </Typography>

                    <Button
                      startIcon={<SettingsIcon />}
                      fullWidth
                      onClick={() => setView("userFeedback")}
                      sx={{ color: "#2C6975" }}
                    >
                      User Feedback
                    </Button>

                    <Button
                      startIcon={<QuestionMarkOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("Help")}
                      sx={{ mb: 1, color: "#2C6975" }}
                    >
                      Help
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        );
    }
  };

  return <div className="h-full pt-10">{renderView()}</div>;
};

export default AdminSettings;
