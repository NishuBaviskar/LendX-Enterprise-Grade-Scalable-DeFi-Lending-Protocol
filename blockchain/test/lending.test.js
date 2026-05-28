const LendingPool = artifacts.require("LendingPoolUpgradeable");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("LendingPoolUpgradeable", (accounts) => {
    let pool;
    const admin = accounts[0];
    const user = accounts[1];

    beforeEach(async() => {
        pool = await LendingPool.deployed();
    });

    it("should allow users to deposit ETH", async() => {
        const depositAmount = web3.utils.toWei("1", "ether");
        await pool.deposit({ from: user, value: depositAmount });

        const balance = await pool.userDeposits(user);
        assert.equal(balance.toString(), depositAmount, "Deposit balance mismatch");
    });

    it("should prevent borrowing without collateral", async() => {
        const borrowAmount = web3.utils.toWei("0.5", "ether");
        // User 2 has 0 deposits
        await expectRevert(
            pool.borrow(borrowAmount, { from: accounts[2] }),
            "Insufficient collateral"
        );
    });

    it("should calculate the correct Health Factor", async() => {
        const hf = await pool.getHealthFactor(user);
        // Initial HF should be high since no borrow exists yet
        assert.isTrue(parseFloat(web3.utils.fromEther(hf)) > 1, "Health factor should be safe");
    });
});