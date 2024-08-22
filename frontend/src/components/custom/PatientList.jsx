import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "../../styles/pagination.css";
import Swal from "sweetalert2";
const PatientList = ({
  patients,
  itemsPerPage,
  onPatientSelect,
  handleAccept,
  handleReject,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activePatientId, setActivePatientId] = useState(null);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(0);
  };

  const filteredPatients = selectedStatus
    ? patients.filter(
        (patient) =>
          patient.status.toLowerCase() === selectedStatus.toLowerCase()
      )
    : patients;

  const offset = currentPage * itemsPerPage;
  const currentPatients = filteredPatients.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredPatients.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const startRecord = offset + 1;
  const endRecord = Math.min(offset + itemsPerPage, filteredPatients.length);

  return (
    <div className="list w-[70%]">
      <div className="header">
        <h1>Patients</h1>
        <div className="dropdown">
          <select
            name="status"
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="status-select"
          >
            <option value="">All patients</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="patientList flex flex-col gap-2">
        {currentPatients.length > 0 ? (
          currentPatients.map((patient) => (
            <div
              className="client m-2 p-2"
              style={{ borderBottom: "1px solid gray" }}
              key={patient.id}
              onClick={() => onPatientSelect(patient)}
            >
              <div className="dateTime">
                <div className="date">{patient.date}</div>|
                <div className="time ">{patient.time}</div>
              </div>
              <div className="patientStatus">
                <div className="name capitalize">{patient.name}</div>
                <div className="status capitalize">
                  <b className="text-gray-800">{patient.status}</b>
                </div>
                <div className=" text-gray-800 capitalize">
                  <b>{patient.typeOfCounseling}</b>
                </div>
                <div className="actions">
                  {(patient.status === "pending" ||
                    patient.status === "accepted") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePatientId(
                          activePatientId === patient.id ? null : patient.id
                        );
                      }}
                    >
                      <MoreHorizIcon />
                    </button>
                  )}
                  {activePatientId === patient.id && (
                    <div className="dropdownMenu">
                      {patient.status === "pending" && (
                        <>
                          <button onClick={() => handleAccept(patient.id)}>
                            Accept
                          </button>
                          <button onClick={() => handleReject(patient.id)}>
                            Decline
                          </button>
                        </>
                      )}
                      {patient.status === "accepted" && (
                        <>
                          <a
                            href={patient.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!patient.meetLink) {
                                e.preventDefault();
                                Swal.fire(
                                  "Error",
                                  "Meeting link is not available",
                                  "error"
                                );
                              }
                            }}
                          >
                            Go to Room
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div>{patient.sex}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            No records available
          </div>
        )}
      </div>

      {filteredPatients.length > itemsPerPage && (
        <div className="paginationContainer">
          <div className="paginationInfo">
            {startRecord}-{endRecord} of {filteredPatients.length}
          </div>
          <div className="paginationControls">
            <button
              className={`paginationButton ${
                currentPage === 0 ? "disabled" : ""
              }`}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeftIcon />
            </button>
            <button
              className={`paginationButton ${
                currentPage === pageCount - 1 ? "disabled" : ""
              }`}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageCount - 1}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
