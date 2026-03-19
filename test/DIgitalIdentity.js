const DigitalIdentity = artifacts.require("DigitalIdentity");

contract("DigitalIdentity", async (accounts) => {
    let digitalIdentity;

    const owner = accounts[0];
    const identity1 = accounts[1];
    const identity2 = accounts[2];

    const identityData = "test data";
    const updatedIdentityData = "updated test data";

    before(async () => {
        digitalIdentity = await DigitalIdentity.deployed();
    });

    // Test creating a new identity
    it("should create a new identity", async () => {
        await digitalIdentity.createIdentity(identityData);
        const hasIdentity = await digitalIdentity.hasIdentity(owner);
        assert.equal(hasIdentity, true, "Identity should be created");
        const identityData = await digitalIdentity.getIdentityData(owner);
        assert.equal(identityData, identityData, "Identity data should match");
    });

    // Test revoking an identity
    it("should revoke an identity", async () => {
        await digitalIdentity.createIdentity(identityData);
        await digitalIdentity.revokeIdentity(owner);
        const hasIdentity = await digitalIdentity.hasIdentity(owner);
        assert.equal(hasIdentity, false, "Identity should be revoked");
    });

    // Test changing identity data
    it("should change identity data", async () => {
        await digitalIdentity.createIdentity(identityData);
        await digitalIdentity.changeIdentityData(owner, updatedIdentityData);
        const identityData = await digitalIdentity.getIdentityData(owner);
        assert.equal(identityData, updatedIdentityData, "Identity data should be updated");
    });

    // Test trying to create an identity for an address that already has one
    it("should not allow creating an identity for an address that already has one", async () => {
        await digitalIdentity.createIdentity(identityData);
        try {
            await digitalIdentity.createIdentity(identityData);
            assert.fail("Should throw an error if address already has an identity");
        } catch (error) {
            assert.include(error.message, "revert", "Should throw a revert error");
        }
    });

    // Test trying to revoke an identity that doesn't exist
    it("should not allow revoking an identity that doesn't exist", async () => {
        try {
            await digitalIdentity.revokeIdentity(owner);
            assert.fail("Should throw an error if identity doesn't exist");
        } catch (error) {
            assert.include(error.message, "revert", "Should throw a revert error");
        }
    });

    // Test trying to revoke an identity that isn't owned by the caller
    it("should not allow revoking an identity that isn't owned by the caller", async () => {
        await digitalIdentity.createIdentity(identityData);
        try {
            await digitalIdentity.revokeIdentity(identity1, {from: identity2});
            assert.fail("Should throw an error if identity isn't owned by the caller");
        } catch (error) {
            assert.include(error.message, "revert", "Should throw a revert error");
        }
     });
    
    
    // Test trying to change data for an identity that doesn't exist
    it("should not allow changing data for an identity that doesn't exist", async () => {
        try {
            await digitalIdentity.changeIdentityData(owner, updatedIdentityData);
            assert.fail("Should throw an error if identity doesn't exist");
        } catch (error) {
            assert.include(error.message, "revert", "Should throw a revert error");
        }
    });

    // Test trying to change data for an identity that isn't owned by the caller
    it("should not allow changing data for an identity that isn't owned by the caller", async () => {
        await digitalIdentity.createIdentity(identityData);
        try {
            await digitalIdentity.changeIdentityData(identity1, updatedIdentityData, {from: identity2});
            assert.fail("Should throw an error if identity isn't owned by the caller");
        } catch (error) {
            assert.include(error.message, "revert", "Should throw a revert error");
        }
    });

