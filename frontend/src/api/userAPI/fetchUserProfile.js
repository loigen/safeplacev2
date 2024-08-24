import axios from "axios";
import Swal from "sweetalert2";

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      { withCredentials: true } // Only include this if you need to override axiosInstance's default
    );
    return response.data.user; // Ensure this matches your API's response structure
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load user profile. Please try again later.",
    });
    console.error("Error fetching profile:", error);

    throw error; // Ensure the calling function is handling this thrown error
  }
};
