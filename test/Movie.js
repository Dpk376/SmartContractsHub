const Movie = artifacts.require("Movie");

contract("Movie", accounts => {
    let movie;

    beforeEach(async () => {
        movie = await Movie.new("The Movie", "John Doe", ["Jane Smith", "Bob Johnson"], 1577836800);
    });

    it("should purchase a movie", async () => {
        await movie.purchase({from: accounts[1], value: web3.utils.toWei("1", "ether")});
        assert.equal(await movie.isPurchased({from: accounts[1]}), true);
    });

    it("should not allow a user to purchase a movie without sufficient funds", async () => {
        try {
            await movie.purchase({from: accounts[2], value: web3.utils.toWei("0.5", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "Minimum purchase value is 1 ether");
        }
    });

    it("should not allow a user to access the movie without purchasing or having rights", async () => {
        try {
            await movie.hasAccess({from: accounts[3]});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "You must purchase or have rights to access the movie");
        }
    });

    it("should allow a user to access the movie after purchasing", async () => {
        await movie.purchase({from: accounts[4], value: web3.utils.toWei("1", "ether")});
        assert.equal(await movie.hasAccess({from: accounts[4]}), true);
    });

    it("should allow a user to access the movie after acquiring rights", async () => {
        await movie.acquireRights({from: accounts[5]});
        assert.equal(await movie.hasAccess({from: accounts[5]}), true);
    });

    it("should distribute royalties to stakeholders", async () => {
        await movie.purchase({from: accounts[6], value: web3.utils.toWei("1", "ether")});
        await movie.purchase({from: accounts[7], value: web3.utils.toWei("1", "ether")});
        await movie.distributeRoyalties([accounts[0], accounts[1], accounts[50, 25, 25]);
        const initialBalance0 = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
        const initialBalance1 = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        const initialBalance2 = web3.utils.toBN(await web3.eth.getBalance(accounts[2]));
        await movie.transferRoyalties();
        const finalBalance0 = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
        const finalBalance1 = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        const finalBalance2 = web3.utils.toBN(await web3.eth.getBalance(accounts[2]));
        assert.equal(finalBalance0.sub(initialBalance0).toString(), (address(movie).balance * 50 / 100).toString());
        assert.equal(finalBalance1.sub(initialBalance1).toString(), (address(movie).balance * 25 / 100).toString());
        assert.equal(finalBalance2.sub(initialBalance2).toString(), (address(movie).balance * 25 / 100).toString());
    });

    it("should allow a user to buy a ticket", async () => {
        await movie.buyTicket(2, {from: accounts[8], value: web3.utils.toWei("2", "ether")});
        assert.equal(await movie.ticketCount(accounts[8]), 2);
    });

        it("should not allow a user to buy a ticket without sufficient funds", async () => {
        try {
            await movie.buyTicket(2, {from: accounts[9], value: web3.utils.toWei("1", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "Insufficient funds");
        }
    });

    it("should allow a user to leave a review", async () => {
        await movie.purchase({from: accounts[10], value: web3.utils.toWei("1", "ether")});
        await movie.review(5, "Great movie!", {from: accounts[10]});
        assert.equal(await movie.reviews(0).reviewer, accounts[10]);
        assert.equal(await movie.reviews(0).rating, 5);
        assert.equal(await movie.reviews(0).text, "Great movie!");
    });

    it("should not allow a user who hasn't purchased the movie to leave a review", async () => {
        try {
            await movie.review(5, "Great movie!", {from: accounts[11]});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "You must purchase the movie to leave a review");
        }
    });
});


