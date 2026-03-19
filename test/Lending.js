const EscrowLending = artifacts.require("EscrowLending");

contract("EscrowLending", (accounts) => {
    let contract;
    let lender = accounts[0];
    let borrower = accounts[1];
    let arbitrator = accounts[2];
    let loanAmount = 100;
    let interestRate = 0.1;
    let loanPeriod = 86400; // one day in seconds

    beforeEach(async () => {
        contract = await EscrowLending.new(lender, borrower, arbitrator, loanAmount, interestRate, loanPeriod, {from: lender});
    });

    it("should create the loan", async () => {
        let status = await contract.getLoanStatus();
        assert.equal(status[0], false, "Loan should not be paid");
        assert.equal(status[1], false, "Loan should not be defaulted");
    });

    it("should allow borrower to repay loan", async () => {
        let tx = await contract.repayLoan({from: borrower, value: loanAmount + (loanAmount * interestRate)});
        let status = await contract.getLoanStatus();
        assert.equal(status[0], true, "Loan should be paid");
        assert.equal(status[1], false, "Loan should not be defaulted");
        assert.equal(tx.logs[0].event, "LoanRepaid", "LoanRepaid event should be emitted");
    });

    it("should not allow borrower to repay loan if loan period has expired", async () => {
        await time.increase(loanPeriod + 1); // increase time by more than loan period
        try {
            await contract.repayLoan({from: borrower, value: loanAmount + (loanAmount * interestRate)});
            assert.fail("Expected throw not received");
        } catch (err) {
            assert.include(err.message, "Loan period has expired", "Error message should indicate loan period has expired");
        }
    });

    it("should allow arbitrator to default loan if loan period has expired", async () => {
        await time.increase(loanPeriod + 1); // increase time by more than loan period
        let tx = await contract.defaultLoan({from: arbitrator});
        let status = await contract.getLoanStatus();
        assert.equal(status[0], false, "Loan should not be paid");
        assert.equal(status[1], true, "Loan should be defaulted");
        assert.equal(tx.logs[0].event, "LoanDefaulted", "LoanDefaulted event should be emitted");
    });

    it("should not allow arbitrator to default loan if loan period has not expired", async () => {
        try {
            await contract.defaultLoan({from: arbitrator});
            assert.fail("Expected throw not received");
        } catch (err) {
            assert.include(err.message, "Loan period has not expired", "Error message should indicate loan period has not expired");
        }
    });

    it("should not allow lender to forgive loan if loan is not defaulted", async () => {
    try {
        await contract.forgiveLoan({from: lender});
        assert.fail("Expected throw not received");
    } catch (err) {
        assert.include(err.message, "Loan is not in default", "Error message should indicate loan is not in default");
    }
});

it("should not allow lender to forgive loan if loan is already paid", async () => {
    await contract.repayLoan({from: borrower, value: loanAmount + (loanAmount * interestRate)});
    try {
        await contract.forgiveLoan({from: lender});
        assert.fail("Expected throw not received");
    } catch (err) {
        assert.include(err.message, "Loan already repaid", "Error message should indicate loan is already repaid");
    }
});

