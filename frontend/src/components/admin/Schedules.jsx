import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import CustomTimePicker from "../custom/CustomTimePicker";
import Swal from "sweetalert2";
import "../../styles/Schedules.css";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL;

const Schedules = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [freeSchedules, setFreeSchedules] = useState({});
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [incomingAppointments, setIncomingAppointments] = useState([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [pendingSchedules, setPendingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [freeSlots, setFreeSlots] = useState([]);
  useEffect(() => {
    const fetchPendingSchedules = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/schedules/slots/pending"
        );
        setPendingSchedules(response.data);
      } catch (error) {
        setMessage("Failed to load pending schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSchedules();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5000/schedules/slots/${id}`, {
        status: "approved",
      });
      setPendingSchedules(
        pendingSchedules.filter((schedule) => schedule._id !== id)
      );
      setMessage("Schedule accepted.");
    } catch (error) {
      setMessage("Failed to accept schedule.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/schedules/slots/${id}`);
      setPendingSchedules(
        pendingSchedules.filter((schedule) => schedule._id !== id)
      );
      setMessage("Schedule rejected.");
    } catch (error) {
      setMessage("Failed to reject schedule.");
    }
  };
  useEffect(() => {
    const fetchSchedulesAndRequests = async () => {
      try {
        const [freeScheduleResponse, appointmentRequestResponse] =
          await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/schedules/slots`),
            axios.get(
              `${process.env.REACT_APP_API_URL}/schedules/appointments/today
            `
            ),
          ]);
        console.log(freeScheduleResponse.data);
        setFreeSchedules(freeScheduleResponse.data);
        setAppointmentRequests(appointmentRequestResponse.data);
      } catch (error) {
        console.error("Error fetching schedules and requests:", error);
      }
    };

    fetchSchedulesAndRequests();
  }, []);

  useEffect(() => {
    const fetchFreeSlots = async () => {
      try {
        const response = await axios.get(`${API_URL}/schedules/slots`);
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
        await axios.delete(`${API_URL}/schedules/slots/${id}`);
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

  useEffect(() => {
    const findTodaysAppointments = () => {
      const now = new Date();
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      const appointmentsToday = incomingAppointments
        .map((appointment) => {
          const [year, month, day] = appointment.date.split("-").map(Number);
          const [hour, minute] = appointment.time
            .split(/[: ]/)
            .slice(0, 2)
            .map(Number);
          const period = appointment.time.split(" ")[1];
          const adjustedHour =
            period === "PM" && hour !== 12
              ? hour + 12
              : period === "AM" && hour === 12
              ? 0
              : hour;
          return {
            ...appointment,
            dateTime: new Date(year, month - 1, day, adjustedHour, minute),
          };
        })
        .filter(({ dateTime }) => dateTime >= now && dateTime <= endOfDay)
        .sort((a, b) => a.dateTime - b.dateTime);

      setTodaysAppointments(appointmentsToday);
    };

    findTodaysAppointments();
  }, [incomingAppointments]);

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
        const response = await axios.get(
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

        await axios.post(`${process.env.REACT_APP_API_URL}/schedules/slots`, {
          date: selectedDate.toDateString(),
          time,
        });

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

  const handleAcceptRequest = async (id) => {
    try {
      const accepted = appointmentRequests.find((req) => req.id === id);
      setAcceptedAppointments((prev) => [...prev, accepted]);
      setAppointmentRequests((prev) => prev.filter((req) => req.id !== id));
      await axios.put(
        `${process.env.REACT_APP_API_URL}/schedules/appointments/accept/${id}`
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleUnacceptRequest = async (id) => {
    try {
      const rejected = appointmentRequests.find((req) => req.id === id);
      setAppointmentRequests((prev) => prev.filter((req) => req.id !== id));
      await axios.put(
        `${process.env.REACT_APP_API_URL}/schedules/appointments/reject/${id}`
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleShowDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
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
          <div className="card flex flex-col justify-center items-center rounded-3xl shadow-2xl px-10 py-2">
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
      <div className="secondBox w-full h-full flex flex-col justify-start">
        <div className="bg-white rounded-lg shadow-2xl p-5">
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
      <div className="thirdBox w-full mt-4 bg-white p-4 shadow-2xl">
        <h2 className="text-xl uppercase font-bold">
          Patient Requests for Approval
        </h2>
        {message && <p className="text-center text-red-500 p-10">{message}</p>}
        {loading ? (
          <p className="text-gray-500">Loading pending schedules...</p>
        ) : pendingSchedules.length === 0 ? (
          <p className="text-center text-gray-500 p-10">No pending requests.</p>
        ) : (
          <ul>
            {pendingSchedules
              .filter((schedule) => {
                const scheduleDate = new Date(schedule.date).setHours(
                  0,
                  0,
                  0,
                  0
                );
                const todayDate = today.setHours(0, 0, 0, 0);
                return scheduleDate >= todayDate;
              })
              .map((schedule) => {
                const scheduleDate = new Date(schedule.date).setHours(
                  0,
                  0,
                  0,
                  0
                );
                const isToday = scheduleDate === today.setHours(0, 0, 0, 0);
                const formattedDate = new Date(schedule.date)
                  .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  .replace(",", "");

                return (
                  <li
                    key={schedule._id}
                    className="mt-2 bg-white p-4 shadow-2xl border rounded"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-s text-[#2c6975]">
                        <strong>
                          {isToday
                            ? "TODAY"
                            : new Date(schedule.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                }
                              )}
                        </strong>{" "}
                        {formattedDate}
                      </span>
                      <div className="flex items-center">
                        <button
                          // Handle details display
                          className="text-gray-400 hover:text-[#2c6975]"
                        >
                          {/* Replace with your InfoIcon */}
                        </button>
                        <button
                          onClick={() => handleReject(schedule._id)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          {/* Replace with your HighlightOffIcon */}
                        </button>
                      </div>
                    </div>
                    <p>
                      <strong>Time:</strong> {schedule.time}
                    </p>
                    <div className="w-full flex justify-end">
                      <button
                        onClick={() => handleAccept(schedule._id)}
                        className="mt-4 bg-[#2c6975] w-[50%] text-white font-semibold py-1 px-4 rounded"
                      >
                        Accept
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
            <p>
              <strong>Name:</strong> {selectedRequest.firstName}{" "}
              {selectedRequest.lastName}
            </p>
            <p>
              <strong>Date:</strong> {selectedRequest.date}
            </p>
            <p>
              <strong>Time:</strong> {selectedRequest.time}
            </p>
            <p>
              <strong>Type:</strong> {selectedRequest.type}
            </p>
            <div className="w-full flex justify-end">
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-[#2c6975] text-white py-2 px-4 rounded w-[30%]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
