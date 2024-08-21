import axios from "axios";
import Swal from "sweetalert2";

export const fetchDailyCancelAppointments = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/dailyCancel`
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching daily canceled appointments. Please try again later.",
    });
    throw error;
  }
};
