it("should allow a borrower to apply for a mortgage", async () => {
    let instance = await Mortgage.deployed();

    // Apply for a mortgage
    let mortgageAmount = web3.utils.toWei("100", "ether");
    let interestRate = 5;
    let term = 12;
    await instance.applyForMortgage(borrower, mortgageAmount, interestRate, term, { from: borrower });

    // Check if the mortgage application was recorded correctly
    let recordedMortgageAmount = await instance.mortgageAmount();
    assert.equal(recordedMortgageAmount, mortgageAmount, "Mortgage amount was not recorded correctly");

    let recordedInterestRate = await instance.interestRate();
    assert.equal(recordedInterestRate, interestRate, "Interest rate was not recorded correctly");

    let recordedTerm = await instance.term();
    assert.equal(recordedTerm, term, "Term was not recorded correctly");
});
it("should allow the lender to approve a mortgage application", async () => {
    let instance = await Mortgage.deployed();

    // Apply for a mortgage
    let mortgageAmount = web3.utils.toWei("100", "ether");
    let interestRate = 5;
    let term = 12;
    await instance.applyForMortgage(borrower, mortgageAmount, interestRate, term, { from: borrower });

    // Approve the mortgage application
    await instance.approveMortgage({ from: lender });

    // Check if the mortgage application was approved
    let mortgageApproved = await instance.approved();
    assert.equal(mortgageApproved, true, "Mortgage application was not approved");
});
it("should allow the lender to reject a mortgage application", async () => {
    let instance = await Mortgage.deployed();

    // Apply for a mortgage
    let mortgageAmount = web3.utils.toWei("100", "ether");
    let interestRate = 5;
    let term = 12;
    await instance.applyForMortgage(borrower, mortgageAmount, interestRate, term, { from: borrower });

    // Reject the mortgage application
    await instance.rejectMortgage({ from: lender });

    // Check if the mortgage application was rejected
    let mortgageApproved = await instance.approved();
    assert.equal(mortgageApproved, false, "Mortgage application was not rejected");
});
it("should not allow a borrower to approve or reject a mortgage", async () => {
    let instance = await Mortgage.deployed();

    // Apply for a mortgage
    let mortgageAmount = 1000000000000000000; // 1 ether
    let interestRate = 5;
    let term = 12;
    await instance.applyForMortgage(borrower, mortgageAmount, interestRate, term, { from: borrower });

    try {
        // Attempt to approve the mortgage as a borrower
        await instance.approveMortgage({ from: borrower });
    } catch (error) {
        assert.equal(error.reason, "Only lender can approve or reject the mortgage", "Borrower should not be able to approve a mortgage");
    }
    try {
        // Attempt to reject the mortgage as a borrower
        await instance.rejectMortgage({ from: borrower });
    } catch (error) {
        assert.equal(error.reason, "Only lender can approve or reject the mortgage", "Borrower should not be able to reject a mortgage");
    }
});
it("should only allow a lender to approve or reject a mortgage once", async () => {
    let instance = await Mortgage.deployed();

    // Apply for a mortgage
    let mortgageAmount = 1000000000000000000; // 1 ether
    let interestRate = 5;
    let term = 12;
    await instance.applyForMortgage(borrower, mortgageAmount, interestRate, term, { from: borrower });

    // Approve the mortgage
    await instance.approveMortgage({ from: lender });

    try {
        // Attempt to approve the mortgage again
        await instance.approveMortgage({ from: lender });
    } catch (error) {
        assert.equal(error.reason, "Mortgage already approved or rejected", "Lender should not be able to approve a mortgage more than once");
    }
    try {
        // Attempt to reject the mortgage again
        await instance.rejectMortgage({ from: lender });
    } catch (error) {
        assert.equal(error.reason, "Mortgage already approved or rejected", "Lender should not be able to reject a mortgage more than once");
    }
});
it("should not allow a borrower to apply for a mortgage with a zero address", async () => {
    let instance = await Mortgage.deployed();

    try {
        // Attempt to apply for a mortgage with a zero address
        let mortgageAmount = 1000000000000000000; // 1 ether
        let interestRate = 5;
        let term = 12;
        await instance.applyForMortgage(address(0), mortgageAmount, interestRate, term, { from: borrower });
    } catch (error) {
        assert.equal(error.reason, "Invalid address", "Borrower should not be able to apply for a mortgage with a zero address");
    }
});
it("should not allow a borrower to apply for a mortgage with a zero address", async () => {
    let instance = await Mortgage.deployed();

    try {
        // Attempt to apply for a mortgage with a zero address
        let mortgageAmount = 1000000000000000000; // 1 ether
        let interestRate = 5;
        let term = 12;
        await instance.applyForMortgage(address(0), mortgageAmount, interestRate, term, { from: borrower });
    } catch (error) {
        assert.equal(error.reason, "Invalid address", "Borrower should not be able to apply for a mortgage with a zero address");
    }
});
it("should not allow a borrower to apply for a mortgage with a zero address", async () => {
    let instance = await Mortgage.deployed();

    try {
        // Attempt to apply for a mortgage with a zero address
        let mortgageAmount = 1000000000000000000; // 1 ether
        let interestRate = 5;
        let term = 12;
        await instance.applyForMortgage(address(0), mortgageAmount, interestRate, term, { from: borrower });
    } catch (error) {
        assert.equal(error.reason, "Invalid address", "Borrower should not be able to apply for a mortgage with a zero address");
    }
});
