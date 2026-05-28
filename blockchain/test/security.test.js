const LendingPool = artifacts.require("LendingPoolUpgradeable");
const ReentrancyAttacker = artifacts.require("ReentrancyAttacker");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("Security Check", (accounts) => {
    it("should fail a reentrancy attack", async() => {
        const pool = await LendingPool.deployed();
        const attacker = await ReentrancyAttacker.new(pool.address);

        const attackAmount = web3.utils.toWei("1", "ether");

        // The attack should revert due to ReentrancyGuardUpgradeable
        await expectRevert.unspecified(
            attacker.attack({ from: accounts[5], value: attackAmount })
        );
    });
});