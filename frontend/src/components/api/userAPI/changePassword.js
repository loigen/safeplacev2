import axiosInstance from "../../../config/axiosConfig";

export const changePassword = async (currentPassword, newPassword, token) => {
  try {
    const response = await axiosInstance.post(
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
