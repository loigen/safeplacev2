import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root'); // Set the app element for accessibility

const Modal = ({ isOpen, onRequestClose, title, message }) => (
  <ReactModal 
    isOpen={isOpen} 
    onRequestClose={onRequestClose} 
    contentLabel={title}
    className="Modal"
    overlayClassName="Overlay"
  >
    <h2>{title}</h2>
    <p>{message}</p>
    <button onClick={onRequestClose}>Close</button>
  </ReactModal>
);

export default Modal;
