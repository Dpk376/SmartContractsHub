const Auction = artifacts.require("Auction");

contract("Auction", (accounts) => {
    let instance;
    let seller = accounts[0];
    let buyer1 = accounts[1];
    let buyer2 = accounts[2];
    let endingTime = (Math.floor(Date.now() / 1000) + 60); 

    beforeEach(async () => {
        instance = await Auction.new(seller, "Test Item", "Test Description", 10 ether, endingTime);
    });

    it("should place a bid", async () => {
        let balance = await web3.eth.getBalance(buyer1);
        await instance.bid({ from: buyer1, value: 15 ether });
        assert.equal(await instance.highestBid(), 15 ether);
        assert.equal(await instance.highestBidder(), buyer1);
        assert.isTrue(balance > await web3.eth.getBalance(buyer1));
    });

    it("should not place a bid if the bid is not higher", async () => {
        try {
            await instance.bid({ from: buyer1, value: 5 ether });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

    it("should not place a bid if the auction has ended", async () => {
        await instance.endAuction();
        try {
            await instance.bid({ from: buyer1, value: 15 ether });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

    it("should not place a bid if the sender is the seller", async () => {
        try {
            await instance.bid({ from: seller, value: 15 ether });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

    it("should end the auction", async () => {
        await instance.bid({ from: buyer1, value: 15 ether });
        let balance = await web3.eth.getBalance(buyer1);
        await instance.endAuction();
        assert.isTrue(await instance.auctionEnded());
        assert.isTrue(balance < await web3.eth.getBalance(buyer1));
    });
    
    it("should not end the auction if the sender is not the seller", async () => {
    try {
        await instance.endAuction({ from: buyer1 });
        assert.fail();
    } catch (error) {
        assert.include(error.message, "revert");
    }
    });

    it("should not end the auction if the auction has already ended", async () => {
        await instance.endAuction();
        try {
            await instance.endAuction();
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

