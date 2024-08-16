import React, { useState, useEffect } from "react";

const CustomTimePicker = ({ initialStartTime, onTimeChange, selectedDate }) => {
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
    setStartHour(e.target.value);
  };

  const handleStartMinuteChange = (e) => {
    setStartMinute(e.target.value);
  };

  const handlePeriodChange = (newPeriod) => {
    setStartPeriod(newPeriod);
  };

  const handleSave = () => {
    const formattedTime = `${startHour}:${startMinute} ${startPeriod}`;
    onTimeChange(formattedTime);
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
