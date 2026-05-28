const { ethers } = require('ethers');
const { db } = require('../config/firebase');
const LendingPoolABI = require('../../blockchain/build/contracts/LendingPoolUpgradeable.json');

const setupListeners = () => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(process.env.LENDING_POOL_ADDRESS, LendingPoolABI.abi, provider);

    console.log("Listening for Smart Contract Events...");

    contract.on("Liquidated", async(user, liquidator, amount, event) => {
        await db.collection('auditLogs').add({
            type: 'LIQUIDATION',
            user,
            liquidator,
            amount: amount.toString(),
            txHash: event.log.transactionHash,
            timestamp: new Date().toISOString()
        });
        console.log(`Liquidation Logged: ${user}`);
    });

    contract.on("Borrowed", async(user, amount, event) => {
        await db.collection('auditLogs').add({
            type: 'BORROW',
            user,
            amount: amount.toString(),
            timestamp: new Date().toISOString()
        });
    });
};

module.exports = { setupListeners };