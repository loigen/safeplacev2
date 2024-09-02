import React, { useState, useEffect } from "react";
import { fetchAppointmentsByUserId } from "../../api/appointmentAPI/fetchAppointmentsByUserId";
import axiosInstance from "../../config/axiosConfig";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        setError("Error fetching profile.");
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const getAppointments = async () => {
      if (!user) return;
      try {
        const data = await fetchAppointmentsByUserId(user._id);

        const today = new Date().setHours(0, 0, 0, 0);

        const filteredAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.date).setHours(
            0,
            0,
            0,
            0
          );
          return (
            (appointment.status === "pending" ||
              appointment.status === "accepted") &&
            appointmentDate >= today
          );
        });

        const sortedAppointments = filteredAppointments.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        setAppointments(sortedAppointments);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-1/4 shadow-2xl h-full p-5 flex flex-col gap-5 bg-white rounded-lg">
      <h2 className="font-bold font-mono text-gray-500 text-lg">
        My Appointments
      </h2>
      <div className="w-full">
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="flex flex-col gap-5 w-full ">
            {appointments.map((appointment) => {
              const statusBgColor =
                appointment.status === "pending"
                  ? "bg-orange-500"
                  : "bg-[#2C6975]";

              return (
                <li
                  key={appointment._id}
                  style={{ borderLeft: "5px solid #2C6975" }}
                  className="shadow-2xl w-full rounded-md p-2"
                >
                  <div className="w-full flex justify-end ">
                    <p className={`p-1 text-slate-50 rounded ${statusBgColor}`}>
                      {appointment.status}
                    </p>
                  </div>
                  <div className="capitalize">
                    {appointment.appointmentType}
                  </div>
                  <div className="flex flex-row gap-2">
                    <p>{new Date(appointment.date).toLocaleDateString()},</p>
                    {appointment.time}
                  </div>
                  {appointment.meetLink && (
                    <div className="flex justify-end">
                      <a
                        className="bg-[#2C6975] text-white py-2 px-5 font-bold rounded-md"
                        href={appointment.meetLink}
                      >
                        Go to Room
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Appointments;
