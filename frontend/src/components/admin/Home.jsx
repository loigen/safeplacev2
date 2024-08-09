import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import { FaSearch, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";

import "../../styles/Home.css";

import WorkloadChart from "../custom/chart";
import AppointmentRequest from "../custom/Appointment.request";
import AvailabilityCard from "../custom/AvailabilityCard";

const getRateClass = (rate) => {
  return rate < 0 ? "bg-red-400" : "bg-green-200";
};

const Home = () => {
  const patientRate = 10;
  const appointmentRate = -3;

  const todaysAppointments = [
    {
      id: 1,
      date: "2024-08-08",
      time: "10:00 AM",
      firstName: "John",
      lastName: "Doe",
      type: "Consultation",
    },
    // Add more appointments if needed
  ];

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
      <div className="w-full flex flex-row gap-10">
        <div className="flex flex-col w-1/2 gap-10">
          <div className="flex flex-row gap-12">
            <div className="w-full shadow-xl p-2 rounded-md bg-white">
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
            <div className="w-full bg-white shadow-xl p-2 rounded-md">
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
          <div className="workload bg-white">
            <p style={{ paddingLeft: "3%", fontWeight: "bold" }}>Workload</p>
            <div className="graph">
              <WorkloadChart />
            </div>
          </div>
          <div className="appointments w-full bg-white p-2">
            <p className="font-bold px-4">Appointment Request</p>
            <AppointmentRequest />
          </div>
        </div>
        <div className="flex w-1/2 flex-col gap-10">
          <div className="rating flex flex-row w-full items-center justify-evenly gap-8 px-4 ">
            <div className="shadow-2xl w-1/2 p-8 rounded-lg bg-white flex flex-row">
              <div className="w-1/6">
                <EqualizerOutlinedIcon
                  style={{ fontSize: "3rem", color: "#00A8E8" }}
                />
              </div>
              <div>
                <p className="font-extrabold text-3xl">30%</p>
                <p className="subTitle">Conversion Rate</p>
              </div>
            </div>
            <div className="shadow-2xl w-1/2 p-8 rounded-lg bg-white flex flex-row gap-2">
              <div className="w-1/6 flex items-center justify-center bg-red-300 rounded-md">
                <FaTimes className="text-3xl text-red-600 font-normal" />
              </div>
              <div>
                <p className="font-extrabold text-3xl">4%</p>
                <p className="subTitle">Cancellation Rate</p>
              </div>
            </div>
          </div>

          <div>
            <AvailabilityCard availableSlots={17} totalSlots={20} />
          </div>
          <div style={{ width: "98%" }}>
            <div className="upcomingAppointment mt-4 p-4 shadow-2xl rounded-lg flex justify-center items-center">
              <div className="card w-[70%] flex flex-col justify-center items-center rounded-3xl shadow-2xl px-10 py-2">
                <h2 className="text-xl font-bold">Incoming Appointments</h2>
                {todaysAppointments.length > 0 ? (
                  <ul>
                    {todaysAppointments.map((appointment) => (
                      <li key={appointment.id} className="border-b py-2">
                        <p>Date: {appointment.date}</p>
                        <p>Time: {appointment.time}</p>
                        <p>
                          Name: {appointment.firstName} {appointment.lastName}
                        </p>
                        <p>Type: {appointment.type}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No appointments for today.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
