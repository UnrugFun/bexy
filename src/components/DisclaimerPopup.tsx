import React from 'react';
import { motion } from 'framer-motion';

interface DisclaimerPopupProps {
  onAccept: () => void;
  onClose: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onAccept, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-background p-8 rounded-lg shadow-lg text-center w-full max-w-md border border-accent">
        <h3 className="text-xl font-bold mb-4 text-accent">Important Notice</h3>
        <p className="text-text mb-6">
          By proceeding, you agree to be charged in advance for AI-powered generation services, including:
        </p>
        <ul className="text-text mb-6 text-left list-disc list-inside">
          <li>Website generation</li>
          <li>Logo creation</li>
          <li>Token description</li>
          <li>Token symbol</li>
        </ul>
        <p className="text-text mb-6">
          The charge will be 0.005 BERA. This fee is non-refundable once the generation process begins.
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200"
          >
            I Understand and Accept
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DisclaimerPopup;