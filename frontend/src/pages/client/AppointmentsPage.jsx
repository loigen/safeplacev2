import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchAvailableSlots } from "../../api/schedulesAPI/fetchAvailableSlots";
import { createAppointment } from "../../api/appointmentAPI/createAppointmentApi";
import { updateSlotStatus } from "../../api/schedulesAPI/updateSlotStatus";
import { LoadingSpinner } from "../../components/custom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  CanceledAppointments,
  RejectedAppointments,
  RefundedAppointments,
  Appointments,
} from "../../components/client";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const AppointmentsPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const handleCreateAppointment = () => {
    setShowContent(true);
  };
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
        const { firstname, lastname, email, role, profilePicture, sex } = user;
        setFormData({ firstname, lastname, email, role, profilePicture, sex });
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, []);

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
  useEffect(() => {
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
          willClose: () => {
            window.location.reload();
          },
        });

        setAppointmentType("");
        setSelectedSlot(null);
        setFile(null);
        setFilePreview(null);
        setCurrentStep(1);
        document.getElementById("receipt").value = "";
        await loadAvailableSlots();

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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 2,
            }}
          >
            <Box sx={{ mb: 4, width: "100%" }}>
              <Typography variant="h6" align="center">
                Create Appointment
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Appointment Type
                </Typography>
                <Select
                  id="appointmentType"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  sx={{
                    mt: 1,
                    width: "50%",
                    px: 2,
                    py: 1,
                    borderColor: "gray.300",
                    borderRadius: 1,
                    "&:focus": {
                      borderColor: "primary.main",
                      boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.5)",
                    },
                  }}
                  required
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="followup">Follow-Up</MenuItem>
                  <MenuItem value="checkup">Check-Up</MenuItem>
                </Select>
              </Box>
            </Box>
            <Box
              sx={{
                mb: 4,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Grid container spacing={2}>
                {loading ? (
                  <Typography variant="body2" color="text.secondary">
                    Loading available slots...
                  </Typography>
                ) : availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <Grid item xs={12} key={slot._id}>
                      <Box
                        sx={{
                          p: 2,
                          border: "1px solid",
                          borderColor:
                            selectedSlot && selectedSlot._id === slot._id
                              ? "primary.main"
                              : "gray.300",
                          borderRadius: 1,
                          backgroundColor:
                            selectedSlot && selectedSlot._id === slot._id
                              ? "background.paper"
                              : "white",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "primary.main",
                          },
                        }}
                        onClick={() =>
                          setSelectedSlot(
                            selectedSlot && selectedSlot._id === slot._id
                              ? null
                              : slot
                          )
                        }
                      >
                        <Typography>
                          <strong>Date:</strong>{" "}
                          {new Date(slot.date).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          <strong>Time:</strong> {slot.time}
                        </Typography>
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                  >
                    No available slots.
                  </Typography>
                )}
              </Grid>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                borderRadius: 1,
                backgroundColor: "#2C6975",
                "&:hover": {
                  backgroundColor: "#1a4c5d",
                },
                opacity: isNextButtonDisabled ? 0.5 : 1,
                cursor: isNextButtonDisabled ? "not-allowed" : "pointer",
              }}
              disabled={isNextButtonDisabled}
            >
              Next
            </Button>
          </Box>
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
                  <b className="">STEP 1:</b>
                  Choose a payment method below.
                </p>
                <p>QR Code Image</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-md shadow-lg">
                <p className="">
                  <b className="">STEP 2:</b> {""}
                  Pay the right amount and take a screenshot/picture of the
                  proof of payment.
                </p>
              </div>
              <div className="p-4 border border-gray-300 rounded-md shadow-lg">
                <p className="text-gray-700">
                  <b className="">STEP 3:</b> {""}
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
                      style={{ width: "300px", height: "auto" }}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              p: 2,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              sx={{
                alignSelf: "flex-start",
                color: "#2C6975",
                textAlign: "left",
                mb: 2,
              }}
              onClick={handleBack}
            >
              Back
            </Button>
            <Typography
              variant="h6"
              sx={{
                color: "#2C6975",
                fontWeight: "bold",
                textAlign: "center",
                mb: 2,
              }}
            >
              Confirm and Schedule your appointment
            </Typography>
            <Box
              sx={{
                width: "100%",
                maxWidth: 600,
                p: 4,
                borderRadius: 1,
                bgcolor: "white",
              }}
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Name:</strong> {formData.firstname} {formData.lastname}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> {formData.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Appointment Type:</strong> {appointmentType}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Date:</strong>{" "}
                {selectedSlot
                  ? new Date(selectedSlot.date).toLocaleDateString()
                  : ""}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Time:</strong> {selectedSlot ? selectedSlot.time : ""}
              </Typography>
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Receipt Preview"
                  style={{
                    width: "300px",
                    height: "auto",
                    marginTop: "16px",
                    border: "1px solid #d1d1d1",
                    borderRadius: "8px",
                  }}
                />
              )}
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Payment = </strong> PHP {price}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ mt: 2 }}
              >
                {submitting ? "Submitting..." : "Schedule Appointment"}
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col md:flex-row p-10 justify-between gap-10">
      <div className="w-full mb-4 md:mb-0">
        <CanceledAppointments />
        <br />
        <RejectedAppointments />
        <br />
        <RefundedAppointments />
      </div>
      <form
        className="bg-white w-full shadow-2xl rounded-md mb-4 md:mb-0"
        onSubmit={(e) => e.preventDefault()}
      >
        {showContent ? (
          loading ? (
            <LoadingSpinner />
          ) : (
            renderStepContent()
          )
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAppointment}
            >
              Create Appointment
            </Button>
          </Box>
        )}
      </form>
      <Appointments />
    </div>
  );
};

export default AppointmentsPage;
