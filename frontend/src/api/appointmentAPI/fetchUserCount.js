import axios from "axios";
import Swal from "sweetalert2";

//get the total number of users

export const fetchUserCount = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/countNonAdminUsers`
    );
    return response.data.count;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching user account. Please try again later.",
    });
    throw error;
  }
};
