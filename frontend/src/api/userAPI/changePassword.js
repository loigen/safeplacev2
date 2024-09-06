import axios from "axios";

//chanspas jpg
export const changePassword = async (currentPassword, newPassword, token) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/changepassword`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error.response?.data || { error: "Failed to change password" };
  }
};
