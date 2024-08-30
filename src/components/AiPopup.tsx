import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AiPopupProps {
  onClose: () => void;
  onGenerate: (tokenName: string) => Promise<void>;
}

const AiPopup: React.FC<AiPopupProps> = ({ onClose, onGenerate }) => {
  const [tokenName, setTokenName] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setProgress(0);
    setMessage('Generating token description...');

    await onGenerate(tokenName);

    const steps = [
      { progress: 25, message: 'Generating token symbol...' },
      { progress: 50, message: 'Generating logo...' },
      { progress: 75, message: 'Generating website...' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 30000));
      setProgress(step.progress);
      setMessage(step.message);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    setProgress(100);
    setMessage('Token information generated successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-background p-8 rounded-lg shadow-lg text-center w-full max-w-md border border-accent">
        <h3 className="text-xl font-bold mb-4 text-accent">Generate Token with AI</h3>
        {!loading ? (
          <>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="Enter token name"
              className="w-full bg-background text-text border border-accent rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={handleSubmit}
              className="bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 w-full"
            >
              Generate
            </button>
          </>
        ) : (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-accent h-2.5 rounded-full"
              />
            </div>
            <p className="mt-2 text-text">{progress}%</p>
            <p className="text-text">{message}</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default AiPopup;