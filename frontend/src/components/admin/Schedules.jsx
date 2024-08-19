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
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [incomingAppointments, setIncomingAppointments] = useState([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [freeSlots, setFreeSlots] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
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
        const response = await axios.get(
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

  const handleAccept = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/Appointments/api/accept/${id}`);
      setAppointments(appointments.filter((app) => app._id !== id));
    } catch (error) {
      setMessage("Failed to accept the appointment.");
    }
  };
  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/Appointments/api/reject/${id}`);
      setAppointments(appointments.filter((app) => app._id !== id));
    } catch (error) {
      setMessage("Failed to reject the appointment.");
    }
  };
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
      <div className="thirdBox w-full mt-4 bg-white p-4 shadow-2xl">
        <h2 className="text-xl text-center uppercase font-mono">
          Patient Requests for Approval
        </h2>
        {appointments.length === 0 ? (
          <div className="text-center flex justify-center items-center text-gray-500 p-10 h-full w-full">
            No Appointment Request
          </div>
        ) : (
          <ul className="list-disc pl-5 mt-4">
            {appointments.map((appointment) => {
              const appointmentDate = new Date(appointment.date);
              const today = new Date().setHours(0, 0, 0, 0);
              const appointmentDateSet = appointmentDate.setHours(0, 0, 0, 0);
              const isToday = appointmentDateSet === today;
              const formattedDate = appointmentDate.toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );
              const dayOfWeek = appointmentDate.toLocaleDateString("en-US", {
                weekday: "long",
              });
              const formattedTime = new Date(
                `1970-01-01T${appointment.time}`
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <li
                  key={appointment._id}
                  className="mt-4 p-4 bg-gray-100 border rounded shadow-md list-none"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[#2c6975] font-semibold">
                      <strong>{isToday ? "TODAY" : dayOfWeek}</strong>{" "}
                      {formattedDate}
                    </span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleShowDetails(appointment)}
                        className="text-gray-400 hover:text-[#2c6975] mr-2"
                      >
                        <InfoIcon />
                      </button>
                      <button
                        onClick={() => handleReject(appointment._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <HighlightOffIcon />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <p className="mt-2 uppercase">
                      <strong>{appointment.firstname}</strong>
                    </p>
                    <p className="mt-2 uppercase">
                      <strong> {appointment.lastname}</strong>
                    </p>
                  </div>
                  <p className="mt-2 text-gray-700 capitalize">
                    {appointment.appointmentType}
                  </p>
                  <p className="mt-2">
                    <strong>{appointment.time}</strong>
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleAccept(appointment._id)}
                      className="bg-[#2c6975] text-white font-semibold px-10 py-2 rounded hover:bg-[#1f4f5f]"
                    >
                      Accept
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        ;
      </div>
      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg mx-4 w-full sm:w-11/12 md:w-3/4 lg:w-1/2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Appointment Details
            </h2>
            <p className="mb-2">
              <strong className="text-gray-700">Date:</strong>{" "}
              {new Date(selectedAppointment.date).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Time:</strong>{" "}
              {selectedAppointment.time}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Type:</strong>{" "}
              {selectedAppointment.appointmentType}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Firstname:</strong>{" "}
              {selectedAppointment.firstname}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Lastname:</strong>{" "}
              {selectedAppointment.lastname}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Email:</strong>{" "}
              {selectedAppointment.email}
            </p>
            <p className="mb-4">
              <strong className="text-gray-700">Role:</strong>{" "}
              {selectedAppointment.role}
            </p>
            <div className="mb-4">
              <strong className="text-gray-700">Receipt:</strong>
              {selectedAppointment.receipt ? (
                <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={selectedAppointment.receipt}
                    alt="Receipt"
                    className="w-full h-auto"
                  />
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            selectedAppointment.receipt
                          );
                          if (response.ok) {
                            const blob = await response.blob();
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = "receipt.jpg";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          } else {
                            console.error("Failed to fetch receipt");
                          }
                        } catch (error) {
                          console.error("Error downloading receipt:", error);
                        }
                      }}
                      className="inline-flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors"
                    >
                      Download Receipt
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">No receipt available</span>
              )}
            </div>
            <button
              onClick={handleCloseDetails}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
