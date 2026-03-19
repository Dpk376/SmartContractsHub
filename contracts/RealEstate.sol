pragma solidity ^0.8.0;

contract RealEstate {
    address public owner;
    string public propertyName;
    string public propertyDescription;
    uint public price;
    bool public forSale;

    constructor(address _owner, string memory _propertyName, string memory _propertyDescription, uint _price) public {
        owner = _owner;
        propertyName = _propertyName;
        propertyDescription = _propertyDescription;
        price = _price;
        forSale = true;
    }

    function setForSale(bool _forSale) public {
        require(msg.sender == owner);
        forSale = _forSale;
    }

    function changePrice(uint _price) public {
        require(msg.sender == owner);
        price = _price;
    }

    function buyProperty() public payable {
        require(msg.value == price);
        require(forSale);
        require(msg.sender != owner);
        owner = msg.sender;
        forSale = false;
    }
}
