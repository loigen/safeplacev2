import Swal from "sweetalert2";
import axiosInstance from "../../../config/axiosConfig";
export const createFolder = async (patientId, folderName) => {
  try {
    await axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/Appointments/api/folders`,
      {
        patientId,
        folderName,
      }
    );
    Swal.fire("Success", "Folder created successfully", "success");
  } catch (error) {
    console.error("Error creating folder:", error);
    Swal.fire("Error", "Failed to create folder", "error");
    throw error;
  }
};
