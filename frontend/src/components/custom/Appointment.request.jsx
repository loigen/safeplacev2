import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";

const AppointmentRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([
    { id: 1, name: "John Doe", type: "Counseling" },
    { id: 2, name: "Jane Smith", type: "Counseling" },
    { id: 3, name: "Alice Johnson", type: "Counseling" },
    { id: 4, name: "Michael Brown", type: "Counseling" },
  ]);
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter((appointment) =>
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, appointments]);

  const approveAppointment = (id) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
  };

  const declineAppointment = (id) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
  };

  return (
    <div className="w-full shadow-2xl p-5">
      <div className="Header-part flex justify-between flex-row w-full">
        <div
          className="search flex flex-row justify-center items-center p-2 rounded-md gap-2 shadow-xl "
          style={{ border: "1px solid gray" }}
        >
          <FaSearch />
          <input
            className="w-full"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="view-all flex flex-row items-center justify-center gap-3">
          <p>View All</p>
          <NavLink to="/view-all-appointment">
            <FaChevronRight />
          </NavLink>
        </div>
      </div>
      <div className="display-list">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="appointment-item flex justify-between items-center p-2 border-b"
          >
            <div>
              <p className="font-bold">{appointment.name}</p>
              <p>{appointment.type}</p>
            </div>
            <div className="action-buttons flex gap-2">
              <button
                className="approve bg-blue-600 p-2 rounded-md"
                onClick={() => approveAppointment(appointment.id)}
              >
                <FaCheck />
              </button>
              <button
                className="decline bg-red-600 p-2 rounded-md"
                onClick={() => declineAppointment(appointment.id)}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentRequest;
