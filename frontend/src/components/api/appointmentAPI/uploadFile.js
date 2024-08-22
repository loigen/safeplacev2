import Swal from "sweetalert2";
import axiosInstance from "../../../config/axiosConfig";
export const uploadFile = async (patientId, folderIndex, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patientId", patientId);
  formData.append("folderIndex", folderIndex);

  try {
    await axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/Appointments/api/files`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    Swal.fire("Success", "File uploaded successfully", "success");
  } catch (error) {
    console.error("Error uploading file:", error);
    Swal.fire("Error", "Failed to upload file", "error");
    throw error;
  }
};
