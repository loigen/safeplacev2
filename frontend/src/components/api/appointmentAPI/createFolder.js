import axios from "axios";
import Swal from "sweetalert2";
export const createFolder = async (patientId, folderName) => {
  try {
    await axios.post(
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
