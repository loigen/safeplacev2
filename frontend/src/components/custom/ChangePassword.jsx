import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { changePassword } from "../../api/userAPI/changePassword";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const blockTime = localStorage.getItem("blockTime");
    const lastChangeTime = localStorage.getItem("lastChangeTime");
    const currentTime = Date.now();

    if (blockTime) {
      const timeDifference = currentTime - blockTime;
      if (timeDifference < 86400000) {
        setIsBlocked(true);
        Swal.fire({
          title: "Blocked!",
          text: "You have been blocked from changing the password for 24 hours due to multiple incorrect attempts.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        localStorage.removeItem("blockTime");
      }
    }

    if (lastChangeTime) {
      const timeDifference = currentTime - lastChangeTime;
      if (timeDifference < 86400000) {
        setIsDisabled(true);
        Swal.fire({
          title: "Please wait!",
          text: "You have recently changed your password. You need to wait 24 hours before changing it again.",
          icon: "info",
          confirmButtonText: "OK",
        });
      } else {
        localStorage.removeItem("lastChangeTime");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      Swal.fire({
        title: "Blocked!",
        text: "You are blocked from changing the password.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (isDisabled) {
      Swal.fire({
        title: "Please wait!",
        text: "You cannot change the password at this time.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "New passwords don't match. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        // Clear the new password and confirm password fields
        setNewPassword("");
        setConfirmPassword("");
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await changePassword(
        currentPassword,
        newPassword,
        token
      );

      Swal.fire({
        title: "Success",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      });

      setIncorrectAttempts(0);
      setIsDisabled(true);

      // Update the last change time in localStorage
      const currentTime = Date.now();
      localStorage.setItem("lastChangeTime", currentTime);

      // Clear the current password field
      setCurrentPassword("");
    } catch (err) {
      const newAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newAttempts);

      Swal.fire({
        title: "Error",
        text: err.error || "Failed to change password.",
        icon: "error",
        confirmButtonText: "OK",
      });

      if (newAttempts >= 3) {
        const blockTime = Date.now();
        localStorage.setItem("blockTime", blockTime);
        setIsBlocked(true);

        Swal.fire({
          title: "Blocked!",
          text: "You have been blocked from changing the password for 24 hours due to multiple incorrect attempts.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          disabled={isBlocked || isDisabled}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isBlocked || isDisabled}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isBlocked || isDisabled}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        disabled={isBlocked || isDisabled}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Change Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;
