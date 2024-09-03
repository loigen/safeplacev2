import React, { useState, useEffect } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InfoIcon from "@mui/icons-material/Info";
import Swal from "sweetalert2";
import axiosInstance from "../../config/axiosConfig";
import { LoadingSpinner, MeetLinkModal } from "./index";
import emailjs, { send } from "emailjs-com";

const AppointmentRequest = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToAccept, setAppointmentToAccept] = useState(null);

  const handleShowDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  const handleAccept = (appointment) => {
    setAppointmentToAccept(appointment);
    setIsModalOpen(true);
  };

  const handleReject = async (id, date, time) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmation.isConfirmed) {
      try {
        await axiosInstance.patch(
          `http://localhost:5000/Appointments/api/reject/${id}`
        );
        await axiosInstance.patch(
          "http://localhost:5000/schedules/updateByDateTime",
          { date, time }
        );
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app._id !== id)
        );
        Swal.fire({
          title: "Success",
          text: "Successfully declined!",
          icon: "success",
          confirmButtonText: "Close",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to reject the appointment.",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    }
  };

  const sendEmailNotification = async (appointment) => {
    try {
      const response = await emailjs.send(
        "service_hpvcujb",
        "template_uwrgbem",
        {
          to_email: appointment.email,
          meet_link: appointment.meetLink,
          date: appointment.date,
          time: appointment.time,
          appointment_type: appointment.appointmentType,
        },
        "rJ5kPXerBg9bonHix"
      );
      console.log(appointment.email);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  };

  const handleModalSubmit = async (meetLink) => {
    if (!meetLink) {
      Swal.fire({
        title: "Invalid Link",
        text: "Please provide a valid Google Meet link.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      return;
    }

    let validMeetLink;

    if (meetLink.startsWith("meet.google.com")) {
      validMeetLink = `https://${meetLink}`;
    } else if (meetLink.startsWith("https://meet.google.com")) {
      validMeetLink = meetLink;
    } else {
      Swal.fire({
        title: "Invalid Link",
        text: "Please provide a valid Google Meet link.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      return;
    }

    if (appointmentToAccept) {
      try {
        await axiosInstance.patch(
          `http://localhost:5000/Appointments/api/accept/${appointmentToAccept._id}`,
          {
            meetLink: validMeetLink,
          }
        );
        console.log("Appointment to accept:", appointmentToAccept);
        await sendEmailNotification({
          ...appointmentToAccept,
          meetLink: validMeetLink,
        });
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app._id !== appointmentToAccept._id)
        );
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to accept the appointment.",
          icon: "error",
          confirmButtonText: "Close",
        });
      } finally {
        setIsModalOpen(false);
        setAppointmentToAccept(null);
      }
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/Appointments/api/pending"
        );
        setAppointments(response.data);
      } catch (err) {
        setError("Failed to fetch pending appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter((appointment) =>
        `${appointment.firstname} ${appointment.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [appointments, searchTerm]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="thirdBox w-full mt-4 bg-white p-4 shadow-2xl">
      <h2 className="text-xl text-center uppercase font-mono">
        Patient Requests for Approval
      </h2>
      {appointments.length === 0 ? (
        <div className="text-center flex justify-center items-center text-gray-500 p-10 h-full w-full">
          No Appointment Request
        </div>
      ) : (
        <ul className="list-disc pl-5 mt-4">
          {filteredAppointments.map((appointment) => {
            const appointmentDate = new Date(appointment.date);
            const appointmentTime = new Date(appointment.time);
            const today = new Date().setHours(0, 0, 0, 0);
            const appointmentDateSet = appointmentDate.setHours(0, 0, 0, 0);
            const isToday = appointmentDateSet === today;
            const formattedDate = appointmentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const dayOfWeek = appointmentDate.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const formattedTime = new Date(
              `1970-01-01T${appointment.time}:00`
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <li
                key={appointment._id}
                className="mt-4 p-4 bg-gray-100 border rounded shadow-md list-none"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[#2c6975] font-semibold">
                    <strong>{isToday ? "TODAY" : dayOfWeek}</strong>{" "}
                    {formattedDate}
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleShowDetails(appointment)}
                      className="text-gray-400 hover:text-[#2c6975] mr-2"
                    >
                      <InfoIcon />
                    </button>
                    <button
                      onClick={() =>
                        handleReject(
                          appointment._id,
                          appointment.date,
                          appointment.time
                        )
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <HighlightOffIcon />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <p className="mt-2 uppercase">
                    <strong>{appointment.firstname}</strong>
                  </p>
                  <p className="mt-2 uppercase">
                    <strong> {appointment.lastname}</strong>
                  </p>
                </div>
                <p className="mt-2 text-gray-700 capitalize">
                  {appointment.appointmentType}
                </p>
                <p className="mt-2">
                  <strong>{appointment.time}</strong>
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleAccept(appointment)}
                    className="bg-[#2c6975] text-white font-semibold px-10 py-2 rounded hover:bg-[#1f4f5f]"
                  >
                    Accept
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg mx-4 w-full sm:w-11/12 md:w-3/4 lg:w-1/2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Appointment Details
            </h2>
            <p className="mb-2">
              <strong className="text-gray-700">Date:</strong>{" "}
              {new Date(selectedAppointment.date).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Time:</strong>{" "}
              {selectedAppointment.time}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Type:</strong>{" "}
              {selectedAppointment.appointmentType}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Firstname:</strong>{" "}
              {selectedAppointment.firstname}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Lastname:</strong>{" "}
              {selectedAppointment.lastname}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Email:</strong>{" "}
              {selectedAppointment.email}
            </p>
            <p className="mb-4">
              <strong className="text-gray-700">Role:</strong>{" "}
              {selectedAppointment.role}
            </p>
            <div className="mb-4">
              <strong className="text-gray-700">Receipt:</strong>
              {selectedAppointment.receipt ? (
                <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={selectedAppointment.receipt}
                    alt="Receipt"
                    className="w-full h-auto"
                  />
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            selectedAppointment.receipt
                          );
                          if (response.ok) {
                            const blob = await response.blob();
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = "receipt.jpg";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          } else {
                            console.error("Failed to fetch receipt");
                          }
                        } catch (error) {
                          console.error("Error downloading receipt:", error);
                        }
                      }}
                      className="inline-flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors"
                    >
                      Download Receipt
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">No receipt available</span>
              )}
            </div>
            <button
              onClick={handleCloseDetails}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      <MeetLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default AppointmentRequest;
