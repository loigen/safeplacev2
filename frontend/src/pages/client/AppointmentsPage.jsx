import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchUserProfile } from "../../api/userAPI/fetchUserProfile";
import { fetchAvailableSlots } from "../../api/schedulesAPI/fetchAvailableSlots";
import { createAppointment } from "../../api/appointmentAPI/createAppointmentApi";
import { updateSlotStatus } from "../../api/schedulesAPI/updateSlotStatus";
import Appointments from "../../components/client/Appointments";
import LoadingSpinner from "../../components/custom/LoadingSpinner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaCloudUploadAlt } from "react-icons/fa";

const AppointmentsPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState(0);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    sex: "",
  });

  const appointmentTypes = [
    { value: "", label: "Select an appointment type" },
    { value: "consultation", label: "Consultation", price: 50 },
    { value: "followup", label: "Follow-Up", price: 30 },
    { value: "checkup", label: "Check-Up", price: 40 },
  ];

  useEffect(() => {
    const selectedType = appointmentTypes.find(
      (type) => type.value === appointmentType
    );
    if (selectedType) {
      setPrice(selectedType.price);
    }
  }, [appointmentType]);
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
    if (!agreementChecked) {
      Swal.fire({
        icon: "warning",
        title: "Agreement Required",
        text: "Please agree to the terms and conditions.",
        color: "red",
      });
      return;
    }
    setSubmitting(true);

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
        setFilePreview(null);
        setCurrentStep(1);
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
    } finally {
      setSubmitting(false);
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
  const handleNext = () => {
    if (currentStep === 1 && (!appointmentType || !selectedSlot)) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please select an appointment type and time slot.",
        color: "red",
      });
      return;
    }
    if (currentStep === 2 && !agreementChecked) {
      Swal.fire({
        icon: "warning",
        title: "Agreement Required",
        text: "Please agree to the terms and conditions.",
        color: "red",
      });
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };
  const renderStepContent = () => {
    const isNextButtonDisabled =
      currentStep === 1 && availableSlots.length === 0;

    switch (currentStep) {
      case 1:
        return (
          <div className="flex h-full p-2 flex-col justify-center items-center">
            <div className="mb-4 w-full">
              <label
                htmlFor="appointmentType"
                className="block text-sm font-medium text-gray-700"
              >
                Appointment Type
              </label>
              <select
                id="appointmentType"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select</option>
                <option value="consultation">Consultation</option>
                <option value="followup">Follow-Up</option>
                <option value="checkup">Check-Up</option>
              </select>
            </div>
            <div className="mb-4 h-full w-full  flex flex-col">
              <div className="grid grid-cols-1 w-full gap-4">
                {loading ? (
                  <p className="text-gray-500">Loading available slots...</p>
                ) : availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <div
                      key={slot._id}
                      className={`p-4 border rounded-md cursor-pointer hover:border-[#2C6975] ${
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
                  <p className="h-full text-center items-center">
                    No available slots.
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className={`btn btn-primary bg-[#2C6975] px-4 py-1 text-white rounded-md ${
                isNextButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isNextButtonDisabled}
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="bg-[#2C6975] py-10"></div>
            <div className="mb-4 p-3 text-justify flex flex-col gap-1 justify-center items-center">
              <h1 className="font-semibold text-xl w-full">Agreement</h1>
              <hr className="border border-[#2C6975] w-full" />
              <p className="text-xs text-gray-600 text-justify">
                Before proceeding to the payment process, please review the
                following rules and regulations regarding the collection of your
                information.
              </p>
              <ol className="pl-4 p-2">
                <li className=" text-sm ">
                  1. Data Privacy: Your personal information will be collected
                  and used solely for the purpose of scheduling and confirming
                  your appointment with Dr. Jeb.
                </li>
                <li className=" text-sm ">
                  <span>2. Confidentiality: </span>
                  <p>
                    All data provided will be kept confidential and will not be
                    shared with third parties without your consent.
                  </p>
                </li>
                <li className=" text-sm ">
                  <span>3. Accuracy: </span>
                  <p>
                    {" "}
                    Ensure that the information you provide is accurate and
                    up-to-date to facilitate a smooth booking process.
                  </p>
                </li>
                <li className="text-sm ">
                  <span>4. Security: </span>
                  <p>
                    We employ secure methods to protect your data during
                    collection and storage.
                  </p>
                </li>
                <li className=" text-sm ">
                  <span>5. Consent: </span>
                  <p>
                    By providing your information, you consent to its use as
                    outlined in our privacy policy.
                  </p>
                </li>
              </ol>
              <p className="text-sm">
                By proceeding to the payment process, you acknowledge that you
                have read and agree to these terms.
              </p>
              <label className="flex items-center w-full">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mr-2"
                />
                <span>I agree to the terms and conditions.</span>
              </label>
            </div>
            <div className="w-full flex justify-center gap-2 p-2 items-center">
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-secondary bg-[#2C6975] py-1 px-6 text-white rounded-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary bg-[#2C6975] py-1 px-6 text-white rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-2">
            <div className="mb-4 flex flex-col gap-2 p-2">
              <div className="p-4 border border-gray-300 rounded-md shadow-lg">
                <p className="flex gap-2">
                  <b className=" underline">STEP 1:</b>
                  Choose a payment method below.
                </p>
                <p>QR Code Image</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-md shadow-lg">
                <p className="">
                  <b className=" underline">STEP 2:</b> {""}
                  Pay the right amount and take a screenshot/picture of the
                  proof of payment.
                </p>
              </div>
              <div className="p-4 border border-gray-300 rounded-md shadow-lg">
                <p className="text-gray-700">
                  <b className="underline">STEP 3:</b> {""}
                  Upload your proof of payment below to successfully book an
                  appointment.
                </p>
                <br />
                <label className="flex items-center justify-center w-full cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
                    <FaCloudUploadAlt className="mr-2" />
                    <span>Choose File</span>
                  </div>
                </label>
                <div className="flex justify-center">
                  {filePreview && (
                    <img
                      src={filePreview}
                      alt="Receipt Preview"
                      className="mt-4 border border-gray-300 rounded-md"
                      style={{ width: "300px", height: "auto" }} // Adjust width and height here
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-secondary bg-[#2C6975] py-1 px-6 text-white rounded-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary bg-[#2C6975] py-1 px-6 text-white rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col h-full p-2">
            {" "}
            <button
              className="w-full p-2 flex justify-start text-[#2C6975] "
              type="button"
              onClick={handleBack}
            >
              <ArrowBackIcon style={{ fontSize: "2rem" }} />
            </button>
            <p className="text-xl capitalize text-[#2C6975] font-bold w-full text-center">
              Confirm and Schedule your appointment
            </p>
            <div className="w-full max-w-md p-4  rounded-md bg-white">
              <p className="mb-2 capitalize">
                <strong>Name:</strong> {formData.firstname} {formData.lastname}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="mb-2 capitalize">
                <strong>Appointment Type:</strong> {appointmentType}
              </p>

              <p className="mb-2">
                <strong>Date:</strong>{" "}
                {selectedSlot
                  ? new Date(selectedSlot.date).toLocaleDateString()
                  : ""}
              </p>
              <p className="mb-2">
                <strong>Time:</strong> {selectedSlot ? selectedSlot.time : ""}
              </p>
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Receipt Preview"
                  className="mt-4 border border-gray-300 rounded-md"
                  style={{ width: "300px", height: "auto" }}
                />
              )}
            </div>
            <div className="w-full flex justify-end p-2">
              {" "}
              <p className="mb-2">
                <strong>Payment = </strong> PHP {price}
              </p>
            </div>
            <hr className="w-full border" />
            <div className="flex flex-col justify-center items-center h-full">
              <br />
              <div className="flex justify-center w-full gap-2">
                <button
                  type="button"
                  className="bg-[#2C6975] py-2 px-6 text-white rounded-md"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Schedule Appointment"}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-row p-10 justify-around">
      <div>reviews</div>
      <form
        className="bg-white w-1/3 shadow-2xl rounded-md"
        onSubmit={(e) => e.preventDefault()}
      >
        {loading ? <LoadingSpinner /> : renderStepContent()}
      </form>
      <Appointments />
    </div>
  );
};

export default AppointmentsPage;
