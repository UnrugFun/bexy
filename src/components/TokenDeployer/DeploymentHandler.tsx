import { ethers } from 'ethers';

const ALCHEMY_URL = "https://berachain-bartio.g.alchemy.com/v2/ILVH9f_7yJatP_2sYjxL67DInR9Tr59I";
const MAX_ATTEMPTS = 30; // Maximum number of attempts
const POLLING_INTERVAL = 5000; // 5 seconds
const DISPLAY_DELAY = 5000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkTransactionStatus = async (
  txHash: string,
  setDeployedAddress: (address: string | null) => void,
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setLoadingMessage: (message: string) => void
) => {
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    try {
      console.log(`Attempt ${attempts + 1}: Checking transaction status`);
      setLoadingMessage(`Waiting for transaction confirmation... Attempt ${attempts + 1}/${MAX_ATTEMPTS}`);
      const tx = await provider.getTransaction(txHash);
      
      if (tx && tx.blockNumber) {
        console.log('Transaction mined, waiting for receipt');
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          const contractAddress = receipt.contractAddress;
          if (contractAddress) {
            console.log(`Contract deployed at address: ${contractAddress}`);
            setDeployedAddress(contractAddress);
            setLoadingMessage(`Contract deployed successfully at address: ${contractAddress}`);
            await sleep(DISPLAY_DELAY);
            setIsLoading(false);
            return;
          } else {
            throw new Error('Contract address not found in transaction receipt.');
          }
        } else {
          throw new Error('Contract deployment failed.');
        }
      }
      
      attempts++;
      await sleep(POLLING_INTERVAL);
    } catch (error) {
      console.error('Error checking transaction status:', error);
      setErrorMessage(`Error: ${(error as Error).message}`);
      await sleep(DISPLAY_DELAY);
      setIsLoading(false);
      return;
    }
  }
  
  setErrorMessage('Transaction confirmation timed out. Please check the network explorer for the final status.');
  await sleep(DISPLAY_DELAY);
  setIsLoading(false);
};

// We don't need the DeploymentHandler component anymore, so you can remove it if it's not used elsewhere