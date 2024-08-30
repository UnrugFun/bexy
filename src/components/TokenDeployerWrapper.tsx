'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header'), { ssr: false });
const TokenDeployer = dynamic(() => import('./TokenDeployer'), { ssr: false });

const TokenDeployerWrapper: React.FC = () => {
  const [signer, setSigner] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-accent mb-6">Demo</h2>
        <div className="mb-6">
          <Header setSigner={setSigner} setErrorMessage={setErrorMessage} />
        </div>
        <TokenDeployer />
      </div>
    </div>
  );
};

export default TokenDeployerWrapper;