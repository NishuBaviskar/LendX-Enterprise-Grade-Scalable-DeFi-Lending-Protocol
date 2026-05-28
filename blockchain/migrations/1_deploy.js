const { deployProxy } = require('@openzeppelin/truffle-upgrades');

// Load Artifacts
const AccessControlManager = artifacts.require("AccessControlManager");
const LendingPool = artifacts.require("LendingPoolUpgradeable");
const GovernanceToken = artifacts.require("GovernanceToken");
const RollupBatcher = artifacts.require("RollupBatcher");
const Bridge = artifacts.require("Bridge");
const StateChannel = artifacts.require("StateChannel");
const ShardedPool = artifacts.require("ShardedPool");
const AtomicSwap = artifacts.require("AtomicSwap");
const FlashLoanProtection = artifacts.require("FlashLoanProtection");
const FlashLoan = artifacts.require("FlashLoan");
const CreditScore = artifacts.require("CreditScore");
const Liquidation = artifacts.require("Liquidation");
const Oracle = artifacts.require("Oracle");
const ZKVerifier = artifacts.require("ZKVerifier");
const SecurityTest = artifacts.require("SecurityTest");
const DAOUpgradeable = artifacts.require("DAOUpgradeable");

// Helper to prevent Alchemy "Too Many Requests" error
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async function(deployer, network, accounts) {
    const admin = accounts[0];
    console.log("🚀 Starting deployment on network:", network);
    console.log("Admin Account:", admin);

    try {
        // 1. ACCESS CONTROL FOUNDATION
        await deployer.deploy(AccessControlManager, admin);
        const acm = await AccessControlManager.deployed();
        await sleep(5000);

        // 2. GOVERNANCE TOKEN
        await deployer.deploy(GovernanceToken);
        const token = await GovernanceToken.deployed();
        await sleep(5000);

        // 3. LENDING POOL (UUPS Proxy)
        const pool = await deployProxy(
            LendingPool, [admin], { deployer, kind: 'uups' }
        );
        console.log("✅ LendingPool Proxy:", pool.address);
        await sleep(5000);

        // 4. CREDIT SCORE (Requires ACM Address)
        // Fixed: Passing AccessControlManager address to constructor
        await deployer.deploy(CreditScore, acm.address);
        const creditScore = await CreditScore.deployed();
        await sleep(4000);

        // 5. ORACLE
        await deployer.deploy(Oracle);
        const oracle = await Oracle.deployed();
        await sleep(4000);

        // 6. LIQUIDATION (Requires ACM and Pool Address)
        // Fixed: Passing 2 required parameters to constructor
        await deployer.deploy(Liquidation, acm.address, pool.address);
        const liquidation = await Liquidation.deployed();
        await sleep(5000);

        // 7. FLASH LOAN SYSTEM
        await deployer.deploy(FlashLoan, pool.address); // Pass pool address if required
        await sleep(3000);
        await deployer.deploy(FlashLoanProtection);
        await sleep(4000);

        // 8. INFRASTRUCTURE (L2, Bridge, Atomic)
        await deployer.deploy(RollupBatcher, admin);
        await sleep(3000);
        await deployer.deploy(Bridge, admin);
        await sleep(3000);
        await deployer.deploy(AtomicSwap);
        await sleep(4000);

        // 9. SCALING & PRIVACY
        await deployer.deploy(StateChannel);
        await sleep(3000);
        await deployer.deploy(ShardedPool);
        await sleep(3000);
        await deployer.deploy(ZKVerifier);
        await sleep(3000);

        // 10. SECURITY & DAO
        await deployer.deploy(SecurityTest, pool.address);
        await sleep(5000);

        const dao = await deployProxy(
            DAOUpgradeable, [pool.address], { deployer, kind: 'uups' }
        );

        console.log("--------------------------------");
        console.log("🌟 DEPLOYMENT SUCCESSFUL");
        console.log("Lending Pool Proxy:", pool.address);
        console.log("DAO Proxy:", dao.address);
        console.log("--------------------------------");

    } catch (error) {
        console.error("❌ Deployment Failed:", error);
    }
};