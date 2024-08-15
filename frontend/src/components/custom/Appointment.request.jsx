import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

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
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this appointment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setAppointments(
          appointments.filter((appointment) => appointment.id !== id)
        );
        Swal.fire("Approved!", "The appointment has been approved.", "success");
      }
    });
  };

  const declineAppointment = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to decline this appointment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, decline it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setAppointments(
          appointments.filter((appointment) => appointment.id !== id)
        );
        Swal.fire("Declined!", "The appointment has been declined.", "success");
      }
    });
  };

  return (
    <div className="w-full shadow-2xl p-4 md:p-5">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div className="flex items-center p-2 rounded-md gap-2 shadow-lg border border-gray-300 w-full md:w-auto">
          <FaSearch />
          <input
            className="w-full p-2 border-none outline-none"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center mt-2 md:mt-0 gap-3">
          <p className="text-lg font-semibold">View All</p>
          <NavLink to="/view-all-appointment">
            <FaChevronRight className="text-blue-600" />
          </NavLink>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-lg border-gray-700 flex flex-col md:flex-row justify-between items-center p-4"
          >
            <div>
              <p className="font-bold text-lg">{appointment.name}</p>
              <p className="text-sm text-center">{appointment.type}</p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                className="bg-blue-600 text-white p-2 rounded-md"
                onClick={() => approveAppointment(appointment.id)}
              >
                <FaCheck />
              </button>
              <button
                className="bg-red-600 text-white p-2 rounded-md"
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
