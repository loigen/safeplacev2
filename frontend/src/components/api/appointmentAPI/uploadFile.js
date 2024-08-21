import axios from "axios";
import Swal from "sweetalert2";
export const uploadFile = async (patientId, folderIndex, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patientId", patientId);
  formData.append("folderIndex", folderIndex);

  try {
    await axios.post(
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
