import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/WorkloadChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WorkloadChart = () => {
  const [view, setView] = useState("weekly");

  const dataSets = {
    weekly: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Completed",
          data: [0, 3, 5, 4, 3, 2, 2],
          backgroundColor: "#2C6975",
        },
        {
          label: "Canceled",
          data: [0, 2, 4, 3, 4, 3, 2],
          backgroundColor: "#FF543E",
        },
      ],
    },
    monthly: {
      labels: Array.from({ length: 30 }, (_, i) => i + 1),
      datasets: [
        {
          label: "Completed",
          data: Array.from({ length: 30 }, () =>
            Math.floor(Math.random() * 10)
          ),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Canceled",
          data: Array.from({ length: 30 }, () =>
            Math.floor(Math.random() * 10)
          ),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
    yearly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Completed",
          data: Array.from({ length: 12 }, () =>
            Math.floor(Math.random() * 10)
          ),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Canceled",
          data: Array.from({ length: 12 }, () =>
            Math.floor(Math.random() * 10)
          ),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "end",

        labels: {
          boxWidth: 20,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  return (
    <div className="workload-container shadow-2xl">
      <div className="controls-container">
        <div className="buttons-container">
          <button
            className={view === "weekly" ? "active" : ""}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
          <button
            className={view === "monthly" ? "active" : ""}
            onClick={() => setView("monthly")}
          >
            Monthly
          </button>
          <button
            className={view === "yearly" ? "active" : ""}
            onClick={() => setView("yearly")}
          >
            Yearly
          </button>
        </div>
        <div className="legend-container">
          <Bar data={dataSets[view]} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WorkloadChart;
