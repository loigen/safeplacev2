import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import axios from "axios"; // Import Axios

const CustomTimePicker = ({ initialStartTime, onTimeChange, selectedDate }) => {
  const [startHour, setStartHour] = useState("01");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (typeof initialStartTime === "string" && initialStartTime.trim()) {
      const [time, ampm] = initialStartTime.split(" ");
      const [h, m] = time.split(":");
      setStartHour(h);
      setStartMinute(m);
      setStartPeriod(ampm);
    }

    // Fetch existing appointments for the selected date
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/Appointments/api/get-appointments`,
          {
            params: {
              date: selectedDate,
            },
          }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [initialStartTime, selectedDate]);

  const handleStartHourChange = (e) => {
    setStartHour(e.target.value);
  };

  const handleStartMinuteChange = (e) => {
    setStartMinute(e.target.value);
  };

  const handlePeriodChange = (newPeriod) => {
    setStartPeriod(newPeriod);
  };

  const handleSave = async () => {
    const formattedTime = `${startHour}:${startMinute} ${startPeriod}`;
    const selectedDateTime = new Date(`${selectedDate} ${formattedTime}`);

    try {
      // Check for direct time slot conflict
      const conflictResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/Appointments/api/check-time`,
        {
          params: {
            date: selectedDate,
            time: formattedTime,
          },
        }
      );

      if (conflictResponse.data.conflict) {
        Swal.fire({
          icon: "error",
          title: "Time Slot Taken",
          text: "This time slot is already taken for the selected day.",
        });
        return;
      }

      // Check if the selected time has a 2-hour gap from existing appointments
      const hasConflict = appointments.some((appointment) => {
        const appointmentDateTime = new Date(
          `${selectedDate} ${appointment.time}`
        );
        const timeDifference =
          Math.abs(appointmentDateTime - selectedDateTime) / 36e5; // Convert milliseconds to hours
        return timeDifference < 2;
      });

      if (hasConflict) {
        Swal.fire({
          icon: "error",
          title: "Time Conflict",
          text: "Selected time must have at least a 2-hour gap from other appointments.",
        });
      } else {
        onTimeChange(formattedTime);
      }
    } catch (error) {
      console.error("Error checking time conflict:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to check time conflict.",
      });
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className="bg-transparent p-4 rounded w-full">
      <h3 className="text-gray-700 mb-4 text-xl font-semibold">Enter Time</h3>
      <div className="flex justify-between mb-4">
        <div className="w-1/4">
          <select
            value={startHour}
            onChange={handleStartHourChange}
            className="w-full p-2 border rounded text-center text-lg appearance-none"
            aria-label="Start Hour"
          >
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <p className="text-center mt-1 text-sm text-gray-500">Hour</p>
        </div>
        <span className="text-2xl text-gray-600">:</span>
        <div className="w-1/4">
          <select
            value={startMinute}
            onChange={handleStartMinuteChange}
            className="w-full p-2 border rounded text-center text-lg appearance-none"
            aria-label="Start Minute"
          >
            {minutes.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
          <p className="text-center mt-1 text-sm text-gray-500">Minute</p>
        </div>
        <div className="flex flex-col ml-4">
          <button
            onClick={() => handlePeriodChange("AM")}
            className={`px-3 py-1 rounded font-bold mb-1 ${
              startPeriod === "AM"
                ? "bg-[#89cfbe] text-[#2c6975]"
                : "bg-gray-200"
            }`}
            aria-label="AM"
          >
            AM
          </button>
          <button
            onClick={() => handlePeriodChange("PM")}
            className={`px-3 py-1 rounded font-bold ${
              startPeriod === "PM"
                ? "bg-[#89cfbe] text-[#2c6975]"
                : "bg-gray-200"
            }`}
            aria-label="PM"
          >
            PM
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-[#2c6975] text-white font-bold px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomTimePicker;
