import Swal from "sweetalert2";
import axiosInstance from "../../../config/axiosConfig";
export const fetchAvailableSlots = async () => {
  try {
    const response = await axiosInstance.get(
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
