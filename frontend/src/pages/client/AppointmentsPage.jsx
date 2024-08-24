import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchUserProfile } from "../../api/userAPI/fetchUserProfile";
import { fetchAvailableSlots } from "../../api/schedulesAPI/fetchAvailableSlots";
import { createAppointment } from "../../api/appointmentAPI/createAppointmentApi";
import { updateSlotStatus } from "../../api/schedulesAPI/updateSlotStatus";
import Appointments from "../../components/client/Appointments";

const AppointmentsPage = () => {
  const [appointmentType, setAppointmentType] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    sex: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await fetchUserProfile();
        const { firstname, lastname, email, role, profilePicture, sex } = user;
        setUser(user);
        setFormData({ firstname, lastname, email, role, profilePicture, sex });
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      try {
        const slots = await fetchAvailableSlots();
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error loading available slots:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailableSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      Swal.fire({
        icon: "warning",
        title: "No Slot Selected",
        text: "Please select a time slot.",
        color: "red",
      });
      return;
    }

    try {
      const appointmentData = new FormData();
      appointmentData.append("date", selectedSlot.date);
      appointmentData.append("time", selectedSlot.time);
      appointmentData.append("appointmentType", appointmentType);
      appointmentData.append("userId", user._id);
      appointmentData.append("firstname", user.firstname);
      appointmentData.append("lastname", user.lastname);
      appointmentData.append("email", user.email);
      appointmentData.append("role", user.role);
      appointmentData.append("avatar", user.profilePicture);
      appointmentData.append("sex", user.sex);

      if (file) {
        appointmentData.append("receipt", file);
      }

      const response = await createAppointment(appointmentData);

      const patchResponse = await updateSlotStatus(selectedSlot._id, "pending");

      if (patchResponse.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Appointment Created",
          text: "Your appointment has been scheduled successfully!",
        });
        setAppointmentType("");
        setSelectedSlot(null);
        setFile(null);
        document.getElementById("receipt").value = "";

        const updatedSlots = await fetchAvailableSlots();
        setAvailableSlots(updatedSlots);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update slot status.",
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  return (
    <div className="flex flex-row justify-around">
      <div>reviews</div>
      <div className="max-w-md p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Schedule an Appointment</h2>

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
                    onClick={() =>
                      setSelectedSlot(
                        selectedSlot && selectedSlot._id === slot._id
                          ? null
                          : slot
                      )
                    }
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
          <div className="mb-4">
            <label
              htmlFor="receipt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Receipt
            </label>
            <input
              type="file"
              id="receipt"
              onChange={handleFileChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            {filePreview && (
              <div className="mt-2">
                <img
                  src={filePreview}
                  alt="File preview"
                  className="w-full h-auto border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
      <Appointments />
    </div>
  );
};

export default AppointmentsPage;
