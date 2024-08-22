import React from "react";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import useHighestWeeklyAppointments from "../api/appointmentAPI/useHighestWeeklyAppointments";
import LoadingSpinner from "./LoadingSpinner";

const HighestWeeklyAppointments = () => {
  const { data, loading, error } = useHighestWeeklyAppointments;

  if (loading) return <LoadingSpinner />;

  if (error) return <p>Error loading data: {error.message}</p>;

  if (!data)
    return (
      <div className="flex flex-row gap-3 px-10 items-center">
        <div className="iconContainer health">
          <MedicalServicesIcon id="icons" />
        </div>
        <div className="flex items-center justify-center flex-col py-8">
          <p className="flex items-center justify-center h-full text-2xl">
            No data available
          </p>
          <p>Appointment of the Week</p>
        </div>
      </div>
    );

  return (
    <div className="w-full bg-white  p-2 rounded-md">
      <div className="flex flex-row gap-3 px-10 items-center">
        <div className="iconContainer health">
          <MedicalServicesIcon id="icons" />
        </div>
        <div>
          <b className="text-5xl">{data.count}</b>
          <p>Appointment of the Week</p>
        </div>
      </div>
    </div>
  );
};

export default HighestWeeklyAppointments;
