import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import "../../styles/Home.css";

import WorkloadChart from "../custom/chart";
import AppointmentRequest from "../custom/Appointment.request";

const getRateClass = (rate) => {
  return rate < 0 ? "bg-red-400" : "bg-green-200";
};
const Home = () => {
  const patientRate = 10;
  const appointmentRate = -3;
  return (
    <div className="home h-lvh px-2">
      <div className="sort flex flex-row justify-between w-full p-10">
        <div></div>
        <div className="flex flex-row gap-3 items-center">
          <p>Data Range</p>
          <select
            name=""
            id=""
            className="border border-black rounded-md px-2 py-1 outline-0"
          >
            <option value="">Week</option>
            <option value="">Month</option>
            <option value="">Year</option>
          </select>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col  w-1/2 gap-10">
          <div className="flex flex-row gap-12">
            <div className="w-full shadow-xl p-2 rounded-md">
              <div className="flex justify-end w-full">
                <p
                  className={`rate px-2 rounded-md ${getRateClass(
                    patientRate
                  )}`}
                >
                  {patientRate > 0 ? `+${patientRate}%` : `${patientRate}%`}
                </p>
              </div>
              <div className="flex flex-row gap-3 px-10 items-center">
                <div className="iconContainer">
                  <PersonIcon id="icons" />
                </div>
                <div className="flex justify-items-center flex-col">
                  <b className="num text-5xl">80</b>
                  <p className="text-2xl capitalize">patients</p>
                </div>
              </div>
            </div>
            <div className="w-full shadow-xl p-2 rounded-md">
              <div className="flex justify-end w-full">
                <p
                  className={`rate px-2 rounded-md ${getRateClass(
                    appointmentRate
                  )}`}
                >
                  {appointmentRate > 0
                    ? `+${appointmentRate}%`
                    : `${appointmentRate}%`}
                </p>
              </div>
              <div className="flex flex-row gap-3 px-10 items-center">
                <div className="iconContainer health">
                  <MedicalServicesIcon id="icons" />
                </div>
                <div>
                  <b className="text-5xl">5</b>
                  <p>Weekly Appointment</p>
                </div>
              </div>
            </div>
          </div>
          <div className="workload">
            <p style={{ paddingLeft: "3%", fontWeight: "bold" }}>Workload</p>
            <div className="graph">
              <WorkloadChart />
            </div>
          </div>
          <div className="appointments w-full">
            <p>Appointment Request</p>
            <AppointmentRequest />
          </div>
        </div>
        <div className="flex w-1/2"></div>
      </div>
    </div>
  );
};

export default Home;
