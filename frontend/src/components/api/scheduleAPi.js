import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL; // Using environment variable

// Count free slots
export const countFreeSlots = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules/count-free`);
    return response.data.count;
  } catch (error) {
    console.error("Error counting free slots:", error);
    throw error;
  }
};

// Count pending slots
export const countPendingSlots = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules/count-pending`);
    return response.data.count;
  } catch (error) {
    console.error("Error counting pending slots:", error);
    throw error;
  }
};
