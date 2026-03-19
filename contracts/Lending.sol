pragma solidity ^0.8.0;

contract EscrowLending {
    address payable lender;
    address borrower;
    address arbitrator;
    uint256 loanAmount;
    uint256 interestRate;
    uint256 loanPeriod;
    uint256 startTime;
    uint256 endTime;
    bool loanPaid;
    bool loanDefaulted;

    constructor(address payable _lender, address _borrower, address _arbitrator, uint256 _loanAmount, uint256 _interestRate, uint256 _loanPeriod) public {
        lender = _lender;
        borrower = _borrower;
        arbitrator = _arbitrator;
        loanAmount = _loanAmount;
        interestRate = _interestRate;
        loanPeriod = _loanPeriod;
        startTime = now;
        endTime = startTime + loanPeriod;
        loanPaid = false;
        loanDefaulted = false;
    }

    event LoanCreated(address lender, address borrower, uint256 loanAmount, uint256 interestRate, uint256 loanPeriod);

    event LoanRepaid(address borrower);

    event LoanDefaulted(address borrower);

    event LoanForgiven(address lender);

    function repayLoan() public payable {
        require(msg.sender == borrower, "Only borrower can repay the loan.");
        require(loanPaid == false, "Loan already repaid.");
        require(loanDefaulted == false, "Loan is in default, cannot be repaid.");
        require(now <= endTime, "Loan period has expired.");
        require(msg.value >= loanAmount + (loanAmount * interestRate), "Repayment amount is less than the outstanding loan and interest.");

        lender.transfer(msg.value);
        loanPaid = true;

        emit LoanRepaid(borrower);
    }

    function defaultLoan() public {
        require(msg.sender == arbitrator, "Only the arbitrator can default the loan.");
        require(loanPaid == false, "Loan already repaid, cannot be defaulted.");
        require(loanDefaulted == false, "Loan already defaulted.");
        require(now > endTime, "Loan period has not expired.");

        loanDefaulted = true;

        emit LoanDefaulted(borrower);
    }

    function forgiveLoan() public {
        require(msg.sender == lender, "Only lender can forgive the loan.");
        require(loanPaid == false, "Loan already repaid, cannot be forgiven.");
        require(loanDefaulted == true, "Loan is not in default, cannot be forgiven.");

        emit LoanForgiven(lender);
    }

    function getLoanStatus() public view returns (bool paid, bool defaulted) {
        return (loanPaid, loanDefaulted);
    }
}
