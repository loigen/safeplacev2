import React, { useState, useEffect } from "react";
import axios from "axios";

const AppointmentsPage = () => {
  const [appointmentType, setAppointmentType] = useState("");
  const [message, setMessage] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch available slots when the component mounts
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/schedules/slots"
        );
        setAvailableSlots(response.data);
      } catch (error) {
        setMessage("Failed to load available slots.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, []);

  // Handle form submission to create an appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      setMessage("Please select a time slot.");
      return;
    }

    try {
      // Create the appointment
      await axios.post("http://localhost:5000/api/appointments", {
        date: selectedSlot.date,
        time: selectedSlot.time,
        appointmentType,
        userId: "60c72b2f9b1e8c6f9b1e8c6b", // Replace with the actual user ID
      });

      // Update the slot status to 'pending'
      const patchResponse = await axios.patch(
        `http://localhost:5000/schedules/slots/${selectedSlot._id}`,
        { status: "pending" }
      );

      if (patchResponse.status === 200) {
        setMessage("Appointment created successfully!");
        setAppointmentType("");
        setSelectedSlot(null);

        // Refresh available slots after successful appointment creation
        const updatedSlots = await axios.get(
          "http://localhost:5000/schedules/slots"
        );
        setAvailableSlots(updatedSlots.data);
      } else {
        setMessage("Failed to update slot status.");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setMessage("Failed to create appointment.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Schedule an Appointment</h2>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="appointmentType"
            className="block text-sm font-medium text-gray-700"
          >
            Appointment Type
          </label>
          <input
            type="text"
            id="appointmentType"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Available Slots</h3>
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <p className="text-gray-500">Loading available slots...</p>
            ) : availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <div
                  key={slot._id}
                  className={`p-4 border rounded-md cursor-pointer ${
                    selectedSlot && selectedSlot._id === slot._id
                      ? "bg-indigo-100 border-indigo-500"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(slot.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {slot.time}
                  </p>
                </div>
              ))
            ) : (
              <p>No available slots.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentsPage;
