// src/components/LoadingPopup.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingPopupProps {
  message: string;
  progress: number;
  isDeployed: boolean;
  onClose: () => void;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ message, progress, isDeployed, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50"
  >
    <div className="bg-background p-8 rounded-lg shadow-lg text-center w-full max-w-md border border-accent">
      <h3 className="text-xl font-bold mb-4 text-accent">
        {isDeployed ? 'Deployment Complete' : 'Processing'}
      </h3>
      {!isDeployed && (
        <div className="mt-4 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto"
          />
        </div>
      )}
      <p className="text-text mb-4">{message}</p>
      {!isDeployed && (
        <>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-accent h-2.5 rounded-full"
            />
          </div>
          <p className="text-text mb-4">{progress}%</p>
        </>
      )}
      {isDeployed && (
        <button
          onClick={onClose}
          className="mt-4 bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200"
        >
          Close
        </button>
      )}
    </div>
  </motion.div>
);

export default LoadingPopup;