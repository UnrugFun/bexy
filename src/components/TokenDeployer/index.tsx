'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios'; // Add this import
import TokenForm from './TokenForm';
import { checkTransactionStatus } from './DeploymentHandler';
import { FormData } from './types';
import AIButton from '../AIButton';
import LoadingPopup from '../LoadingPopup';
import AiPopup from '../AiPopup';
import WalletConnection from './WalletConnection';
import ErrorPopup from '../ErrorPopup';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;
const RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS;

interface TokenDeployerProps {
  signer: ethers.Signer | null;
  isWalletConnected: boolean;
}

const TokenDeployer: React.FC<TokenDeployerProps> = ({ signer, isWalletConnected }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    description: '',
    website: '',
    logo: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

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

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  const handleAIButtonClick = async () => {
    if (!isWalletConnected || !signer) {
      handleError('Please connect your wallet first.');
      return;
    }

    // Prompt for token name
    setShowAiPopup(true);
  };

  const handleAIGeneration = async (tokenName: string) => {
    if (!signer) {
      handleError('Wallet is not connected. Please connect your wallet and try again.');
      return;
    }

    try {
      setShowAiPopup(false); // Close the AiPopup

      // Initiate transaction after getting token name
      setIsLoading(true);
      setLoadingMessage('Initiating transaction...');
      setProgress(0);

      const tx = await signer.sendTransaction({
        to: RECIPIENT_ADDRESS,
        value: ethers.utils.parseEther('0.005')
      });

      setLoadingMessage('Waiting for transaction confirmation...');
      await tx.wait();

      setLoadingMessage('Sending token name...');
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
      handleError('Please enter both name and symbol.');
      return;
    }
    // Remove any validation for website or logo URL here
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
      <AIButton onClick={handleAIButtonClick} />
      <TokenForm
        formData={formData}
        setFormData={setFormData}
        onDeploy={handleDeploy}
      />
      {showErrorPopup && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      )}
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