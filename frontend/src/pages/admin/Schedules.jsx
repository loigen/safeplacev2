import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import "../../styles/Schedules.css";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import axiosInstance from "../../config/axiosConfig";
import CustomTimePicker from "../../components/custom/CustomTimePicker";
import AppointmentRequest from "../../components/custom/Appointment.request";

const API_URL = process.env.REACT_APP_API_URL;

const Schedules = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [freeSchedules, setFreeSchedules] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [freeSlots, setFreeSlots] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/Appointments/api/pending"
        );
        setAppointments(response.data);
      } catch (err) {
        setError("Failed to fetch pending appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  useEffect(() => {
    const handleFetchTodaysAppointment = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/Appointments/api/today"
        );
        setTodaysAppointments(response.data);
      } catch (err) {
        setError("Failed to fetch today's appointments.");
      } finally {
        setLoading(false);
      }
    };
    handleFetchTodaysAppointment();
  }, []);

  useEffect(() => {
    const fetchFreeSlots = async () => {
      try {
        const response = await axiosInstance.get(`${API_URL}/schedules/slots`);
        setFreeSlots(response.data);
      } catch (error) {
        console.error("Error fetching free slots:", error);
      }
    };

    fetchFreeSlots();

    const intervalId = setInterval(fetchFreeSlots, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteFreeSlot = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the selected time slot.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2c6975",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`${API_URL}/schedules/slots/${id}`);
        setFreeSlots(freeSlots.filter((slot) => slot._id !== id));
        Swal.fire("Success", "Free time slot deleted", "success");
      } catch (error) {
        console.error("Error deleting free time slot:", error);
        Swal.fire("Error", "Failed to delete free time slot", "error");
      }
    } else {
      Swal.fire("Cancelled", "The time slot was not deleted", "info");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = async (time) => {
    if (time) {
      if (typeof time !== "string") {
        console.error("Expected time to be a string, but got:", typeof time);
        return;
      }

      const newTimeDate = new Date(`${selectedDate.toDateString()} ${time}`);
      console.log("Constructed New Time Date:", newTimeDate);

      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/schedules/slots/check`,
          {
            params: {
              date: selectedDate.toDateString(),
              time,
            },
          }
        );

        if (response.data.exists) {
          Swal.fire({
            icon: "warning",
            title: "Slot Already Exists",
            text: "The selected time slot already exists.",
            confirmButtonColor: "#2c6975",
          });
          return;
        }

        await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/schedules/slots`,
          {
            date: selectedDate.toDateString(),
            time,
          }
        );

        setFreeSchedules((prevSchedules) => {
          const dateKey = selectedDate.toDateString();
          const updatedTimes = (prevSchedules[dateKey] || []).concat(time);
          return {
            ...prevSchedules,
            [dateKey]: updatedTimes,
          };
        });

        Swal.fire({
          icon: "success",
          title: "Time Slot Added",
          text: "The time slot has been successfully added.",
          confirmButtonColor: "#2c6975",
        });
      } catch (error) {
        console.error(
          "Error adding time slot:",
          error.response?.data || error.message
        );
        Swal.fire({
          icon: "error",
          title: "Failed to Add Slot",
          text: "There was an issue processing your request. Please try again.",
          confirmButtonColor: "#2c6975",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please make sure a time is selected.",
        confirmButtonColor: "#2c6975",
      });
    }
  };

  const handleShowDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  const tileDisabled = ({ date }) => {
    return date < today.setHours(0, 0, 0, 0);
  };

  const minDate = new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="mainContainer py-16 px-6 flex flex-row gap-[2%]  h-full">
      <div className="firstBox flex flex-col w-full h-full">
        <div className="Calendar h-[100%] w-full gap-3 bg-white rounded-lg shadow-2xl flex flex-col items-center py-12">
          <Calendar
            onClickDay={handleDateChange}
            tileDisabled={tileDisabled}
            minDetail="month"
            minDate={minDate}
            className="custom-calendar"
          />
        </div>

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
      <div className="secondBox w-full h-full flex flex-col justify-start">
        <div className="bg-white rounded-lg shadow-2xl p-5">
          <p className="uppercase font-mono px-2">Enter Time</p>
          <h2 className="px-2 text-lg">{selectedDate.toDateString()}</h2>
          <CustomTimePicker
            selectedDate={selectedDate}
            initialStartTime={freeSchedules[selectedDate.toDateString()] || []}
            onTimeChange={handleTimeChange}
          />
        </div>

        <div className="mt-4 bg-white shadow-2xl rounded-2xl">
          <div className="p-4">
            {freeSlots.map((slot) => (
              <li
                key={slot._id}
                className="mb-2 w-full shadow-2xl flex justify-between"
              >
                {dayjs(slot.date).format("YYYY-MM-DD")} at {slot.time}
                <button
                  onClick={() => handleDeleteFreeSlot(slot._id)}
                  className=" text-red-600 p-1 rounded ml-4"
                >
                  <DeleteIcon />
                </button>
              </li>
            ))}
          </div>
        </div>
      </div>
      <AppointmentRequest />
    </div>
  );
};

export default Schedules;
