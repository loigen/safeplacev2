import axios from "axios";
import Swal from "sweetalert2";

export const updateSlotStatus = async (slotId, status) => {
  try {
    const response = await axios.patch(
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
