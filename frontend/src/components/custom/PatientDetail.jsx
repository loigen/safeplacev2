import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const PatientDetails = ({
  patient,
  onClose,
  handleAccept,
  handleReject,
  handleRefund,
}) => {
  const [refundFile, setRefundFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setRefundFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRefundClick = () => {
    if (refundFile) {
      console.log("Processing refund with file:", refundFile);
      handleRefund(patient.id, refundFile);
      setRefundFile(null);
      setPreviewUrl(null);
    } else {
      alert("Please select a file before submitting.");
    }
  };

  return (
    <Modal
      open={!!patient}
      onClose={onClose}
      aria-labelledby="patient-details-modal"
      aria-describedby="patient-details-description"
    >
      <Box className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-16 relative">
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          className="absolute top-2 right-2"
        >
          <span className="text-xl">x</span>
        </IconButton>
        <div className="top mb-4">
          <div className="actions">
            {patient.status === "pending" && (
              <>
                <button onClick={() => handleAccept(patient.id)}>Accept</button>
                <button onClick={() => handleReject(patient.id)}>
                  Decline
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-500 font-bold text-center capitalize">
          {patient.status}
        </p>
        <hr className="m-3" />
        <div className="bg-white flex flex-col items-center mb-4">
          <div className="avatar flex items-center justify-center">
            <img
              src={patient.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
          </div>
          <div className="name text-lg font-bold">{patient.name}</div>
        </div>
        <div className="flex items-center justify-center flex-col mb-4">
          <Typography
            variant="h6"
            className="font-extrabold text-center mb-2 w-full"
          >
            <b>About</b>
          </Typography>
          <div className="personalInfo text-center items-center flex flex-col text-gray-700">
            <div className="firstname text-center">{patient.time || "N/A"}</div>
            <div className="lastname">{patient.date || "N/A"}</div>
            <div className="emailAddress">{patient.email || "N/A"}</div>
            <div className="typeOfCounseling">
              {patient.typeOfCounseling || "N/A"}
            </div>
          </div>
          {patient.status === "requested" && (
            <div className="flex flex-col items-center gap-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="refund-file"
                className="hidden"
              />
              <label
                htmlFor="refund-file"
                className="button border-b-2 cursor-pointer text-[#2c6975] font-bold text-center border-[#2c6975]"
              >
                CLick to Upload
              </label>
              {previewUrl && (
                <div className="preview mt-4">
                  <img
                    src={previewUrl}
                    alt="Refund Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <button
                className="bg-[#2c6975] text-white p-2 rounded-md"
                onClick={handleRefundClick}
              >
                Process Refund
              </button>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default PatientDetails;
