import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Count free slots
export const countFreeSlots = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/schedules/count-free`
    );
    return response.data.count;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error counting free slots. Please try again later.",
    });
    throw error;
  }
};

// Count pending slots
export const countPendingSlots = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/schedules/count-pending`
    );
    return response.data.count;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error counting pending slots. Please try again later.",
    });
    throw error;
  }
};
