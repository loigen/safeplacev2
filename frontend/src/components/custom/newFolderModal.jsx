import React from "react";
import "../../styles/NewFoldermodal.css";

const NewFolderModal = ({
  show,
  onClose,
  onSave,
  folderName,
  onFolderNameChange,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Folder</h2>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Folder Name"
            value={folderName}
            onChange={onFolderNameChange}
          />
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default NewFolderModal;
