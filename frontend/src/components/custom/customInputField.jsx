import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import "../../styles/fileUpload.css";

const MAX_FILENAME_LENGTH = 50;

const CustomFileUpload = ({ onFileChange }) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (isValidDocument(file)) {
      if (isFilenameTooLong(file.name)) {
        Swal.fire({
          icon: "error",
          title: "Filename too long",
          text: "The file name exceeds the maximum allowed length.",
        });
      } else {
        setFileName(file.name);
        onFileChange(file);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Please upload a valid document file.",
      });
    }
  };

  const isValidDocument = (file) => {
    const allowedExtensions = ["pdf", "doc", "docx", "txt", "xls", "xlsx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const isFilenameTooLong = (filename) => {
    return filename.length > MAX_FILENAME_LENGTH;
  };

  return (
    <div
      className={`dropzone ${dragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
      />
      <div className="fileNameContainer">
        <p className="fileNameDisplay">
          {fileName
            ? fileName.length > MAX_FILENAME_LENGTH
              ? `${fileName.substring(0, MAX_FILENAME_LENGTH)}...`
              : fileName
            : dragging
            ? "Drop file here"
            : "Drag & drop file or click to select"}
        </p>
      </div>
      {!fileName && (
        <button
          type="button"
          className="upload-button"
          onClick={handleButtonClick}
        >
          Choose File
        </button>
      )}
    </div>
  );
};

export default CustomFileUpload;
