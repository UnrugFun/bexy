'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios'; // Add this import
import TokenForm from './TokenForm';
import ErrorDisplay from './ErrorDisplay';
import { checkTransactionStatus } from './DeploymentHandler';
import { FormData } from './types';
import AIButton from '../AIButton';
import LoadingPopup from '../LoadingPopup';
import AiPopup from '../AiPopup';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;

const TokenDeployer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    description: '',
    website: '',
    logo: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAIGeneration = async (tokenName: string) => {
    try {
      setShowAiPopup(false); // Close the AiPopup
      setIsLoading(true);
      setLoadingMessage('Initializing AI generation...');
      setProgress(0);
      setErrorMessage(''); // Clear any existing error message

      const response = await axios.post(WEBHOOK_URL!, { name: tokenName });
      const { name, symbol, description, website } = response.data;

      const steps = [
        { message: 'Generating token name...', delay: 5000 },
        { message: 'Creating token symbol...', delay: 5000 },
        { message: 'Crafting token description...', delay: 10000 },
        { message: 'Designing website...', delay: 5000 },
        { message: 'Finalizing token information...', delay: 5000 },
        { message: 'Generating website...', delay: 100000 }, // Additional 1 minute for website generation
      ];

      for (const step of steps) {
        setLoadingMessage(step.message);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      setFormData({
        name,
        symbol,
        description,
        website,
        logo: 'AI Generated Logo',
      });

      setIsLoading(false);
      setProgress(0);
      setErrorMessage(''); // Ensure error message is cleared after successful generation
    } catch (error) {
      console.error('AI generation error:', error);
      setErrorMessage('Error in AI generation. Please try again.');
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleDeploy = async () => {
    if (!formData.name || !formData.symbol) {
      setErrorMessage('Please enter both name and symbol.');
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage('Compiling and deploying contract...');
      setProgress(0);
      const response = await axios.post('/api/deploy', {
        name: formData.name,
        symbol: formData.symbol
      });
      await checkTransactionStatus(
        response.data.transactionHash,
        setDeployedAddress,
        setErrorMessage,
        setIsLoading,
        setLoadingMessage
      );
    } catch (error) {
      setErrorMessage('Deployment failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-lg p-6 max-w-md mx-auto border border-accent">
      <h2 className="text-2xl font-bold text-accent mb-6 text-center">Create Your Token</h2>
      <AIButton onClick={() => setShowAiPopup(true)} />
      <TokenForm
        formData={formData}
        setFormData={setFormData}
        onDeploy={handleDeploy}
      />
      <ErrorDisplay errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
      {(isLoading || deployedAddress) && (
        <LoadingPopup
          message={loadingMessage}
          progress={progress}
          isDeployed={!!deployedAddress}
          deployedAddress={deployedAddress}
          onClose={() => {
            setIsLoading(false);
            setProgress(0);
            setDeployedAddress(null);
          }}
        />
      )}
      {showAiPopup && !isLoading && (
        <AiPopup
          onClose={() => setShowAiPopup(false)}
          onGenerate={handleAIGeneration}
        />
      )}
    </div>
  );
};

export default TokenDeployer;