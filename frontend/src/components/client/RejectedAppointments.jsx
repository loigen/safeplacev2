import React, { useState, useEffect } from "react";
import { fetchAppointmentsByUserId } from "../../api/appointmentAPI/fetchAppointmentsByUserId";
import axiosInstance from "../../config/axiosConfig";

const RejectedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        setError("Error fetching profile.");
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const getAppointments = async () => {
      if (!user) return;
      try {
        const data = await fetchAppointmentsByUserId(user._id);

        const today = new Date().setHours(0, 0, 0, 0);

        const filteredAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.date).setHours(
            0,
            0,
            0,
            0
          );
          return appointment.status === "rejected" && appointmentDate >= today;
        });

        setAppointments(filteredAppointments);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [user]);

  const handleRequestRefund = async () => {
    if (!qrCodeFile) {
      setError("Please upload a QR code file.");
      return;
    }

    const formData = new FormData();
    formData.append("qrCode", qrCodeFile);
    formData.append("appointmentId", selectedAppointmentId);

    try {
      setUploading(true);
      setResponseMessage(null);
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/Appointments/api/appointments/update-with-bank-account`,
        formData,
        { withCredentials: true }
      );

      setResponseMessage(response.data.message);
      setSelectedAppointmentId(null); // Reset after successful request
      setQrCodeFile(null); // Clear the file input after successful request
    } catch (error) {
      console.error("Error submitting refund request:", error);
      setError("Error submitting refund request.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shadow-2xl p-5 flex flex-col gap-5 bg-white rounded-lg">
      <h2 className="font-bold font-mono text-gray-500 text-lg">
        Rejected Appointments
      </h2>
      <div className="w-full">
        {appointments.length === 0 ? (
          <p>No rejected appointments found.</p>
        ) : (
          <ul className="flex flex-col gap-5 w-full">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                style={{ borderLeft: "5px solid #2C6975" }}
                className="shadow-2xl w-full rounded-md p-2"
              >
                <div className="w-full flex justify-end">
                  <p className="p-1 text-slate-50 rounded bg-red-500">
                    {appointment.status}
                  </p>
                </div>
                <div className="capitalize">{appointment.appointmentType}</div>
                <div className="flex flex-row gap-2">
                  <p>{new Date(appointment.date).toLocaleDateString()},</p>
                  {appointment.time}
                </div>
                {appointment.refundReceipt && (
                  <div className="flex justify-end mt-2">
                    <a
                      className="bg-blue-500 text-white py-2 px-5 font-bold rounded-md"
                      href={appointment.refundReceipt}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Receipt
                    </a>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => setSelectedAppointmentId(appointment._id)}
                    className="bg-green-500 text-white py-2 px-5 font-bold rounded-md"
                  >
                    Request Refund
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedAppointmentId && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Submit Refund Request</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQrCodeFile(e.target.files[0])}
            className="border p-2 w-full rounded-md"
          />
          <button
            onClick={handleRequestRefund}
            className="bg-blue-500 text-white py-2 px-5 font-bold rounded-md mt-2"
            disabled={uploading}
          >
            {uploading ? "Submitting..." : "Submit Request"}
          </button>
          {responseMessage && (
            <p className="text-green-500 mt-2">{responseMessage}</p>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default RejectedAppointments;
