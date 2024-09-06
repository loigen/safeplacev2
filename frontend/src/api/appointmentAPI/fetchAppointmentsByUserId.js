import axios from "axios";

//get all appointments based on user's ID
export const fetchAppointmentsByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/myAppointment/${userId}`
    );
    return response.data.appointments;
  } catch (error) {
    throw error;
  }
};
