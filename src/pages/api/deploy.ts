import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

// Set the maximum duration for this function
export const maxDuration = 60; // 60 seconds (1 minute)

// Ensure dynamic rendering
export const dynamic = 'force-dynamic';

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getUpdatedGasParams(provider: ethers.providers.Provider, attempt: number): Promise<{maxFeePerGas: ethers.BigNumber, maxPriorityFeePerGas: ethers.BigNumber}> {
	const feeData = await provider.getFeeData();
	const maxFeePerGas = feeData.maxFeePerGas?.mul(110 + attempt * 10).div(100) || ethers.BigNumber.from(0);
	const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas?.mul(110 + attempt * 10).div(100) || ethers.BigNumber.from(0);
	
	return { maxFeePerGas, maxPriorityFeePerGas };
}

async function sendTransactionWithRetry(wallet: ethers.Wallet, tx: ethers.providers.TransactionRequest, maxRetries = 5): Promise<ethers.providers.TransactionReceipt> {
	let lastError: Error | unknown;
	let nonce = await wallet.getTransactionCount("pending");

	for (let i = 0; i < maxRetries; i++) {
		try {
			const updatedTx = { ...tx, nonce };
			const { maxFeePerGas, maxPriorityFeePerGas } = await getUpdatedGasParams(wallet.provider, i);
			
			updatedTx.maxFeePerGas = maxFeePerGas;
			updatedTx.maxPriorityFeePerGas = maxPriorityFeePerGas;

			const sentTx = await wallet.sendTransaction(updatedTx);
			return await sentTx.wait();
		} catch (error) {
			console.error(`Attempt ${i + 1} failed:`, error);
			lastError = error;
			
			if (error instanceof Error && error.message.includes('replacement transaction underpriced')) {
				nonce = await wallet.getTransactionCount("pending");
			}
			
			await sleep(Math.pow(2, i) * 1000);
		}
	}
	throw lastError;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { name, symbol } = req.body;

	if (!name || !symbol) {
		return res.status(400).json({ message: 'Name and symbol are required' });
	}

	if (!ALCHEMY_URL || !PRIVATE_KEY) {
		return res.status(500).json({ message: 'Server configuration error' });
	}

	const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);
	const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

	try {
		// Compile the contract
		const contractSource = `
			pragma solidity ^0.8.0;

			contract SimpleToken {
				string public name;
				string public symbol;
				uint8 public constant decimals = 18;
				uint256 public totalSupply;
				mapping(address => uint256) public balanceOf;

				event Transfer(address indexed from, address indexed to, uint256 value);

				constructor(string memory _name, string memory _symbol) {
					name = _name;
					symbol = _symbol;
					totalSupply = 1000000 * 10**uint256(decimals);
					balanceOf[msg.sender] = totalSupply;
					emit Transfer(address(0), msg.sender, totalSupply);
				}

				function transfer(address to, uint256 amount) public returns (bool) {
					require(balanceOf[msg.sender] >= amount, "Insufficient balance");
					balanceOf[msg.sender] -= amount;
					balanceOf[to] += amount;
					emit Transfer(msg.sender, to, amount);
					return true;
				}
			}
		`;

		const contractName = "SimpleToken";
		const inputDescription = {
			language: "Solidity",
			sources: {
				[contractName]: {
					content: contractSource,
				},
			},
			settings: {
				outputSelection: {
					"*": {
						"*": ["abi", "evm.bytecode"],
					},
				},
			},
		};

		// @ts-ignore
		const solc = require('solc');
		const output = JSON.parse(solc.compile(JSON.stringify(inputDescription)));
		const abi = output.contracts[contractName].SimpleToken.abi;
		const bytecode = output.contracts[contractName].SimpleToken.evm.bytecode.object;

		const factory = new ethers.ContractFactory(abi, bytecode, wallet);

		// Get the latest nonce
		const nonce = await wallet.getTransactionCount("pending");

		// Estimate gas limit
		const gasLimit = await factory.signer.estimateGas(
			factory.getDeployTransaction(name, symbol)
		);

		// Prepare the deployment transaction
		const deployTransaction = factory.getDeployTransaction(name, symbol);
		deployTransaction.nonce = nonce;
		deployTransaction.gasLimit = gasLimit.mul(120).div(100); // Add 20% buffer

		// Send the transaction with retry mechanism
		const receipt = await sendTransactionWithRetry(wallet, deployTransaction);

		res.status(200).json({
			message: 'Contract deployed successfully',
			contractAddress: receipt.contractAddress,
			transactionHash: receipt.transactionHash,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Deployment failed: ${(error as Error).message}` });
	}
}