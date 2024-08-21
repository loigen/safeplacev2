import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { getPatientData } from "../api/appointmentAPI/getPatientDataApi";
import PatientDetails from "../custom/PatientDetail";
import PatientList from "../custom/PatientList";
import "../../styles/patient.css";
import AppointmentStats from "../custom/AppointmentStats";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activePatientIdList, setActivePatientIdList] = useState(null);
  const [activeTab, setActiveTab] = useState("Reports");
  const [newReports, setNewReports] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatientData();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        Swal.fire("Error", "Failed to fetch patient data", "error");
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleToggleActionsList = (patientId) => {
    setActivePatientIdList(
      patientId === activePatientIdList ? null : patientId
    );
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  const handleAccept = async (id) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/Appointments/api/accept/${id}`
      );
      setPatients(patients.filter((patient) => patient.id !== id));
      Swal.fire("Success", "Appointment accepted successfully", "success");
    } catch (error) {
      console.error("Error accepting appointment:", error);
      Swal.fire("Error", "Failed to accept the appointment", "error");
    }
    setSelectedPatient(null);
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/Appointments/api/reject/${id}`
      );
      setPatients(patients.filter((patient) => patient.id !== id));
      Swal.fire("Success", "Appointment rejected successfully", "success");
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      Swal.fire("Error", "Failed to reject the appointment", "error");
    }
  };

  return (
    <div className="patientsContainer">
      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={handleCloseModal}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      )}
      <div className="p-2 flex flex-wrap w-full flex-row justify-center">
        <PatientList
          patients={patients}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPatientSelect={handlePatientSelect}
          onToggleActionsList={handleToggleActionsList}
          activePatientIdList={activePatientIdList}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
        <AppointmentStats />
      </div>
    </div>
  );
};

export default Patients;
