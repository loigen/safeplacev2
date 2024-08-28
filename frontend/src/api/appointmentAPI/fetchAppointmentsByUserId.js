import axiosInstance from "../../config/axiosConfig";

export const fetchAppointmentsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_API_URL}/Appointments/api/myAppointment/${userId}`
    );
    return response.data.appointments;
  } catch (error) {}
};
