import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";

//get the daily appointments number
export const fetchDailyAppointments = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/daily`
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching daily appointments. Please try again later.",
    });
    throw error;
  }
};
