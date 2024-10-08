import React, { useState, useEffect } from "react";
import { fetchAppointmentsByUserId } from "../../api/appointmentAPI/fetchAppointmentsByUserId";
import { useAuth } from "../../context/AuthContext";

const RefundedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

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
          return appointment.status === "refunded" && appointmentDate >= today;
        });

        setAppointments(filteredAppointments);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [user]);

  const handleShowReceipt = (receiptUrl) => {
    setSelectedReceipt(receiptUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReceipt(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shadow-2xl p-5 flex flex-col gap-5 bg-white rounded-lg">
      <h2 className="font-bold font-mono text-gray-500 text-lg">
        Refunded Appointments
      </h2>
      <div className="w-full">
        {appointments.length === 0 ? (
          <p>No refunded appointments found.</p>
        ) : (
          <ul className="flex flex-col gap-5 w-full">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                style={{ borderLeft: "5px solid #2C6975" }}
                className="shadow-2xl w-full rounded-md p-2"
              >
                <div className="w-full flex justify-end capitalize">
                  <p className="p-1 text-slate-50 rounded bg-green-500">
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
                    <button
                      className="bg-[#2c6975] text-white py-2 px-5 font-bold rounded-md"
                      onClick={() =>
                        handleShowReceipt(appointment.refundReceipt)
                      }
                    >
                      Show Receipt
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-2xl">
            <div className="flex justify-end">
              <button className="text-red-500 font-bold" onClick={closeModal}>
                Close
              </button>
            </div>
            {selectedReceipt && (
              <img
                className="max-w-full max-h-96 mt-4 rounded-md"
                src={selectedReceipt}
                alt="Refund Receipt"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundedAppointments;
