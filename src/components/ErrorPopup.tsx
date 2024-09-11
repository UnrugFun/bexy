import React from 'react';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full border border-accent">
        <h3 className="text-xl font-bold text-accent mb-4">Error</h3>
        <p className="text-text mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-accent text-background px-4 py-2 rounded hover:bg-opacity-90 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;