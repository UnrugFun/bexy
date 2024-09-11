'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import WalletConnection from './TokenDeployer/WalletConnection';
import { ethers } from 'ethers';

const Header = dynamic(() => import('./Header'), { ssr: false });
const TokenDeployer = dynamic(() => import('./TokenDeployer'), { ssr: false });

const TokenDeployerWrapper: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleWalletConnection = (connectedSigner: ethers.Signer) => {
    setSigner(connectedSigner);
    setIsWalletConnected(true);
    setErrorMessage('');
  };

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-accent">Demo</h2>
          <WalletConnection
            setSigner={handleWalletConnection}
            setErrorMessage={setErrorMessage}
            isConnected={isWalletConnected}
          />
        </div>
        <TokenDeployer signer={signer} isWalletConnected={isWalletConnected} />
      </div>
    </div>
  );
};

export default TokenDeployerWrapper;