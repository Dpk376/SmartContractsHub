const Voting = artifacts.require("Voting");

contract("Voting", accounts => {
let voting;
let owner = accounts[0];
let voter1 = accounts[1];
let voter2 = accounts[2];
let proposal1 = web3.utils.soliditySha3("proposal1");
let proposal2 = web3.utils.soliditySha3("proposal2");
let endTime = (now + 86400);
beforeEach(async () => {
    voting = await Voting.new();
});

it("should add a voter", async () => {
    await voting.addVoter(voter1,1);
    let isVoter = await voting.voters(voter1);
    assert.equal(isVoter, true, "Voter was not added");
});

it("should remove a voter", async () => {
    await voting.addVoter(voter1,1);
    await voting.removeVoter(voter1);
    let isVoter = await voting.voters(voter1);
    assert.equal(isVoter, false, "Voter was not removed");
});

it("should propose a new proposal", async () => {
    await voting.addVoter(voter1,1);
    await voting.propose(proposal1, voter1, endTime);
    let isProposal = await voting.proposals(proposal1);
    assert.equal(isProposal, true, "Proposal was not proposed");
});

it("should not propose a duplicate proposal", async () => {
    await voting.addVoter(voter1,1);
    await voting.propose(proposal1, voter1, endTime);
    try {
        await voting.propose(proposal1, voter1, endTime);
        assert.fail("Proposal should not be proposed as it's already existed");
    } catch (err) {
        assert.include(err.message, "Proposal already exists.");
    }
});

it("should vote on a proposal", async () => {
    await voting.addVoter(voter1,1);
    await voting.propose(proposal1, voter1, endTime);
    await voting.vote(proposal1, true);
    let votes = await voting.getVotes(proposal1);
    assert.equal(votes, 1, "Votes was not casted");
});

it("should not vote on a non-existing proposal", async () => {
    await voting.addVoter(voter1,1);
    try {
        await voting.vote(proposal1, true);
        assert.fail("Votes should not be casted as the proposal does not exist");
    } catch (err) {
        assert.include(err.message, "Proposal does not exist.");
    }
});

it("should close a proposal and check if it passed or failed", async () => {
    await voting.addVoter(voter1,1);
    await voting.propose(proposal1, voter1, endTime);
    await voting.vote(proposal1, true);
    await voting.addVoter(voter2,1);
    await voting.vote(proposal1, true);
    await voting.closeProposal(proposal1);
    let isClosed = await voting.isClosed(proposal1);
    let isPassed = await voting.isPassed(proposal1);
    assert.equal(isClosed, true, "Proposal was not closed");
    assert.equal(isPassed, true, "Proposal did not pass");
});

