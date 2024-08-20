import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CustomFileUpload from "../custom/customInputField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const PatientDetails = ({
  patient,
  activeTab,
  setActiveTab,
  handleNewFolder,
  newFolderName,
  setNewFolderName,
  handleFileUpload,
  newFile,
  setNewFile,
  selectedFolderIndex,
  setSelectedFolderIndex,
  handleBackToFolders,
  onClose,
  handleAccept,
  HandleReject,
}) => {
  const renderTabContent = () => {
    if (!patient) return null;

    switch (activeTab) {
      case "General":
        const allFiles =
          patient.reports?.flatMap((report) => report.files) || [];
        return (
          <div>
            <div className="header">
              <Typography variant="h6">General Files</Typography>
            </div>
            <div className="contPart">
              {allFiles.length > 0 ? (
                allFiles.map((file, index) => (
                  <div key={index}>
                    <a
                      href={`/path/to/reports/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file}
                    </a>
                  </div>
                ))
              ) : (
                <div>No files available</div>
              )}
            </div>
          </div>
        );

      case "Reports":
        return (
          <div>
            <div className="header">
              <Typography variant="h6">Reports</Typography>
              {selectedFolderIndex === null ? (
                <div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setNewFolderName(true)}
                  >
                    Create New Folder
                  </button>
                </div>
              ) : (
                <div className="flex justify-between flex-wrap gap-2">
                  <CustomFileUpload onFileChange={setNewFile} />
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleFileUpload}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
            <div className="contPart">
              <button
                className="bg-gray-200 p-2 rounded"
                onClick={handleBackToFolders}
              >
                <ChevronLeftIcon />
              </button>
              {patient.reports && patient.reports.length > 0 ? (
                patient.reports.map((report, folderIndex) => (
                  <div key={folderIndex}>
                    <Typography
                      variant="h6"
                      className="font-bold cursor-pointer"
                      onClick={() => setSelectedFolderIndex(folderIndex)}
                    >
                      {report.category}
                    </Typography>
                    {selectedFolderIndex === folderIndex && (
                      <div>
                        {report.files && report.files.length > 0 ? (
                          report.files.map((file, fileIndex) => (
                            <div key={fileIndex}>
                              <a
                                href={`/path/to/reports/${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {file}
                              </a>
                            </div>
                          ))
                        ) : (
                          <div>No files available in this folder</div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>No reports available</div>
              )}
            </div>
          </div>
        );

      case "History":
        return (
          <div className="appointmentHistory">
            <Typography variant="h6" className="font-bold">
              Appointment History
            </Typography>
            <div className="historyContainer">
              {patient.appointmentHistory &&
              patient.appointmentHistory.length > 0 ? (
                patient.appointmentHistory.map((appointment, index) => (
                  <div key={index} className="data">
                    <div className="day">
                      <div>{appointment.day}</div>
                      <div>{appointment.date}</div>
                    </div>
                    <div>{appointment.time}</div>
                  </div>
                ))
              ) : (
                <div>No appointment history available</div>
              )}
            </div>
          </div>
        );

      default:
        return null;
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
          <div className="status text-gray-500 capitalize">
            {patient.status}
          </div>
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
        <div className="bg-white flex flex-col items-center mb-4">
          <div className="avatar mr-4">
            <img
              src={patient.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
          </div>
          <div className="name text-lg font-bold">{patient.name}</div>
        </div>
        <div className="about mb-4">
          <Typography variant="h6" className="font-bold mb-2">
            About
          </Typography>
          <hr className="mb-2" />
          <div className="personalInfo text-gray-700">
            <div className="firstname">{patient.firstname || "N/A"}</div>
            <div className="lastname">{patient.lastname || "N/A"}</div>
            <div className="emailAddress">{patient.emailAddress || "N/A"}</div>
            <div className="typeOfCounseling">
              {patient.typeOfCounseling || "N/A"}
            </div>
          </div>
        </div>
        <div className="patientHistory">
          <div className="actionNavlink flex mb-4">
            <div
              className={`tab cursor-pointer px-4 py-2 rounded-t ${
                activeTab === "General"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("General")}
            >
              General
            </div>
            <div
              className={`tab cursor-pointer px-4 py-2 rounded-t ${
                activeTab === "Reports"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("Reports")}
            >
              Reports
            </div>
            <div
              className={`tab cursor-pointer px-4 py-2 rounded-t ${
                activeTab === "History"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("History")}
            >
              Patient History
            </div>
          </div>
          <div className="tabContent">{renderTabContent()}</div>
        </div>
      </Box>
    </Modal>
  );
};

export default PatientDetails;
