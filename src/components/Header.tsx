import React from 'react';
import { ethers } from 'ethers';

interface HeaderProps {
  setSigner: React.Dispatch<React.SetStateAction<ethers.Signer | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ setSigner, setErrorMessage }) => {
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
      } catch (error) {
        setErrorMessage('Failed to connect wallet. Please try again.');
      }
    } else {
      setErrorMessage('Please install MetaMask to use this feature.');
    }
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={connectWallet}
        className="bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default Header;