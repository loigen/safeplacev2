import React, { useState, useEffect } from "react";
import axios from "axios";

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
import { fetchDailyAppointments } from "../api/fetchDailyAppointments";
import { fetchDailyCancelAppointments } from "../api/fetchDailyCancelledAppointment";
import { fetchDailyAppointmentsofthemonth } from "../api/fetchDailyAppointmentsForMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WorkloadChart = () => {
  const [appointments, setAppointments] = useState({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  });
  const [cancelledAppointments, setcancelledAppointments] = useState({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  });

  const [view, setView] = useState("weekly");

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchDailyAppointments();
        const dailyData = result.dailyAppointments;

        const daysOfWeek = {
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0,
        };

        dailyData.forEach((entry) => {
          const date = new Date(entry.day);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          if (daysOfWeek[dayName] !== undefined) {
            daysOfWeek[dayName] += entry.count;
          }
        });

        setAppointments(daysOfWeek);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchDailyCancelAppointments();
        const dailyData = result.dailyAppointments;

        const daysOfWeek = {
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0,
        };

        dailyData.forEach((entry) => {
          const date = new Date(entry.day);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          if (daysOfWeek[dayName] !== undefined) {
            daysOfWeek[dayName] += entry.count;
          }
        });

        setcancelledAppointments(daysOfWeek);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    getData();
  }, []);

  const dataSets = {
    weekly: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Completed",
          data: [
            appointments.Sunday,
            appointments.Monday,
            appointments.Tuesday,
            appointments.Wednesday,
            appointments.Thursday,
            appointments.Friday,
            appointments.Saturday,
          ],
          backgroundColor: "#2C6975",
        },
        {
          label: "Canceled",
          data: [
            cancelledAppointments.Sunday,
            cancelledAppointments.Monday,
            cancelledAppointments.Tuesday,
            cancelledAppointments.Wednesday,
            cancelledAppointments.Thursday,
            cancelledAppointments.Friday,
            cancelledAppointments.Saturday,
          ],
          backgroundColor: "#FF543E",
        },
      ],
    },
    monthly: {
      labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "26",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ],
      datasets: [
        {
          label: "Completed",
          data: [
            appointments.Sunday,
            appointments.Monday,
            appointments.Tuesday,
            appointments.Wednesday,
            appointments.Thursday,
            appointments.Friday,
            appointments.Saturday,
          ],
          backgroundColor: "#2C6975",
        },
        {
          label: "Canceled",
          data: [
            cancelledAppointments.Sunday,
            cancelledAppointments.Monday,
            cancelledAppointments.Tuesday,
            cancelledAppointments.Wednesday,
            cancelledAppointments.Thursday,
            cancelledAppointments.Friday,
            cancelledAppointments.Saturday,
          ],
          backgroundColor: "#FF543E",
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
