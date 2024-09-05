import React from "react";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import useHighestWeeklyAppointments from "../../api/appointmentAPI/useHighestWeeklyAppointments";
import { LoadingSpinner } from "./index";

const HighestWeeklyAppointments = () => {
  // Properly call the hook
  const { data, loading, error } = useHighestWeeklyAppointments();

  if (loading) return <LoadingSpinner />;

  if (error) return <p>Error loading data: {error.message}</p>;

  if (!data || !data.count) {
    return (
      <div className="flex flex-row w-full gap-3 px-10 items-center">
        <div className="iconContainer health">
          <MedicalServicesIcon id="icons" />
        </div>
        <div className="flex w-full flex-col">
          <p className="flex items-center justify-center h-full w-fit text-left text-2xl">
            No data
          </p>
          <p>Weekly Appointment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-2 rounded-md flex justify-center items-center">
      <div className="flex flex-row gap-3 justify-center  items-center w-full">
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
