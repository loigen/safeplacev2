import Swal from "sweetalert2";
import axios from "axios";

//get the number of appointments monthly
export const fetchDailyAppointmentsForMonth = async () => {
  try {
    const response = await axios.get(
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
