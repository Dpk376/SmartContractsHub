const Music = artifacts.require("Music");

contract("Music", accounts => {
    let music;

    beforeEach(async () => {
        music = await Music.new("The Song", "John Doe", "The Album", 1577836800);
    });

    it("should purchase a song", async () => {
        await music.purchase({from: accounts[1], value: web3.utils.toWei("0.1", "ether")});
        assert.equal(await music.isPurchased({from: accounts[1]}), true);
    });

    it("should not allow a user to purchase a song without sufficient funds", async () => {
        try {
            await music.purchase({from: accounts[2], value: web3.utils.toWei("0.05", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "Minimum purchase value is 0.1 ether");
        }
    });

    it("should not allow a user to access the song without purchasing or having rights", async () => {
        try {
            await music.hasAccess({from: accounts[3]});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "You must purchase or have rights to access the song");
        }
    });

    it("should allow a user to access the song after purchasing", async () => {
        await music.purchase({from: accounts[4], value: web3.utils.toWei("0.1", "ether")});
        assert.equal(await music.hasAccess({from: accounts[4]}), true);
    });

    it("should distribute royalties to the owner", async () => {
        await music.purchase({from: accounts[5], value: web3.utils.toWei("0.1", "ether")});
        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
        await music.distributeRoyalties();
        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
        assert.equal(finalBalance.sub(initialBalance).toString(), address(music).balance.toString());
    });

    it("should stream a song", async () => {
        await music.stream(120, {from: accounts[6], value: web3.utils.toWei("0.2", "ether")});
        assert.equal(await music.streamingCount(accounts[6]), 120);
    });

    it("should not allow a user to stream a song without sufficient funds", async () => {
        try {
            await music.stream(120, {from: accounts[7], value: web3.utils.toWei("0.1", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "Insufficient funds");
        }
    });

    it("should allow a user to leave a review", async () => {
        await music.purchase({from: accounts[8], value: web3.utils.toWei("0.1", "ether")});
        await music.review(5, "Great song!", {from: accounts[8]});
        assert.equal(await music.reviews(0).reviewer, accounts[8]);
        assert.equal(await music.reviews(0).rating, 5);
        assert.equal(await music.reviews(0).text, "Great song!");
    });

    it("should not allow a user who hasn't purchased the song to leave a review", async () => {
        try {
            await music.review(5, "Great song!", {from: accounts[9]});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "You must purchase the song to leave a review");
        }
    });
});

