import React, { useState } from "react";
import "../../styles/patient.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NewFolderModal from "../custom/newFolderModal";
import CustomFileUpload from "../custom/customInputField";

const dummyData = {
  patients: [
    {
      id: 1,
      date: "2024-07-25",
      time: "10:00 AM",
      name: "John Doe",
      status: "Pending",
      typeOfCounseling: "Psychological",
      appointmentHistory: [
        { date: "2024-07-20", time: "09:00 AM", day: "Monday" },
        { date: "2024-07-15", time: "11:00 AM", day: "Wednesday" },
        { date: "2024-07-10", time: "10:30 AM", day: "Friday" },
        { date: "2024-07-05", time: "09:45 AM", day: "Monday" },
      ],
      reports: [
        {
          category: "Assessments",
          files: ["report1.pdf"],
        },
      ],
    },
    {
      id: 2,
      date: "2024-07-24",
      time: "02:00 PM",
      name: "Jane Smith",
      status: "Completed",
      typeOfCounseling: "Therapeutic",
      appointmentHistory: [
        { date: "2024-07-18", time: "10:00 AM", day: "Thursday" },
        { date: "2024-07-12", time: "01:00 PM", day: "Friday" },
      ],
      reports: [],
    },
    {
      id: 3,
      date: "2024-07-23",
      time: "01:00 PM",
      name: "Mike Johnson",
      status: "Ready",
      typeOfCounseling: "Counseling",
      appointmentHistory: [
        { date: "2024-07-19", time: "03:00 PM", day: "Friday" },
        { date: "2024-07-14", time: "02:00 PM", day: "Monday" },
      ],
      reports: [],
    },
  ],
};
const Patients = () => {
  // State management
  const [patients] = useState(dummyData.patients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activePatientIdList, setActivePatientIdList] = useState(null);
  const [activePatientIdView, setActivePatientIdView] = useState(null);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("General");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 6;
  const [position, setPosition] = useState("-50%");

  // Handlers
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setActivePatientIdList(null);
    setActivePatientIdView(null);
    setPosition("2%");
  };

  const handlePositionClose = () => {
    setPosition("-50%");
  };

  const toggleActionsList = (patientId) => {
    setActivePatientIdList((prevId) =>
      prevId === patientId ? null : patientId
    );
  };

  const toggleActionsView = (patientId) => {
    setActivePatientIdView((prevId) =>
      prevId === patientId ? null : patientId
    );
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNewFolder = () => {
    if (newFolderName.trim() && selectedPatient) {
      const updatedPatient = { ...selectedPatient };
      updatedPatient.reports.push({ category: newFolderName, files: [] });
      setSelectedPatient(updatedPatient);
      setNewFolderName("");
      setShowModal(false);
    }
  };

  const handleFileUpload = () => {
    if (newFile && selectedPatient && selectedFolderIndex !== null) {
      const updatedPatient = { ...selectedPatient };
      updatedPatient.reports[selectedFolderIndex].files.push(newFile.name);
      setSelectedPatient(updatedPatient);
      setNewFile(null);
    }
  };
  const handleBackToFolders = () => {
    setSelectedFolderIndex(null);
  };
  const filteredPatients = patients.filter((patient) => {
    return (
      (filter === "" || patient.status === filter) &&
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastPatient = currentPage * itemsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderTabContent = () => {
    if (!selectedPatient) return null;

    switch (activeTab) {
      case "General":
        const allFiles = selectedPatient.reports.flatMap(
          (report) => report.files
        );
        return (
          <div>
            <div className="header">
              <h1>General Files</h1>
            </div>
            <div className="contPart">
              {allFiles.length > 0 ? (
                allFiles.map((file, index) => (
                  <div key={index}>
                    <a href={`/path/to/reports/${file}`} target="_blank">
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
              <h1>Reports</h1>
              {selectedFolderIndex === null ? (
                <div>
                  <button onClick={() => setShowModal(true)}>
                    Create New Folder
                  </button>
                </div>
              ) : (
                <div className="flex justify-between gap-2">
                  <CustomFileUpload onFileChange={setNewFile} />
                  <button onClick={handleFileUpload}>Add</button>
                </div>
              )}
            </div>
            <div className="contPart">
              <button className="class " onClick={handleBackToFolders}>
                <ChevronLeftIcon />
              </button>
              {selectedPatient.reports.length > 0 ? (
                selectedPatient.reports.map((report, folderIndex) => (
                  <div key={folderIndex}>
                    <h2
                      className="font-bold"
                      onClick={() => setSelectedFolderIndex(folderIndex)}
                    >
                      {report.category}
                    </h2>
                    {selectedFolderIndex === folderIndex && (
                      <div>
                        {report.files.map((file, fileIndex) => (
                          <div key={fileIndex}>
                            <a
                              href={`/path/to/reports/${file}`}
                              target="_blank"
                            >
                              {file}
                            </a>
                          </div>
                        ))}
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
            <h1 className="font-bold">Appointment History</h1>
            <div className="historyContainer">
              {selectedPatient.appointmentHistory &&
              selectedPatient.appointmentHistory.length > 0 ? (
                selectedPatient.appointmentHistory.map((appointment, index) => (
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
    <div className="patients">
      <div className="listContainer">
        <div className="searchContainer">
          <div className="searchIcon">🔍</div>
          <div className="searchField">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="list">
          <div className="header">
            <h1>Patients</h1>
            <div className="dropdown">
              <select
                name=""
                id=""
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="">All patients</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="patientList">
            {currentPatients.map((patient) => (
              <div
                key={patient.id}
                className="patient"
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="dateTime">
                  <div className="date">{patient.date}</div>|
                  <div className="time">{patient.time}</div>
                </div>
                <div className="patientStatus">
                  <div className="name">{patient.name}</div>
                  <div className="status">{patient.status}</div>
                  <div className="typeOfCounseling">
                    {patient.typeOfCounseling}
                  </div>
                  <div className="actions">
                    {(patient.status === "Pending" ||
                      patient.status === "Ready") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActionsList(patient.id);
                        }}
                      >
                        ...
                      </button>
                    )}
                    {activePatientIdList === patient.id && (
                      <div className="dropdownMenu">
                        {patient.status === "Pending" && (
                          <>
                            <button>Accept</button>
                            <button>Decline</button>
                          </>
                        )}
                        {patient.status === "Ready" && (
                          <button className="w-full">Go to Room</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="gender">Female</div>
              </div>
            ))}
          </div>
          <div className="pages">
            <div className="itemsPerPage">
              {`${indexOfFirstPatient + 1}-${Math.min(
                indexOfLastPatient,
                filteredPatients.length
              )} of ${filteredPatients.length}`}
            </div>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="appointmentStatistics w-1/2 h-full">
        <div className="title font-semibold">Appointment Statistics</div>
        <br />
        <div className="flex flex-col justify-between gap-5">
          <div className="card1 bg-white px-5 py-14 shadow-xl rounded-lg">
            <div className="userlist">
              <div className="latest1"></div>
              <div className="latest2"></div>
              <div className="latest3"></div>
            </div>
            <div className="overview">
              <b className="counts"></b>
              <p>Pending Appointments</p>
            </div>
          </div>
          <div className="card2 bg-white px-5 py-14 shadow-xl rounded-lg">
            <div className="userlist">
              <div className="latest1"></div>
              <div className="latest2"></div>
              <div className="latest3"></div>
            </div>
            <div className="overview">
              <b className="counts"></b>
              <p>Approved Appointments</p>
            </div>
          </div>
          <div className="card3 bg-white px-5 py-14 shadow-xl rounded-lg">
            <div className="userlist">
              <div className="latest1"></div>
              <div className="latest2"></div>
              <div className="latest3"></div>
            </div>
            <div className="overview">
              <b className="counts "></b>
              <p>Completed Appointments</p>
            </div>
          </div>
          <div className="card4 bg-white px-5 py-14 shadow-xl rounded-lg">
            <div className="userlist">
              <div className="latest1"></div>
              <div className="latest2"></div>
              <div className="latest3"></div>
            </div>
            <div className="overview">
              <b className="counts"></b>
              <p>Cancelled Appointments</p>
            </div>
          </div>
        </div>
      </div>
      {selectedPatient && (
        <div style={{ right: position }} className="viewContainer">
          <p onClick={handlePositionClose}>x</p>
          <div className="top">
            <div className="status">{selectedPatient.status}</div>
            <div className="actions">
              {(selectedPatient.status === "Pending" ||
                selectedPatient.status === "Ready") && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleActionsView(selectedPatient.id);
                  }}
                >
                  ...
                </button>
              )}
              {activePatientIdView === selectedPatient.id && (
                <div className="dropdownMenu">
                  {selectedPatient.status === "Pending" && (
                    <>
                      <button>Accept</button>
                      <button>Decline</button>
                    </>
                  )}
                  {selectedPatient.status === "Ready" && (
                    <button>Go to Room</button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="profile">
            <div className="avatar">
              <img src="https://via.placeholder.com/150" alt="Avatar" />
            </div>
            <div className="name">{selectedPatient.name}</div>
          </div>
          <div className="about">
            <h1>About</h1>
            <hr />
            <div className="personalInfo">
              <div className="firstname">
                {selectedPatient.firstname || "N/A"}
              </div>
              <div className="lastname">
                {selectedPatient.lastname || "N/A"}
              </div>
              <div className="emailAddress">
                {selectedPatient.emailAddress || "N/A"}
              </div>
              <div className="typeOfCounseling">
                {selectedPatient.typeOfCounseling || "N/A"}
              </div>
            </div>
          </div>
          <div className="patientHistory">
            <div className="actionNavlink">
              <div
                className={`general ${activeTab === "General" ? "active" : ""}`}
                onClick={() => setActiveTab("General")}
              >
                General
              </div>
              <div
                className={`reports ${activeTab === "Reports" ? "active" : ""}`}
                onClick={() => setActiveTab("Reports")}
              >
                Reports
              </div>
              <div
                className={`history ${activeTab === "History" ? "active" : ""}`}
                onClick={() => setActiveTab("History")}
              >
                Patient History
              </div>
            </div>
            <div className="view">{renderTabContent()}</div>
          </div>
          <hr />
        </div>
      )}

      <NewFolderModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleNewFolder}
        folderName={newFolderName}
        onFolderNameChange={(e) => setNewFolderName(e.target.value)}
      />
    </div>
  );
};

export default Patients;
