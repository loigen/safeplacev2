// src/components/ManageUsers.js

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getUsers,
  blockUser,
  unblockUser,
} from "../api/manageUsers/userService";

const ManageUsers = () => {
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

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sex</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {user.firstname} {user.lastname}
              </td>
              <td>{user.sex}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                {user.status === "active" ? (
                  <button
                    onClick={() => handleBlock(user._id)}
                    disabled={actionLoading === user._id}
                  >
                    {actionLoading === user._id ? "Blocking..." : "Block"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnblock(user._id)}
                    disabled={actionLoading === user._id}
                  >
                    {actionLoading === user._id ? "Unblocking..." : "Unblock"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
