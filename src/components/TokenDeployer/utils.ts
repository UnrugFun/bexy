import { ethers } from 'ethers';

const INFURA_URL = "https://berachain-bartio.g.alchemy.com/v2/ILVH9f_7yJatP_2sYjxL67DInR9Tr59I";

export const checkTransactionStatus = async (
  txHash: string,
  setDeployedAddress: (address: string | null) => void,
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
  try {
    const tx = await provider.getTransaction(txHash);
    if (tx && tx.blockNumber) {
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setDeployedAddress(receipt.contractAddress);
      } else {
        setErrorMessage('Contract deployment failed.');
        setIsLoading(false);
      }
    } else {
      setTimeout(() => checkTransactionStatus(txHash, setDeployedAddress, setErrorMessage, setIsLoading), 5000);
    }
  } catch (error) {
    setErrorMessage('Error checking transaction status. Please try again.');
    setIsLoading(false);
  }
};