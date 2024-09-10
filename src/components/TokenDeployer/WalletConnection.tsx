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
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_chainId", []);
        
        // Switch to Berachain bArtio
        await switchToBerachainNetwork(provider);

        setSigner(provider.getSigner());
      } catch (error) {
        console.error("Connection error:", error);
        setErrorMessage("Failed to connect wallet. Please try again.");
      }
    } else {
      setErrorMessage("MetaMask not detected. Please install MetaMask to use this feature.");
    }
  };

  const addBerachainNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x13904',
          chainName: 'Berachain bArtio',
          nativeCurrency: {
            name: 'BERA',
            symbol: 'BERA',
            decimals: 18
          },
          rpcUrls: ['https://bartio.rpc.berachain.com/'],
          blockExplorerUrls: ['https://artio.beratrail.io/']
        }]
      });
    } catch (error) {
      console.error("Error adding Berachain network:", error);
      throw error;
    }
  };

  const switchToBerachainNetwork = async (provider: ethers.providers.Web3Provider) => {
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0x13904' }]);
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        try {
          await addBerachainNetwork();
          await provider.send('wallet_switchEthereumChain', [{ chainId: '0x13904' }]);
        } catch (addError) {
          console.error("Error adding and switching to Berachain network:", addError);
          throw addError;
        }
      } else {
        console.error("Error switching to Berachain network:", error);
        throw error;
      }
    }
  };

  return (
    <button onClick={connectWallet} className="bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200">
      Connect Wallet
    </button>
  );
};

export default WalletConnection;