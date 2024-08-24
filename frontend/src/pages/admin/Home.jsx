import React, { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import { FaTimes } from "react-icons/fa";
import "../../styles/Home.css";

import WorkloadChart from "../../components/custom/chart";
import AppointmentRequest from "../../components/custom/Appointment.request";
import AvailabilityCard from "../../components/custom/AvailabilityCard";
import HighestWeeklyAppointments from "../../components/custom/HighestWeeklyAppointments";
import {
  countFreeSlots,
  countPendingSlots,
} from "../../api/appointmentAPI/countFreeAndPendingSlots";
import { fetchTodaysAppointments } from "../../api/appointmentAPI/fetchTodayAppointments";
import { fetchUserCount } from "../../api/appointmentAPI/fetchUserCount";
import { fetchCancellationRate } from "../../api/appointmentAPI/fetchCancellationRate";
import { fetchCompletionRate } from "../../api/appointmentAPI/fetchCompletionRate";
import LoadingSpinner from "../../components/custom/LoadingSpinner";

const Home = () => {
  const [userCount, setUserCount] = useState(0);
  const [cancellationRate, setCancellationRate] = useState(null);
  const [completionRate, setCompletionRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [freeSlotCount, setFreeSlotCount] = useState(0);
  const [pendingSlotCount, setpendingSlotCount] = useState(0);

  useEffect(() => {
    const fetchFreeSlots = async () => {
      try {
        const count = await countFreeSlots();
        setFreeSlotCount(count);
      } catch (error) {
        console.error("Error fetching free slots:", error);
      }
    };

    fetchFreeSlots();
  }, []);

  useEffect(() => {
    const fetchPendingSlots = async () => {
      try {
        const count = await countPendingSlots();
        setpendingSlotCount(count);
      } catch (error) {
        console.error("Error fetching pending slots:", error);
      }
    };

    fetchPendingSlots();
  }, []);

  useEffect(() => {
    const handleFetchTodaysAppointment = async () => {
      try {
        const appointments = await fetchTodaysAppointments();
        setTodaysAppointments(appointments);
      } catch (err) {
        setError("Failed to fetch today's appointments.");
      } finally {
        setLoading(false);
      }
    };
    handleFetchTodaysAppointment();
  }, []);

  useEffect(() => {
    const handleFetchUserCount = async () => {
      try {
        const count = await fetchUserCount();
        setUserCount(count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    handleFetchUserCount();
  }, []);

  useEffect(() => {
    const handleFetchCancellationRate = async () => {
      try {
        const rate = await fetchCancellationRate();
        setCancellationRate(rate);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cancellation rate:", error);
        setLoading(false);
      }
    };

    handleFetchCancellationRate();
  }, []);

  useEffect(() => {
    const handlefetchCompletionRate = async () => {
      try {
        const rate = await fetchCompletionRate();
        console.log(rate);
        setCompletionRate(rate);
      } catch (error) {
        console.error("Error fetching completion rate:", error);
      } finally {
        setLoading(false);
      }
    };

    handlefetchCompletionRate();
  }, []);

  return (
    <div className="home h-lvh px-2">
      <div className="sort flex flex-col sm:flex-row sm:justify-between w-full p-10">
        <div></div>
      </div>
      <div className="w-full flex flex-col sm:flex-row sm:gap-10">
        <div className="flex flex-col w-full sm:w-[48%] gap-10">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap">
            <div className="w-full shadow-xl p-4 rounded-md bg-white">
              <div className="flex flex-row gap-3 justify-center py-2 items-center">
                <div className="iconContainer">
                  <PersonIcon id="icons" />
                </div>
                <div className="flex justify-items-center flex-col">
                  <b className="num text-5xl">{userCount}</b>
                  <p className="text-2xl capitalize">patients</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-white shadow-xl p-2 rounded-md">
              <HighestWeeklyAppointments />
            </div>
          </div>
          <div className="workload w-full bg-white">
            <p className="px-4 py-2 w-full font-bold">Workload</p>
            <div className="graph w-full">
              <WorkloadChart />
            </div>
          </div>
          <div className="appointments w-full bg-white p-2">
            <p className="font-bold px-4">Appointment Request</p>
            <AppointmentRequest />
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-[48%] gap-10">
          <div className="rating flex flex-col sm:flex-row w-full items-center justify-evenly gap-8 px-4">
            <div className="shadow-2xl w-full sm:w-1/2 p-8 rounded-lg bg-white flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/6 flex items-center justify-center">
                <EqualizerOutlinedIcon
                  style={{ fontSize: "3rem", color: "#00A8E8" }}
                />
              </div>
              <div className="text-center sm:text-left">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <p className="font-extrabold text-3xl">{completionRate}</p>
                    <p className="subTitle">Conversion Rate</p>
                  </>
                )}
              </div>
            </div>
            <div className="shadow-2xl w-full sm:w-1/2 p-8 rounded-lg bg-white flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-1/6 flex items-center justify-center bg-red-300 rounded-md">
                <FaTimes className="text-3xl text-red-600 font-normal" />
              </div>
              <div className="text-center sm:text-left">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <p className="font-extrabold text-3xl">
                      {cancellationRate}
                    </p>
                    <p className="subTitle">Cancellation Rate</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full bg-white rounded-lg shadow-2xl">
            <AvailabilityCard
              availableSlots={freeSlotCount}
              totalSlots={pendingSlotCount}
            />
          </div>
          <div className="w-full bg-[#fff]">
            <div className="upcomingAppointment mt-4 p-4 shadow-2xl rounded-lg flex justify-center items-center">
              <div className="card flex flex-col justify-center items-center ">
                <h2 className="text-xl font-bold uppercase font-mono ">
                  Today's Appointments
                </h2>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p style={{ color: "red" }}>{error}</p>
                ) : (
                  <ul>
                    {todaysAppointments.length === 0 ? (
                      <p>No appointments for today.</p>
                    ) : (
                      todaysAppointments.map((appointment, index) => (
                        <li
                          key={index}
                          className="flex flex-col rounded-3xl shadow-2xl px-10 py-2 bg-white"
                        >
                          <strong>{appointment.time}</strong>
                          <p>
                            <strong>Patients Name: </strong>
                            {appointment.firstname} {appointment.lastname}
                          </p>
                          <p>
                            {" "}
                            <strong>Type:</strong> {appointment.appointmentType}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
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
