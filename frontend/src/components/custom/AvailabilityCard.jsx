import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../../styles/AvailabilityCard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AvailabilityCard = ({ availableSlots, totalSlots }) => {
  const data = {
    datasets: [
      {
        data: [availableSlots, totalSlots - availableSlots],
        backgroundColor: ["#68b2ad", "#a1cec4"],
        hoverBackgroundColor: ["#27AE60", "#A9DFBF"],
      },
    ],
  };

  const options = {
    cutout: "40%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div
      className="flex items-center justify-between bg-white rounded-lg p-4 shadow-2xl availability-card"
      style={{ width: "98%" }}
    >
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex-1 flex-col gap-3 ml-4">
        <h4 className="text-2xl font-bold">Availability this Week</h4>
        <br />
        <p className="text-2xl flex flex-row font-bold items-center justify-between">
          <div className="flex flex-row items-center">
            <p className="text-4xl">{availableSlots}</p> /{" "}
            <p className="text-xl font-normal">{totalSlots} slots</p>
          </div>
          <div className="ml-4">
            <button className="bg-blue-600 px-1 flex items-center justify-center rounded-full border-none cursor-pointer">
              <span className="text-2xl text-white arrow-icon">➔</span>
            </button>
          </div>
        </p>
      </div>
    </div>
  );
};

export default AvailabilityCard;
