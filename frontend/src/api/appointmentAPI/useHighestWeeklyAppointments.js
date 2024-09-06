import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

//get the highest appointments for all the week passed

const useHighestWeeklyAppointments = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/Appointments/api/highest-weekly`
        );
        setData(response.data);
      } catch (err) {
        setError(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error fetching the highest weekly appointments. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useHighestWeeklyAppointments;
