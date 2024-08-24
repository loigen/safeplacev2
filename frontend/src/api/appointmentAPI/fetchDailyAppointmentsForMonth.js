import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";

export const fetchDailyAppointmentsForMonth = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/dailyforMonth`
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching monthly appointments. Please try again later.",
    });
    throw error;
  }
};
