import React from 'react';
import { motion } from 'framer-motion';

interface InsufficientFundsPopupProps {
  onClose: () => void;
}

const InsufficientFundsPopup: React.FC<InsufficientFundsPopupProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-background p-8 rounded-lg shadow-lg text-center w-full max-w-md border border-accent">
        <h3 className="text-xl font-bold mb-4 text-accent">Insufficient Funds</h3>
        <p className="text-text mb-6">
          Transaction failed due to insufficient funds. Please ensure you have enough BERA in your wallet to cover the transaction fee.
        </p>
        <button
          onClick={onClose}
          className="bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default InsufficientFundsPopup;