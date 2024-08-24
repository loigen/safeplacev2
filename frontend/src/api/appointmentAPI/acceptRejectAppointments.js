import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";

export const acceptAppointment = async (id) => {
  try {
    await axiosInstance.patch(
      `${process.env.REACT_APP_API_URL}/Appointments/api/accept/${id}`
    );
    Swal.fire("Success", "Appointment accepted successfully", "success");
  } catch (error) {
    console.error("Error accepting appointment:", error);
    Swal.fire("Error", "Failed to accept the appointment", "error");
    throw error;
  }
};

export const rejectAppointment = async (id) => {
  try {
    await axiosInstance.patch(
      `${process.env.REACT_APP_API_URL}/Appointments/api/reject/${id}`
    );
    Swal.fire("Success", "Appointment rejected successfully", "success");
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    Swal.fire("Error", "Failed to reject the appointment", "error");
    throw error;
  }
};
