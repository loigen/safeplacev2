import Swal from "sweetalert2";
import axios from "axios";
//get list of patients

export const fetchPatients = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/data`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    Swal.fire("Error", "Failed to fetch patient data", "error");
    throw error;
  }
};
