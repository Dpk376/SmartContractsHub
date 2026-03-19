const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", async accounts => {
    let instance;
    const owner = accounts[0];

    beforeEach(async () => {
        instance = await SupplyChain.new({ from: owner });
    });

    it("should add product correctly", async () => {
        const productName = "productName";
        const productId = "productId";
        const productDescription = "productDescription";
        await instance.addProduct(productName, productId, productDescription, { from: owner });
        const result = await instance.productName();
        assert.equal(result, productName, "product name not added correctly");
    });

    it("should update location correctly", async () => {
        const location = "location";
        await instance.updateLocation(location, { from: owner });
        const result = await instance.location();
        assert.equal(result, location, "location not updated correctly");
    });

    it("should update temperature correctly", async () => {
        const temperature = "temperature";
        await instance.updateTemperature(temperature, { from: owner });
        const result = await instance.temperature();
        assert.equal(result, temperature, "temperature not updated correctly");
    });

    it("should update condition correctly", async () => {
        const condition = "condition";
        await instance.updateCondition(condition, { from: owner });
        const result = await instance.condition();
        assert.equal(result, condition, "condition not updated correctly");
    });
});
