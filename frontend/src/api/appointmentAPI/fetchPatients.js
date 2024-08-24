import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";

export const fetchPatients = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/data`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    Swal.fire("Error", "Failed to fetch patient data", "error");
    throw error;
  }
};
