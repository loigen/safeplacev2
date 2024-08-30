import axios from "axios";
import Swal from "sweetalert2";

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      { withCredentials: true }
    );
    return response.data.user;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load user profile. Please try again later.",
    });
    console.error("Error fetching profile:", error);

    throw error;
  }
};
