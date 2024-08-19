// HighestWeeklyAppointments.js
import React from "react";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import useHighestWeeklyAppointments from "../api/useHighestWeeklyAppointments";

const HighestWeeklyAppointments = () => {
  const { data, loading, error } = useHighestWeeklyAppointments();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error loading data: {error.message}</p>;

  if (!data) return <p>No data available</p>;

  return (
    <div className="w-full bg-white  p-2 rounded-md">
      <div className="flex flex-row gap-3 px-10 items-center">
        <div className="iconContainer health">
          <MedicalServicesIcon id="icons" />
        </div>
        <div>
          <b className="text-5xl">{data.count}</b>
          <p>Weekly Appointment</p>
        </div>
      </div>
    </div>
  );
};

export default HighestWeeklyAppointments;
