const Government = artifacts.require("Government");

contract("Government", accounts => {
    let government;
    let owner = accounts[0];
    let citizen1 = accounts[1];
    let citizen2 = accounts[2];
    let proposal1 = web3.utils.soliditySha3("proposal1");
    let proposal2 = web3.utils.soliditySha3("proposal2");

    beforeEach(async () => {
        government = await Government.new();
    });

    it("should add a citizen", async () => {
        await government.addCitizen(citizen1);
        let isCitizen = await government.citizens(citizen1);
        assert.equal(isCitizen, true, "Citizen was not added");
    });

    it("should remove a citizen", async () => {
        await government.addCitizen(citizen1);
        await government.removeCitizen(citizen1);
        let isCitizen = await government.citizens(citizen1);
        assert.equal(isCitizen, false, "Citizen was not removed");
    });

    it("should propose a new proposal", async () => {
        await government.addCitizen(citizen1);
        await government.propose(proposal1, citizen1);
        let isProposal = await government.proposals(proposal1);
        assert.equal(isProposal, true, "Proposal was not proposed");
    });

    it("should not propose a duplicate proposal", async () => {
        await government.addCitizen(citizen1);
        await government.propose(proposal1, citizen1);
        try {
            await government.propose(proposal1, citizen1);
            assert.fail("Proposal should not be proposed as it's already existed");
        } catch (err) {
            assert.include(err.message, "Proposal already exists.");
        }
    });

    it("should vote on a proposal", async () => {
        await government.addCitizen(citizen1);
        await government.propose(proposal1, citizen1);
        await government.vote(proposal1, true);
        let votes = await government.getVotes(proposal1);
        assert.equal(votes, 1, "Votes was not casted");
    });

    it("should not vote on a non-existing proposal", async () => {
        await government.addCitizen(citizen1);
        try {
            await government.vote(proposal1, true);
            assert.fail("Votes should not be casted as the proposal does not exist");
        } catch (err) {
            assert.include(err.message, "Proposal does not exist.");
        }
    });

    it("should return proposer of a proposal", async () => {
        await government.addCitizen(citizen1);
        await government.propose(proposal1, citizen1);
        let proposer = await government.getProposer(proposal1);
        assert.equal(proposer, citizen1, "Proposer was not returned correctly");
});
});
