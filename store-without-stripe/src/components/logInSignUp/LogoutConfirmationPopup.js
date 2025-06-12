import React from "react";

const LogoutConfirmationPopup = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Are you sure you want to log out?</h2>
        <div className="popup-actions">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .popup-content {
          background: #fff; padding: 2rem; border-radius: 8px; text-align: center;
        }
        .popup-actions button {
          margin: 0 1rem;
        }
      `}</style>
    </div>
  );
};

export default LogoutConfirmationPopup;