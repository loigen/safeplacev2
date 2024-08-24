import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/Appointments/api/appointments`,
      appointmentData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating appointment:", error.response || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to create appointment.",
    });
    throw error;
  }
};
