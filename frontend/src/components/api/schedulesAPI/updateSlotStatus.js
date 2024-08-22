import Swal from "sweetalert2";
import axiosInstance from "../../../config/axiosConfig";

export const updateSlotStatus = async (slotId, status) => {
  try {
    const response = await axiosInstance.patch(
      `${process.env.REACT_APP_API_URL}/schedules/slots/${slotId}`,
      { status },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update slot status.",
    });
    console.error("Error updating slot status:", error);
    throw error;
  }
};
