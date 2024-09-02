import Swal from "sweetalert2";

//get the datas of patients

export const getPatientData = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/Appointments/api/data`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching patient data. Please try again later.",
    });
    throw error;
  }
};
