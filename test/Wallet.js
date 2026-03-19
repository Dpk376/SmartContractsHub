const Wallet = artifacts.require("Wallet");

contract("Wallet", accounts => {
    let contract;
    const owner = accounts[0];
    const authorizedUser = accounts[1];
    const unauthorizedUser = accounts[2];
    const recipient = accounts[3];

    beforeEach(async () => {
        contract = await Wallet.new({ from: owner });
    });

    it("should set the owner on deployment", async () => {
        assert.equal(await contract.owner(), owner);
    });

    it("should authorize a user", async () => {
        await contract.authorize(authorizedUser, { from: owner });
        assert.isTrue(await contract.authorized(authorizedUser));
    });

    it("should only allow the owner to authorize users", async () => {
        try {
            await contract.authorize(authorizedUser, { from: unauthorizedUser });
        } catch (error) {
            assert.equal(error.reason, "Only the owner can authorize users.");
        }
    });

    it("should revoke a user's authorization", async () => {
        await contract.authorize(authorizedUser, { from: owner });
        await contract.revoke(authorizedUser, { from: owner });
        assert.isFalse(await contract.authorized(authorizedUser));
    });

    it("should only allow authorized users to transfer ether", async () => {
        try {
            await contract.transfer(recipient, 1, { from: unauthorizedUser });
        } catch (error) {
            assert.equal(error.reason, "Sender must be authorized.");
        }
    });

    it("should transfer ether", async () => {
        await contract.authorize(authorizedUser, { from: owner });
        let balanceBefore = await web3.eth.getBalance(recipient);
        await contract.transfer(recipient, 1, { from: authorizedUser });
        let balanceAfter = await web3.eth.getBalance(recipient);
        assert.isTrue(balanceAfter > balanceBefore);
    });
});
