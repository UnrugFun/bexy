import React from 'react';
import { ethers } from 'ethers';

interface WalletConnectionProps {
  setSigner: React.Dispatch<React.SetStateAction<ethers.Signer | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ setSigner, setErrorMessage }) => {
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        setSigner(provider.getSigner());
      } catch (error) {
        setErrorMessage("Failed to connect wallet. Please try again.");
      }
    } else {
      setErrorMessage("MetaMask not detected. Please install MetaMask to use this feature.");
    }
  };

  return (
    <button onClick={connectWallet}>Connect Wallet</button>
  );
};

export default WalletConnection;