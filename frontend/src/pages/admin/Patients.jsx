import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getPatientData } from "../../api/appointmentAPI/getPatientDataApi";
import PatientDetails from "../../components/custom/PatientDetail";
import PatientList from "../../components/custom/PatientList";
import "../../styles/patient.css";
import AppointmentStats from "../../components/custom/AppointmentStats";
import axiosInstance from "../../config/axiosConfig";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activePatientIdList, setActivePatientIdList] = useState(null);
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
      await axiosInstance.patch(
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
      await axiosInstance.patch(
        `${process.env.REACT_APP_API_URL}/Appointments/api/reject/${id}`
      );
      setPatients(patients.filter((patient) => patient.id !== id));
      Swal.fire("Success", "Appointment rejected successfully", "success");
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      Swal.fire("Error", "Failed to reject the appointment", "error");
    }
  };

  const handleRefund = async (id, file) => {
    const formData = new FormData();
    formData.append("refundReceipt", file);
    formData.append("appointmentId", id);

    console.log("Sending refund request with formData:", formData);

    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/Appointments/api/refund`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Success", "Refund processed successfully", "success");
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error processing refund:", error);
      Swal.fire("Error", "Failed to process refund", "error");
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
          handleRefund={handleRefund}
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
