import axios from "axios";
import Swal from "sweetalert2";

export const fetchDailyAppointmentsForYear = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/yearly`
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching Yearly appointments. Please try again later.",
    });
    throw error;
  }
};
