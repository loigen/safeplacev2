import React, { useEffect, useState } from "react";
import { fetchPatients } from "../api/appointmentAPI/fetchPatients";
import LoadingSpinner from "./LoadingSpinner";

const AppointmentStats = () => {
  const [appointments, setAppointments] = useState({
    pending: [],
    accepted: [],
    completed: [],
    canceled: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("Week");

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const data = await fetchPatients(dateRange);

        const categorizedAppointments = {
          pending: data.filter((app) => app.status === "pending"),
          accepted: data.filter((app) => app.status === "accepted"),
          completed: data.filter((app) => app.status === "completed"),
          canceled: data.filter((app) => app.status === "canceled"),
        };

        setAppointments(categorizedAppointments);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch appointment data");
        setLoading(false);
      }
    };

    getAppointments();
  }, [dateRange]);

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const renderAvatars = (appointments) => {
    return appointments.slice(0, 5).map((appointment, index) => (
      <div key={index} className="avatar">
        <img
          src={appointment.avatar}
          alt="Profile"
          style={{ width: "40px", height: "40px", border: "3px solid gray" }} // Custom size
          className="rounded-full"
        />
      </div>
    ));
  };

  const renderStatusSection = (status) => {
    const count = appointments[status].length;
    return (
      <div key={status} className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2 capitalize">{status}</h3>
        {count > 0 ? (
          <div className="flex flex-col gap-2 items-start mb-2">
            <div className="flex space-x-2 overflow-x-auto">
              {renderAvatars(appointments[status])}
            </div>
            <div className="ml-2">
              <p className="text-lg font-semibold">
                <b className="text-gray-900">{count}</b>{" "}
                <span className=" capitalize text-gray-700">
                  {status} Appointments
                </span>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No appointments</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:w-1/3 lg:w-1/4">
      <div className="flex flex-row flex-wrap justify-between items-center">
        <h2 className="text-md w-full font-bold mb-4 uppercase font-mono">
          Appointment Stats
        </h2>
        <div className="mb-4 w-full flex justify-between items-center flex-row">
          <label
            htmlFor="date-range"
            className="block mb-2 text-sm font-medium"
          >
            Data Range
          </label>
          <select
            id="date-range"
            value={dateRange}
            onChange={handleDateRangeChange}
            className="block w-[50%] p-2 border border-gray-300 rounded outline-none"
          >
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {["pending", "accepted", "completed", "canceled"].map(
          renderStatusSection
        )}
      </div>
    </div>
  );
};

export default AppointmentStats;
