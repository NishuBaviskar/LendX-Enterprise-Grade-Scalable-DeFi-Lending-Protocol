import { ethers } from 'ethers';

/**
 * Frontend utility to interact with the RollupBatcher contract.
 * Reduces gas by aggregating micro-deposits before submitting to L1.
 */
export const processL2Transaction = async(contract, amount, action, signer) => {
    try {
        console.log(`[L2 Rollup] Batching ${action} of ${amount} ETH`);
        const tx = await contract.submitTransaction(
            ethers.parseEther(amount.toString()),
            action
        );
        return await tx.wait();
    } catch (error) {
        console.error("L2 Transaction Failed", error);
        throw error;
    }
};