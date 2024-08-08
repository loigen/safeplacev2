import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import CustomTimePicker from "../custom/CustomTimePicker";
import Swal from "sweetalert2";
import "../../styles/Schedules.css";

const Schedules = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [freeSchedules, setFreeSchedules] = useState({
    [today.toDateString()]: ["10:00 AM"],
  });
  const [patientRequests, setPatientRequests] = useState([
    {
      id: 1,
      firstName: "Patient",
      lastName: "A",
      date: "2024-08-08",
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
  const [incomingAppointment, setIncomingAppointment] = useState(null);

  useEffect(() => {
    const findNearestAppointment = () => {
      const upcomingAppointments = patientRequests
        .map((request) => {
          const [year, month, day] = request.date.split("-").map(Number);
          const [hour, minute] = request.time
            .split(/[: ]/)
            .slice(0, 2)
            .map(Number);
          const period = request.time.split(" ")[1];
          const adjustedHour =
            period === "PM" && hour !== 12
              ? hour + 12
              : period === "AM" && hour === 12
              ? 0
              : hour;
          return {
            ...request,
            dateTime: new Date(year, month - 1, day, adjustedHour, minute),
          };
        })
        .filter(({ dateTime }) => dateTime.getTime() >= today.getTime())
        .sort((a, b) => a.dateTime - b.dateTime);

      setIncomingAppointment(upcomingAppointments[0] || null);
    };

    findNearestAppointment();
  }, [patientRequests, today]);

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
    selectedDateTime.setHours(adjustedHour, minute || 0); // Default to 00 if minute is empty

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
        return timeDiff < 7200000; // 2 hours in milliseconds
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
        {incomingAppointment && (
          <div className="mt-4 bg-[#68b2a0] p-4 shadow-2xl rounded-lg flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl px-10 py-2">
              <h2 className="text-xl font-bold">Incoming Appointment</h2>
              <p>Date: {incomingAppointment.date}</p>
              <p>Time: {incomingAppointment.time}</p>
              <p>
                Name: {incomingAppointment.firstName}{" "}
                {incomingAppointment.lastName}
              </p>
              <p>Type: {incomingAppointment.type}</p>
            </div>
          </div>
        )}
      </div>
      <div className="secondBox w-[30%]">
        <div className="bg-white rounded-lg shadow-2xl p-5">
          <h2 className="px-2 text-lg">{selectedDate.toDateString()}</h2>
          <CustomTimePicker
            initialStartTime={freeSchedules[selectedDate.toDateString()] || []}
            onTimeChange={handleTimeChange}
          />
        </div>

        <div className="mt-4 bg-white rounded-2xl">
          {freeSchedules[selectedDate.toDateString()] && (
            <div className="mt-2 p-4 border rounded">
              <p className="font-bold text-[#5f5f5f]">
                Selected Time Schedule:
              </p>
              {freeSchedules[selectedDate.toDateString()].map((time, index) => (
                <p key={index}>Free Schedule: {time}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="thirdBox w-[30%] mt-4">
        <h2 className="text-xl font-bold">Patient Requests</h2>
        <ul>
          {patientRequests.map((request) => (
            <li key={request.id} className="mt-2 p-4 border rounded">
              <p>
                Name: {request.firstName} {request.lastName}
              </p>
              <p>Date: {request.date}</p>
              <p>Time: {request.time}</p>
              <p>Type: {request.type}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Schedules;
