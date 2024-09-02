import React, { useState, useEffect } from "react";

const MeetLinkModal = ({ isOpen, onClose, onSubmit }) => {
  const [meetLink, setMeetLink] = useState("");

  const handleSubmit = () => {
    onSubmit(meetLink);
    setMeetLink("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg mx-4 w-full sm:w-11/12 md:w-3/4 lg:w-1/2 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Enter Meet Link</h2>
        <input
          type="text"
          value={meetLink}
          onChange={(e) => setMeetLink(e.target.value)}
          placeholder="https://meet.example.com/your-link"
          className="w-full p-2 border rounded-lg mb-4"
        />
        <a href="https://meet.google.com/landing">Create a link here.</a>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetLinkModal;
