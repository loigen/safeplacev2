import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getUsers,
  blockUser,
  unblockUser,
} from "../../api/manageUsers/userService";

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
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#2C6975] text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Sex</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-700 hover:bg-[#2C6975] hover:bg-opacity-40 transition-colors"
              >
                <td className="py-3 px-6">
                  {user.firstname} {user.lastname}
                </td>
                <td className="py-3 px-6">{user.sex}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">
                  <span
                    className={`py-1 px-3 rounded-full text-xs ${
                      user.status === "active"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-6">
                  {user.status === "active" ? (
                    <button
                      onClick={() => handleBlock(user._id)}
                      disabled={actionLoading === user._id}
                      className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === user._id ? "Blocking..." : "Block"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(user._id)}
                      disabled={actionLoading === user._id}
                      className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default ManageUsers;
