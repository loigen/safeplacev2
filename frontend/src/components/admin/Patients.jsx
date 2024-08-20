import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { getPatientData } from "../api/getPatientDataApi";
import PatientDetails from "../custom/PatientDetail";
import PatientList from "../custom/PatientList";
import "../../styles/patient.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activePatientIdList, setActivePatientIdList] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(null);
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

  const handleNewFolder = async () => {
    if (!newFolderName) {
      Swal.fire("Error", "Folder name cannot be empty", "error");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/Appointments/api/folders`,
        {
          patientId: selectedPatient.id,
          folderName: newFolderName,
        }
      );
      Swal.fire("Success", "Folder created successfully", "success");
      setNewFolderName("");
      setSelectedFolderIndex(null);

      // Refresh patient data
      const data = await getPatientData();
      setPatients(data);
    } catch (error) {
      console.error("Error creating folder:", error);
      Swal.fire("Error", "Failed to create folder", "error");
    }
  };

  const handleFileUpload = async () => {
    if (!newFile) {
      Swal.fire("Error", "No file selected", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("patientId", selectedPatient.id);
    formData.append("folderIndex", selectedFolderIndex);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/Appointments/api/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Swal.fire("Success", "File uploaded successfully", "success");
      setNewFile(null);
      setSelectedFolderIndex(null);

      // Refresh patient data
      const data = await getPatientData();
      setPatients(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire("Error", "Failed to upload file", "error");
    }
  };

  const handleBackToFolders = () => {
    setSelectedFolderIndex(null);
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleNewFolder={handleNewFolder}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleFileUpload={handleFileUpload}
          newFile={newFile}
          setNewFile={setNewFile}
          selectedFolderIndex={selectedFolderIndex}
          setSelectedFolderIndex={setSelectedFolderIndex}
          handleBackToFolders={handleBackToFolders}
          onClose={handleCloseModal}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      )}
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
    </div>
  );
};

export default Patients;
