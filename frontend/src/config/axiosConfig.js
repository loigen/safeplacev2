import axios from "axios";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.message === "Token expired"
    ) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Your session has expired. You will be logged out.",
      }).then(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
