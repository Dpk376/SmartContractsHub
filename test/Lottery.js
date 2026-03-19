const Lottery = artifacts.require("Lottery");

contract("Lottery", accounts => {
    let lottery;

    beforeEach(async () => {
        lottery = await Lottery.new();
    });

    it("should add the owner address to the whitelist", async () => {
        assert.equal(await lottery.whitelist(accounts[0]), true);
    });

    it("should add an address to the whitelist", async () => {
        await lottery.addToWhitelist(accounts[1]);
        assert.equal(await lottery.whitelist(accounts[1]), true);
    });

    it("should not allow an address not in the whitelist to enter", async () => {
        try {
            await lottery.enter({from: accounts[2], value: web3.utils.toWei("0.1", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "address not in whitelist");
        }
    });

    it("should allow an address in the whitelist to enter", async () => {
        await lottery.addToWhitelist(accounts[3]);
        await lottery.enter({from: accounts[3], value: web3.utils.toWei("0.1", "ether")});
        assert.equal(await lottery.players(0), accounts[3]);
    });

    it("should not allow a player to enter if they already reached the entry limit", async () => {
        await lottery.addToWhitelist(accounts[4]);
        for (let i = 0; i < 10; i++) {
            await lottery.enter({from: accounts[4], value: web3.utils.toWei("0.1", "ether")});
        }
        try {
            await lottery.enter({from: accounts[4], value: web3.utils.toWei("0.1", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "limit of 10 entries per address reached");
        }
    });

    it("should refund players who didn't win", async () => {
        await lottery.addToWhitelist(accounts[5]);
        await lottery.addToWhitelist(accounts[6]);
        await lottery.enter({from: accounts[5], value: web3.utils.toWei("0.1", "ether")});
        await lottery.enter({from: accounts[6], value: web3.utils.toWei("0.1", "ether")});
        await lottery.selectWinner({from: accounts[0]});
        const winner = await lottery.getWinner();
        const initialBalance5 = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
        const initialBalance6 = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        await lottery.refund({from: accounts[0]});
        const finalBalance5 = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
        const finalBalance6 = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        if (winner == accounts[5]) {
            assert.equal(finalBalance5.sub(initialBalance5), 0);
            assert.equal(finalBalance6.sub(initialBalance6), web3.utils.toWei("0.1", "ether"));
        } else {
            assert.equal(finalBalance5.sub(initialBalance5), web3.utils.toWei("0.1", "ether"));
            assert.equal(finalBalance6.sub(initialBalance6), 0);
        }
    });

    it("should select a winner", async () => {
        await lottery.addToWhitelist(accounts[7]);
        await lottery.addToWhitelist(accounts[8]);
        await lottery.enter({from: accounts[7], value: web3.utils.toWei("0.1", "ether")});
        await lottery.enter({from: accounts[8], value: web3.utils.toWei("0.1", "ether")});
        await lottery.selectWinner({from: accounts[0]});
        assert.equal(await lottery.getWinner(), true);
    });
});
