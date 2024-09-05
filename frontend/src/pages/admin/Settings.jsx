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
      case "Rates and Review":
        return <RatesandReview setView={setView} />;
      case "Help":
        return <Help setView={setView} />;
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
                        <Typography variant="h6" component="div">
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
                    <Button
                      startIcon={<GroupsOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("manage")}
                      sx={{ mb: 1 }}
                    >
                      Manage Users
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
                      startIcon={<StarBorderOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("Rates and Review")}
                      sx={{ mb: 1 }}
                    >
                      Rates and Review
                    </Button>
                    <Button
                      startIcon={<QuestionMarkOutlinedIcon />}
                      fullWidth
                      onClick={() => setView("Help")}
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

  return <div>{renderView()}</div>;
};

export default AdminSettings;
