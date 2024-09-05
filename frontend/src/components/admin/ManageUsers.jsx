import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getUsers,
  blockUser,
  unblockUser,
} from "../../api/manageUsers/userService";

const ManageUsers = ({ setView }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getUsers(token);
        setUsers(response.data.users);
      } catch (err) {
        setError(
          "Error fetching users: " + (err.response?.data?.error || err.message)
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load users.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem("token");
      await blockUser(userId, token);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: "blocked" } : user
        )
      );
      Swal.fire({
        icon: "success",
        title: "User Blocked",
        text: "The user has been successfully blocked.",
      });
    } catch (err) {
      setError(
        "Error blocking user: " + (err.response?.data?.error || err.message)
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to block user.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem("token");
      await unblockUser(userId, token);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: "active" } : user
        )
      );
      Swal.fire({
        icon: "success",
        title: "User Unblocked",
        text: "The user has been successfully unblocked.",
      });
    } catch (err) {
      setError(
        "Error unblocking user: " + (err.response?.data?.error || err.message)
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to unblock user.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 5 }}>
      <IconButton onClick={() => setView("settings")}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Manage Users
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  {user.firstname} {user.lastname}
                </TableCell>
                <TableCell>{user.sex}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor:
                        user.status === "active" ? "green" : "red",
                      color: "white",
                      borderRadius: 1,
                      padding: 1,
                      textAlign: "center",
                    }}
                  >
                    {user.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {user.status === "active" ? (
                      <Button
                        onClick={() => handleBlock(user._id)}
                        variant="contained"
                        color="error"
                        fullWidth
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? "Blocking..." : "Block"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUnblock(user._id)}
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id
                          ? "Unblocking..."
                          : "Unblock"}
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageUsers;
