const Crowdfunding = artifacts.require("Crowdfunding");

contract("Crowdfunding", (accounts) => {
    let instance;
    let campaignCreator = accounts[0];
    let backer1 = accounts[1];
    let backer2 = accounts[2];
    let campaignGoal = 100 ether;

    beforeEach(async () => {
        instance = await Crowdfunding.new(campaignCreator, "Test Campaign", "Test Description", campaignGoal);
    });

    it("should contribute to the campaign", async () => {
        await instance.contribute({ from: backer1, value: 50 ether });
        assert.isTrue(await instance.backers(backer1));
        assert.equal(await instance.campaignFunds(), 50 ether);
    });

    it("should not contribute to the campaign if the backer has already contributed", async () => {
        await instance.contribute({ from: backer1, value: 50 ether });
        try {
            await instance.contribute({ from: backer1, value: 50 ether });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

    it("should check if the goal is reached", async () => {
        assert.isFalse(await instance.checkGoalReached());
        await instance.contribute({ from: backer1, value: 100 ether });
        assert.isTrue(await instance.checkGoalReached());
    });

    it("should refund the funds if the goal is not reached", async () => {
        let balance = await web3.eth.getBalance(backer1);
        await instance.contribute({ from: backer1, value: 50 ether });
        await instance.refund({ from: campaignCreator });
        assert.isTrue(balance < await web3.eth.getBalance(backer1));
    });

    it("should not refund the funds if the goal is reached", async () => {
        await instance.contribute({ from: backer1, value: 100 ether });
        try {
            await instance.refund({ from: campaignCreator });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

    it("should withdraw the funds if the goal is reached", async () => {
        let balance = await web3.eth.getBalance(campaignCreator);
        await instance.contribute({ from: backer1, value: 100 ether });
        await instance.withdraw({ from: campaignCreator });
        assert.isTrue(balance < await web3.eth.getBalance(campaignCreator));
    });

    it("should not withdraw the funds if the goal is not reached", async () => {
        await instance.contribute({ from: backer1, value: 50 ether });
        try {
            await instance.withdraw({ from: campaignCreator });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
    }
    });
    
    it("should not allow a non-campaign creator to refund or withdraw funds", async () => {
        await instance.contribute({ from: backer1, value: 50 ether });
        try {
            await instance.refund({ from: backer1 });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }

        try {
            await instance.withdraw({ from: backer1 });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

