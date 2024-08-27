import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";

export const fetchCancellationRate = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/cancellation-rate`
    );
    return response.data.cancellationRate;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching the cancellation rate. Please try again later.",
    });
    throw error;
  }
};