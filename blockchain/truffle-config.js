require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    networks: {
        sepolia: {
            provider: () =>
                new HDWalletProvider(
                    process.env.MNEMONIC,
                    "https://eth-sepolia.g.alchemy.com/v2/KIt5LE6F1Af7ZXVTzGnGV"
                ),
            network_id: 11155111,
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true,
            // --- ADD THESE THREE LINES TO FIX THE ERROR ---
            networkCheckTimeout: 1000000, // Increase timeout
            pollingInterval: 15000, // Check for confirmations every 15 seconds instead of 1
            deploymentPollingInterval: 15000
        }
    },

    compilers: {
        solc: {
            version: "0.8.20"
        }
    }
};