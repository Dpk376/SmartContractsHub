pragma solidity ^0.8.0;

contract Insurance {
    address payable owner;
    mapping(address => uint) policyAmount;
    mapping(address => bool) claims;
    uint policyPeriod;

    constructor(uint _policyPeriod) public {
        owner = msg.sender;
        policyPeriod = _policyPeriod;
    }

    function buyPolicy(uint amount) public payable {
        require(msg.value == amount);
        policyAmount[msg.sender] = amount;
    }

    function claim() public {
        require(msg.sender == owner);
        require(claims[msg.sender] == false);
        require(block.timestamp >= policyPeriod);
        msg.sender.transfer(address(this).balance);
        claims[msg.sender] = true;
    }

    function getPolicyAmount(address policyHolder) public view returns (uint) {
        return policyAmount[policyHolder];
    }

    function getPolicyPeriod() public view returns (uint) {
        return policyPeriod;
    }
}
