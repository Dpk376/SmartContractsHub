const Insurance = artifacts.require("Insurance");

contract("Insurance", (accounts) => {
    let instance;
    let policyPeriod;
    beforeEach(async () => {
        policyPeriod = (await web3.eth.getBlock('latest')).timestamp + 60;
        instance = await Insurance.new(policyPeriod);
    });

    it("should allow buying a policy", async () => {
        await instance.buyPolicy(10, { from: accounts[1], value: 10 });
        const policyAmount = await instance.getPolicyAmount(accounts[1]);
        assert.equal(policyAmount, 10, "Policy amount does not match");
    });

    it("should allow to claim the policy after the policy period", async () => {
        await instance.buyPolicy(10, { from: accounts[1], value: 10 });
        await web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_increaseTime", params: [policyPeriod], id: 0 });
        await web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_mine", params: [], id: 1 });
        const initialBalance = await web3.eth.getBalance(accounts[1]);
        await instance.claim({ from: accounts[1] });
        const finalBalance = await web3.eth.getBalance(accounts[1]);
        assert.isTrue(finalBalance > initialBalance, "Balance did not increase after claim");
    });

    it("should not allow to claim the policy before the policy period", async () => {
        await instance.buyPolicy(10, { from: accounts[1], value: 10 });
        try {
            await instance.claim({ from: accounts[1] });
            assert.fail("Claim was allowed before the policy period");
        } catch (error) {
            assert.include(error.message, "revert", "Wrong error message");
        }
    });

    it("should not allow to claim the policy twice", async () => {
        await instance.buyPolicy(10, { from: accounts[1], value: 10 });
        await web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_increaseTime", params: [policyPeriod], id: 0 });
        await web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_mine", params: [], id: 1 });
        await instance.claim({ from: accounts[1] });
        try {
            await instance.claim({ from: accounts[1] });
            assert.fail("Claim was allowed twice");
        } catch (error) {
            assert.include(error.message, "revert", "Wrong error message");
        }
    });
});
