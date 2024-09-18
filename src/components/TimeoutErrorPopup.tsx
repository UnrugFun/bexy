import React from 'react';

interface TimeoutErrorPopupProps {
  onClose: () => void;
}

const TimeoutErrorPopup: React.FC<TimeoutErrorPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Deployment Timeout</h2>
        <p className="mb-4">The blockchain is currently busy. Please try again later.</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TimeoutErrorPopup;