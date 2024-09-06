import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [freeSlots, setFreeSlots] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchFreeSlots();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/schedules/appointments/today`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchFreeSlots = async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules/slots`);
      setFreeSlots(response.data);
    } catch (error) {
      console.error("Error fetching free slots:", error);
    }
  };

  const handleAddFreeSlot = async () => {
    try {
      if (!date || !time) {
        return Swal.fire("Error", "Date and time are required", "error");
      }

      const response = await axios.post(`${API_URL}/schedules/slots`, {
        date,
        time,
      });
      setFreeSlots([...freeSlots, response.data]);
      setDate("");
      setTime("");
      Swal.fire("Success", "Free time slot added", "success");
    } catch (error) {
      console.error("Error adding free time slot:", error);
      Swal.fire("Error", "Failed to add free time slot", "error");
    }
  };

  const handleDeleteFreeSlot = async (id) => {
    try {
      await axios.delete(`${API_URL}/schedules/slots/${id}`);
      setFreeSlots(freeSlots.filter((slot) => slot._id !== id));
      Swal.fire("Success", "Free time slot deleted", "success");
    } catch (error) {
      console.error("Error deleting free time slot:", error);
      Swal.fire("Error", "Failed to delete free time slot", "error");
    }
  };

  const handleAcceptAppointment = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/schedules/appointments/accept/${id}`
      );
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "accepted" }
            : appointment
        )
      );
      Swal.fire("Success", "Appointment accepted", "success");
    } catch (error) {
      console.error("Error accepting appointment:", error);
      Swal.fire("Error", "Failed to accept appointment", "error");
    }
  };

  const handleRejectAppointment = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/schedules/appointments/reject/${id}`
      );
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "rejected" }
            : appointment
        )
      );
      Swal.fire("Success", "Appointment rejected", "success");
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      Swal.fire("Error", "Failed to reject appointment", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Appointments</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Free Time Slot</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddFreeSlot}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Slot
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Appointments</h2>
      <ul className="list-disc pl-5">
        {appointments.map((appointment) => (
          <li key={appointment._id} className="mb-2">
            {dayjs(appointment.date).format("YYYY-MM-DD")} at {appointment.time}{" "}
            - {appointment.status}
            {appointment.status === "pending" && (
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleAcceptAppointment(appointment._id)}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectAppointment(appointment._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">Free Time Slots</h2>
      <ul className="list-disc pl-5">
        {freeSlots.map((slot) => (
          <li key={slot._id} className="mb-2">
            {dayjs(slot.date).format("YYYY-MM-DD")} at {slot.time}
            <button
              onClick={() => handleDeleteFreeSlot(slot._id)}
              className="bg-red-500 text-white p-1 rounded ml-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
