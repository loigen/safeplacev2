import axios from "axios";
import Swal from "sweetalert2";
export const fetchAvailableSlots = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/schedules/slots`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load available slots.",
    });
    console.error("Error fetching available slots:", error);
    throw error;
  }
};
