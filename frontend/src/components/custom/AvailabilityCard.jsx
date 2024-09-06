import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className=" p-4  w-full max-w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
      <div className="w-full md:w-full flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
      <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
        <h4 className="text-xl md:text-2xl font-bold">
          Availability this Week
        </h4>
        <div className="text-xl w-[60%] md:text-2xl font-bold flex items-center gap-2 justify-around">
          <div className="flex items-center">
            <span className="text-2xl md:text-4xl">{availableSlots}</span> /
            <span className="text-base md:text-xl font-normal">
              {totalSlots} slots
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCard;
