const DAO = artifacts.require("DAOUpgradeable");
const { expectRevert, time } = require('@openzeppelin/test-helpers');

contract("DAOUpgradeable", (accounts) => {
    const admin = accounts[0];
    const voter = accounts[1];
    let dao;

    beforeEach(async() => {
        dao = await DAO.deployed();
    });

    it("should allow creating a proposal", async() => {
        await dao.createProposal("Increase Collateral Factor to 85%", { from: admin });
        const proposal = await dao.proposals(1);
        assert.equal(proposal.description, "Increase Collateral Factor to 85%");
    });

    it("should allow voting and track votes", async() => {
        await dao.vote(1, true, { from: voter });
        const proposal = await dao.proposals(1);
        assert.equal(proposal.votesFor.toString(), "1");
    });

    it("should prevent voting after deadline", async() => {
        await time.increase(time.duration.days(4));
        await expectRevert(
            dao.vote(1, true, { from: accounts[2] }),
            "Voting closed"
        );
    });
});