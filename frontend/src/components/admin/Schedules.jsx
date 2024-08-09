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

const Schedules = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [freeSchedules, setFreeSchedules] = useState({
    [today.toDateString()]: ["10:00 AM"],
  });
  const [appointmentRequests, setAppointmentRequests] = useState([
    {
      id: 1,
      firstName: "Patient",
      lastName: "A",
      date: "2024-08-10",
      time: "10:00 AM",
      type: "Consultation",
    },
    {
      id: 2,
      firstName: "Patient",
      lastName: "B",
      date: "2024-08-09",
      time: "02:00 PM",
      type: "Follow-up",
    },
  ]);

  const [incomingAppointments, setIncomingAppointments] = useState([
    {
      id: 3,
      firstName: "Patient",
      lastName: "C",
      date: "2024-08-09",
      time: "07:00 PM",
      type: "Consultation",
    },
    {
      id: 4,
      firstName: "Patient",
      lastName: "D",
      date: "2024-08-09",
      time: "05:00 PM",
      type: "Check-up",
    },
  ]);

  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState([]);

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

  const isTimeAvailable = (time) => {
    if (typeof time !== "string") {
      console.error("Expected time to be a string, but got:", typeof time);
      return false;
    }

    const selectedDateTime = new Date(selectedDate);
    const [hour, minute] = time.split(/[: ]/).slice(0, 2).map(Number);
    const period = time.split(" ")[1];
    const adjustedHour =
      period === "PM" && hour !== 12
        ? hour + 12
        : period === "AM" && hour === 12
        ? 0
        : hour;
    selectedDateTime.setHours(adjustedHour, minute || 0);

    const isAvailable = !Object.keys(freeSchedules).some((dateKey) => {
      const scheduleTimes = freeSchedules[dateKey] || [];
      return scheduleTimes.some((scheduleTime) => {
        const scheduleDateTime = new Date(dateKey);
        const [scheduledHour, scheduledMinute] = scheduleTime
          .split(/[: ]/)
          .slice(0, 2)
          .map(Number);
        const scheduledPeriod = scheduleTime.split(" ")[1];
        const adjustedScheduledHour =
          scheduledPeriod === "PM" && scheduledHour !== 12
            ? scheduledHour + 12
            : scheduledPeriod === "AM" && scheduledHour === 12
            ? 0
            : scheduledHour;
        scheduleDateTime.setHours(adjustedScheduledHour, scheduledMinute);

        const timeDiff = Math.abs(selectedDateTime - scheduleDateTime);
        return timeDiff < 7200000;
      });
    });

    return isAvailable;
  };

  const handleTimeChange = (time) => {
    if (time && selectedDate) {
      if (typeof time !== "string") {
        console.error("Expected time to be a string, but got:", typeof time);
        return;
      }

      if (isTimeAvailable(time)) {
        setFreeSchedules((prevSchedules) => {
          const dateKey = selectedDate.toDateString();
          const updatedTimes = (prevSchedules[dateKey] || []).concat(time);
          return {
            ...prevSchedules,
            [dateKey]: updatedTimes,
          };
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Time Slot Unavailable",
          text: "The selected time slot is either already scheduled or conflicts with another appointment.",
          confirmButtonColor: "#2c6975",
        });
      }
    }
  };

  const handleTimeDelete = (time) => {
    const dateKey = selectedDate.toDateString();
    setFreeSchedules((prevSchedules) => {
      const updatedTimes = prevSchedules[dateKey].filter(
        (scheduledTime) => scheduledTime !== time
      );
      return {
        ...prevSchedules,
        [dateKey]: updatedTimes,
      };
    });
  };

  const handleAcceptRequest = (id) => {
    const accepted = appointmentRequests.find((req) => req.id === id);
    setAcceptedAppointments((prev) => [...prev, accepted]);
    setAppointmentRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleUnacceptRequest = (id) => {
    const rejected = appointmentRequests.find((req) => req.id === id);
    setAppointmentRequests((prev) => prev.filter((req) => req.id !== id));
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
    <div className="py-16 px-6 flex flex-row flex-wrap justify-between h-full">
      <div className="firstBox flex flex-col w-[30%] h-full">
        <div className="Calendar h-[60%] w-full gap-3 bg-white rounded-lg shadow-2xl flex flex-col items-center py-12">
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
      <div className="secondBox w-[30%]">
        <div className="bg-white rounded-lg shadow-2xl p-5">
          <h2 className="px-2 text-lg">{selectedDate.toDateString()}</h2>
          <CustomTimePicker
            initialStartTime={freeSchedules[selectedDate.toDateString()] || []}
            onTimeChange={handleTimeChange}
          />
        </div>

        <div className="mt-4 bg-white shadow-2xl rounded-2xl">
          {freeSchedules[selectedDate.toDateString()] && (
            <div className="p-4">
              {freeSchedules[selectedDate.toDateString()].map((time, index) => (
                <div className="flex justify-between items-center " key={index}>
                  <p className="rounded w-[50%] text-center bg-[#2c6975] shadow-2xl p-2 text-white font-bold">
                    {time}
                  </p>
                  <button
                    onClick={() => handleTimeDelete(time)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="thirdBox w-[30%] mt-4 bg-white p-4 shadow-2xl">
        <h2 className="text-xl uppercase font-bold">
          Patient Requests for Approval
        </h2>
        <ul>
          {appointmentRequests
            .filter((request) => {
              const requestDate = new Date(request.date).setHours(0, 0, 0, 0);
              const todayDate = today.setHours(0, 0, 0, 0);
              return requestDate >= todayDate;
            })
            .map((request) => {
              const requestDate = new Date(request.date).setHours(0, 0, 0, 0);
              const isToday = requestDate === today.setHours(0, 0, 0, 0);
              const formattedDate = new Date(request.date)
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                .replace(",", "");

              return (
                <li
                  key={request.id}
                  className="mt-2 bg-white p-4 shadow-2xl border rounded"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-s text-[#2c6975]">
                      <strong>
                        {isToday
                          ? "TODAY"
                          : new Date(request.date).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                      </strong>{" "}
                      {formattedDate}
                    </span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleShowDetails(request)}
                        className="text-gray-400 hover:text-[#2c6975]"
                      >
                        <InfoIcon />
                      </button>
                      <button
                        onClick={() => handleUnacceptRequest(request.id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        <HighlightOffIcon />
                      </button>
                    </div>
                  </div>
                  <p>
                    Name: {request.firstName} {request.lastName}
                  </p>
                  <p>Type: {request.type}</p>
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="mt-4 bg-[#2c6975] w-[50%] text-white font-semibold py-1 px-4 rounded"
                    >
                      Accept
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
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
