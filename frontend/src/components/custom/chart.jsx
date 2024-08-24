import React, { useState, useEffect } from "react";
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
import { fetchDailyAppointments } from "../../api/appointmentAPI/fetchDailyAppointments";
import { fetchDailyCancelAppointments } from "../../api/appointmentAPI/fetchDailyCancelledAppointment";
import { fetchDailyAppointmentsForMonth } from "../../api/appointmentAPI/fetchDailyAppointmentsForMonth";
import { fetchDailyAppointmentsForYear } from "../../api/appointmentAPI/fetchDailyAppointmentsForYear";

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
  const [cancelledAppointments, setCancelledAppointments] = useState({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  });
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);
  const [monthlyCancelledAppointments, setMonthlyCancelledAppointments] =
    useState([]);
  const [yearlyAppointments, setyearlyAppointments] = useState([]);
  const [yearlyCancelledAppointments, setyearlyCancelledAppointments] =
    useState([]);

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

        setCancelledAppointments(daysOfWeek);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchDailyAppointmentsForMonth();
        const { datasets } = result;

        setMonthlyAppointments(datasets.completed);
        setMonthlyCancelledAppointments(datasets.canceled);
      } catch (error) {
        console.error("Error loading monthly data:", error);
      }
    };

    if (view === "monthly") {
      getData();
    }
  }, [view]);
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchDailyAppointmentsForYear();
        const { datasets } = result;

        setyearlyAppointments(datasets.completed);
        setyearlyCancelledAppointments(datasets.canceled);
      } catch (error) {
        console.error("Error loading monthly data:", error);
      }
    };

    if (view === "yearly") {
      getData();
    }
  }, [view]);
  const dataSets = {
    weekly: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Accepted",
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
      labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
      datasets: [
        {
          label: "Completed",
          data: monthlyAppointments,
          backgroundColor: "#2C6975",
        },
        {
          label: "Canceled",
          data: monthlyCancelledAppointments,
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
          data: yearlyAppointments,
          backgroundColor: "#2C6975",
        },
        {
          label: "Canceled",
          data: yearlyCancelledAppointments,
          backgroundColor: "#FF543E",
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
