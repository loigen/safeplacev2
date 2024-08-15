import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const CustomTimePicker = ({ initialStartTime, onTimeChange }) => {
  const [startHour, setStartHour] = useState("01");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");

  useEffect(() => {
    if (typeof initialStartTime === "string" && initialStartTime.trim()) {
      const [time, ampm] = initialStartTime.split(" ");
      const [h, m] = time.split(":");
      setStartHour(h);
      setStartMinute(m);
      setStartPeriod(ampm);
    }
  }, [initialStartTime]);

  const handleStartHourChange = (e) => {
    let value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 12)) {
      setStartHour(value);
    }
  };

  const handleStartMinuteChange = (e) => {
    let value = e.target.value;
    let lastTwoDigits = value.slice(-2);

    if (/^\d*$/.test(value) && (value === "" || Number(lastTwoDigits) <= 59)) {
      setStartMinute(lastTwoDigits.padStart(2, "0"));
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setStartPeriod(newPeriod);
  };

  const handleOk = () => {
    const validStartHour = Number(startHour) >= 1 && Number(startHour) <= 12;
    const validStartMinute =
      Number(startMinute) >= 0 && Number(startMinute) <= 59;

    if (validStartHour && validStartMinute) {
      const formattedTime = `${startHour.padStart(
        2,
        "0"
      )}:${startMinute} ${startPeriod}`;
      onTimeChange(formattedTime);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Time",
        text: "Please enter a valid start time.",
        confirmButtonColor: "#2c6975",
      });
    }
  };

  const handleCancel = () => {
    setStartHour("01");
    setStartMinute("00");
    setStartPeriod("AM");
    onTimeChange(null);
  };

  return (
    <div className="bg-transparent p-4 rounded w-full">
      <h3 className="text-gray-700 mb-2">Enter Time</h3>
      <div className="time flex justify-between mb-4 w-[90%]">
        {/* Start Time */}
        <div className="hour w-[30%]">
          <input
            type="number"
            value={startHour || ""}
            placeholder="HH"
            onChange={handleStartHourChange}
            className="w-full outline-[#2c6975] p-2 border rounded text-center text-[3rem]"
            min="1"
            max="12"
          />
          <p>Start Hour</p>
        </div>
        <span className="mx-2 text-[3rem] text-black-600">:</span>
        <div className="minute w-[30%]">
          <input
            type="number"
            value={startMinute || ""}
            placeholder="MM"
            onChange={handleStartMinuteChange}
            className="w-full outline-[#2c6975] text-[3rem] p-2 border rounded text-center"
            min="0"
            max="59"
          />
          <p>Start Minute</p>
        </div>
        <div className="ml-2 flex gap-1 flex-col">
          <button
            onClick={() => handlePeriodChange("AM")}
            className={`px-2 py-1 rounded font-bold ${
              startPeriod === "AM"
                ? "bg-[#89cfbe] text-[#2c6975]"
                : "bg-gray-200"
            }`}
          >
            AM
          </button>
          <button
            onClick={() => handlePeriodChange("PM")}
            className={`px-2 py-1 rounded font-bold ${
              startPeriod === "PM"
                ? "bg-[#89cfbe] text-[#2c6975]"
                : "bg-gray-200"
            }`}
          >
            PM
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCancel}
          className="text-[#2c6975] font-bold mr-4"
        >
          CANCEL
        </button>
        <button onClick={handleOk} className="font-bold text-[#2c6975]">
          SAVE
        </button>
      </div>
    </div>
  );
};

export default CustomTimePicker;
