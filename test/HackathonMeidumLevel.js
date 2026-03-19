const Hackathon = artifacts.require("Hackathon");

contract("Hackathon", (accounts) => {
    let instance;

    beforeEach(async () => {
        instance = await Hackathon.new(accounts[0], "Test Hackathon", 10 ether);
    });

    it("should register a participant", async () => {
        await instance.register({ from: accounts[1], value: 10 ether });
        assert.isTrue(await instance.isParticipant.call(accounts[1]));
    });

    it("should add prize to the prize pool", async () => {
        await instance.addPrize(10 ether);
        assert.equal(await instance.prizePool(), 10 ether);
    });

    it("should add a judge", async () => {
        await instance.addJudge(accounts[2]);
        assert.isTrue(await instance.isJudge.call(accounts[2]));
    });

    it("should assign score to a participant", async () => {
        await instance.register({ from: accounts[1], value: 10 ether });
        await instance.addJudge(accounts[2]);
        await instance.assignScore(accounts[1], 100);
        assert.equal(await instance.participantScore.call(accounts[1]), 100);
    });

    it("should select winner and distribute prize", async () => {
        await instance.register({ from: accounts[1], value: 10 ether });
        await instance.register({ from: accounts[2], value: 10 ether });
        await instance.addJudge(accounts[3]);
        await instance.assignScore(accounts[1], 100);
        await instance.assignScore(accounts[2], 200);
        await instance.addPrize(10 ether);
        await instance.selectWinner();
        assert.equal(await instance.winners.length, 1);
        assert.equal(await instance.winners(0), accounts[2]);
        let balance = await web3.eth.getBalance(accounts[2]);
        await instance.distributePrizes();
        assert.isTrue(balance < await web3.eth.getBalance(accounts[2]));
    });
});
