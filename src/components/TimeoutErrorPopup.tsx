import React from 'react';
import { motion } from 'framer-motion'; // Assuming you're using framer-motion for animations

interface TimeoutErrorPopupProps {
  onClose: () => void;
}

const TimeoutErrorPopup: React.FC<TimeoutErrorPopupProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md border border-accent">
        <h2 className="text-xl font-bold mb-4 text-accent">Deployment Timeout</h2>
        <p className="mb-4 text-text">The blockchain is currently busy. Please try again.</p>
        <button
          onClick={onClose}
          className="bg-accent text-background px-4 py-2 rounded hover:bg-accent-dark transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default TimeoutErrorPopup;