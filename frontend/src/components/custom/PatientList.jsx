import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "../../styles/pagination.css";

const PatientList = ({
  patients,
  itemsPerPage,
  onPatientSelect,
  onToggleActionsList,
  activePatientIdList,
  handleAccept,
  handleReject,
  handleAction,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");

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

  return (
    <div className="list">
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
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="patientList">
        {currentPatients.length > 0 ? (
          currentPatients.map((patient) => (
            <div
              key={patient.id}
              className="patient"
              onClick={() => onPatientSelect(patient)}
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
                        onToggleActionsList(patient.id);
                      }}
                    >
                      <MoreHorizIcon />
                    </button>
                  )}
                  {activePatientIdList === patient.id && (
                    <div className="dropdownMenu">
                      {patient.status === "Pending" && (
                        <>
                          <button onClick={() => handleAccept(patient.id)}>
                            Accept
                          </button>
                          <button onClick={() => handleReject(patient.id)}>
                            Decline
                          </button>
                        </>
                      )}
                      {patient.status === "Accepted" && (
                        <button
                          onClick={() => handleAction(patient.id, "goToRoom")}
                          className="w-full"
                        >
                          Go to Room
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="gender">Female</div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            No records available
          </div>
        )}
      </div>

      {filteredPatients.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item previous"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item next"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
};

export default PatientList;
