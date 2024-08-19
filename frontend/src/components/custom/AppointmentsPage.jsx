import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          { withCredentials: true }
        );
        const { firstname, lastname, email, role } = response.data.user;
        setUser(response.data.user);
        setFormData({ firstname, lastname, email, role });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load user profile.",
        });
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/schedules/slots`,
          { withCredentials: true }
        );
        setAvailableSlots(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load available slots.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
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
      const formData = new FormData();
      formData.append("date", selectedSlot.date);
      formData.append("time", selectedSlot.time);
      formData.append("appointmentType", appointmentType);
      formData.append("userId", user._id);
      formData.append("firstname", user.firstname);
      formData.append("lastname", user.lastname);
      formData.append("email", user.email);
      formData.append("role", user.role);

      if (file) {
        formData.append("receipt", file);
        console.log(FormData);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Appointments/api/appointments`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const patchResponse = await axios.patch(
        `${process.env.REACT_APP_API_URL}/schedules/slots/${selectedSlot._id}`,
        { status: "pending" },
        { withCredentials: true }
      );

      if (patchResponse.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Appointment Created",
          text: "Your appointment has been scheduled successfully!",
        });
        setAppointmentType("");
        setSelectedSlot(null);
        setFile(null);
        document.getElementById("receipt").value = ""; // Clear the file input

        const updatedSlots = await axios.get(
          `${process.env.REACT_APP_API_URL}/schedules/slots`,
          { withCredentials: true }
        );
        setAvailableSlots(updatedSlots.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update slot status.",
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error.response || error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create appointment.",
      });
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
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
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
          className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentsPage;
