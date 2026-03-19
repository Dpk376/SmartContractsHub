const RealEstate = artifacts.require("RealEstate");

contract("RealEstate", (accounts) => {
    let instance;
    let owner = accounts[0];
    let buyer = accounts[1];

    beforeEach(async () => {
        instance = await RealEstate.new(owner, "Test Property", "Test Description", 10 ether);
    });

    it("should set the property for sale", async () => {
        await instance.setForSale(true);
        assert.isTrue(await instance.forSale());
    });

    it("should change the price of the property", async () => {
        await instance.changePrice(20 ether);
        assert.equal(await instance.price(), 20 ether);
    });

    it("should buy the property", async () => {
        let balance = await web3.eth.getBalance(buyer);
        await instance.buyProperty({ from: buyer, value: 10 ether });
        assert.isFalse(await instance.forSale());
        assert.equal(await instance.owner(), buyer);
        assert.isTrue(balance > await web3.eth.getBalance(buyer));
    });

    it("should not buy the property if it is not for sale", async () => {
        await instance.setForSale(false);
        try {
            await instance.buyProperty({ from: buyer, value: 10 ether });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });

    it("should not buy the property if the price is incorrect", async () => {
        try {
            await instance.buyProperty({ from: buyer, value: 5 ether });
            assert.fail();
        } catch (error) {
            assert.include(error.message, "revert");
        }
    });
});
