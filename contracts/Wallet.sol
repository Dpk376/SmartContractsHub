pragma solidity ^0.8.0;

contract Wallet {
    address public owner;
    mapping(address => bool) public authorized;
    event Authorized(address indexed authorized);

    constructor() public {
        owner = msg.sender;
        authorized[msg.sender] = true;
    }

    function authorize(address user) public {
        require(msg.sender == owner, "Only the owner can authorize users.");
        authorized[user] = true;
        emit Authorized(user);
    }

    function revoke(address user) public {
        require(msg.sender == owner, "Only the owner can revoke users.");
        authorized[user] = false;
    }

    function transfer(address to, uint256 value) public {
        require(authorized[msg.sender], "Sender must be authorized.");
        require(to != address(0), "Invalid address.");
        require(value > 0, "Invalid value.");
        require(address(this).balance >= value, "Insufficient balance.");
        to.transfer(value);
    }
}
