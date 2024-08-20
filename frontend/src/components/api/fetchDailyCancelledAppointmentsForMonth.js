import axios from "axios";

// api.js
export const fetchDailyCancelAppointments = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/dailyCancelforMonth`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching daily appointments:", error);
    throw error;
  }
};
