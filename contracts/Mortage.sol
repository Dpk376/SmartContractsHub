pragma solidity ^0.8.0;

contract Mortgage {

    address public lender;
    address public borrower;
    uint public mortgageAmount;
    uint public interestRate;
    uint public term;
    uint public monthlyPayment;
    bool public approved;

    event MortgageApplied(address borrower, uint mortgageAmount, uint interestRate, uint term);
    event MortgageApproved(address borrower, uint mortgageAmount, uint interestRate, uint term);
    event MortgageRejected(address borrower);

    constructor() public {
        lender = msg.sender;
    }

    function applyForMortgage(address _borrower, uint _mortgageAmount, uint _interestRate, uint _term) public {
        require(_borrower != address(0));
        borrower = _borrower;
        mortgageAmount = _mortgageAmount;
        interestRate = _interestRate;
        term = _term;
        emit MortgageApplied(borrower, mortgageAmount, interestRate, term);
    }

    function approveMortgage() public {
        require(msg.sender == lender);
        require(!approved);
        approved = true;
        calculateMonthlyPayment();
        emit MortgageApproved(borrower, mortgageAmount, interestRate, term);
    }

    function rejectMortgage() public {
        require(msg.sender == lender);
        require(!approved);
        approved = false;
        emit MortgageRejected(borrower);
    }

    function calculateMonthlyPayment() internal {
        uint interest = (mortgageAmount * interestRate) / 100;
        monthlyPayment = (mortgageAmount + interest) / term;
    }
}
