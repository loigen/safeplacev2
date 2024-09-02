import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";

//get toda's appointments

export const fetchTodaysAppointments = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/today`
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching Today's appointments. Please try again later.",
    });
    throw error;
  }
};
