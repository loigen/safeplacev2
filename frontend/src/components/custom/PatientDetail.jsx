import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const PatientDetails = ({ patient, onClose, handleAccept, HandleReject }) => {
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
        <div className="top  mb-4">
          <div className="actions">
            {patient.status === "pending" && (
              <>
                <button onClick={() => handleAccept(patient.id)}>Accept</button>
                <button onClick={() => HandleReject(patient.id)}>
                  Decline
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-500 font-bold  text-center capitalize">
          {patient.status}
        </p>
        <hr className=" m-3" />
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
            <b> About</b>
          </Typography>
          <div className="personalInfo text-center items-center flex flex-col text-gray-700">
            <div className="firstname text-center">{patient.time || "N/A"}</div>
            <div className="lastname">{patient.date || "N/A"}</div>
            <div className="emailAddress">{patient.email || "N/A"}</div>
            <div className="typeOfCounseling">
              {patient.typeOfCounseling || "N/A"}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default PatientDetails;
