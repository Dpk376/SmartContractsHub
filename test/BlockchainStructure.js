const SimpleBlockchain = artifacts.require("SimpleBlockchain");

contract("SimpleBlockchain", async accounts => {
    let simpleBlockchain;
  
    before(async () => {
        simpleBlockchain = await SimpleBlockchain.new();
    });

    it("should add a new block", async () => {
        // Deposit 1 ether to the contract
        await simpleBlockchain.deposit({from: accounts[0], value: web3.utils.toWei("1", "ether")});
        // Get the balance of the account
        let balance = await simpleBlockchain.getBalance(accounts[0]);
        assert.equal(balance.toString(), web3.utils.toWei("1", "ether"), "Incorrect balance");
        // Add a new block
        await simpleBlockchain.addBlock("0x1", "0x2", {from: accounts[0]});
        // Get the total number of blocks
        let totalBlocks = await simpleBlockchain.getTotalBlocks();
        assert.equal(totalBlocks.toNumber(), 1, "Incorrect number of blocks");
        // Get the block details
        let block = await simpleBlockchain.getBlock(0);
        assert.equal(block[0], "0x1", "Incorrect previous hash");
        assert.equal(block[1], "0x2", "Incorrect data");
        // Get the balance of the account after adding a block
        balance = await simpleBlockchain.getBalance(accounts[0]);
        assert.equal(balance.toString(), "0", "Incorrect balance after adding a block");
    });

    it("should validate a block", async () => {
        // Add a new block
        await simpleBlockchain.addBlock("0x1", "0x2", {from: accounts[0]});
        // Validate the block
        let isValid = await simpleBlockchain.validateBlock(0);
        assert.equal(isValid, true, "Block validation failed");
    });
  
        it("should fail to add a block with insufficient balance", async () => {
        // Try to add a new block with 0 balance
        try {
            await simpleBlockchain.addBlock("0x1", "0x2", {from: accounts[1]});
            assert.fail("Adding a block with insufficient balance should throw an error");
        } catch (error) {
            assert.include(error.message, "Not enough balance to add a new block", "Incorrect error message");
        }
    });

    it("should fail to validate a block with incorrect previous hash", async () => {
        // Add a new block with incorrect previous hash
        await simpleBlockchain.addBlock("0x3", "0x4", {from: accounts[0]});
        // Try to validate the block
        let isValid = await simpleBlockchain.validateBlock(1);
        assert.equal(isValid, false, "Block validation should fail");
    });

    it("should fail to deposit 0 ether", async () => {
        try {
            await simpleBlockchain.deposit({from: accounts[0], value: 0});
            assert.fail("Depositing 0 ether should throw an error");
        } catch (error) {
            assert.include(error.message, "Cannot deposit 0 ether", "Incorrect error message");
        }
    });

});
