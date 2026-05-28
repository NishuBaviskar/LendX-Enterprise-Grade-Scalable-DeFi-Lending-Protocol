// Sidechain Simulation Configuration
const PolygonConfig = {
    networkName: "Polygon PoS Sidechain (Simulated)",
    rpcUrl: "http://127.0.0.1:8545", // Simulated via second Ganache instance
    chainId: 137,
    bridgeAddress: "0x...", // Deployed Bridge Address
    checkpointInterval: 300, // 5 minutes in seconds
};

module.exports = PolygonConfig;