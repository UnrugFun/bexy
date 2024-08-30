import React from 'react';
import { motion } from 'framer-motion';

interface AIButtonProps {
  onClick: () => void;
}

const AIButton: React.FC<AIButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-accent text-background py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300 w-full mb-6"
      onClick={onClick}
    >
      <div className="flex items-center justify-center text-background">
        <svg className="w-6 h-6 mr-2 stroke-background" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Generate with AI
      </div>
    </motion.button>
  );
};

export default AIButton;