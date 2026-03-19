pragma solidity ^0.8.0;

contract SupplyChain {
    // Product details
    address public owner;
    string public productName;
    string public productId;
    string public productDescription;

    // Supply chain events
    address public manufacturer;
    address public supplier;
    address public distributor;
    address public retailer;

    // IoT sensor data
    string public location;
    string public temperature;
    string public condition;
    uint public timestamp;

    // Events
    event ProductAdded(address _owner, string _productName, string _productId);
    event LocationUpdated(string _location);
    event TemperatureUpdated(string _temperature);
    event ConditionUpdated(string _condition);

    // Methods
    function addProduct(string _productName, string _productId, string _productDescription) public {
        require(msg.sender == owner);
        productName = _productName;
        productId = _productId;
        productDescription = _productDescription;
        emit ProductAdded(msg.sender, _productName, _productId);
    }

    function updateLocation(string _location) public {
        require(msg.sender == manufacturer || msg.sender == supplier || msg.sender == distributor || msg.sender == retailer);
        location = _location;
        timestamp = now;
        emit LocationUpdated(_location);
    }

    function updateTemperature(string _temperature) public {
        require(msg.sender == manufacturer || msg.sender == supplier || msg.sender == distributor || msg.sender == retailer);
        temperature = _temperature;
        timestamp = now;
        emit TemperatureUpdated(_temperature);
    }

    function updateCondition(string _condition) public {
        require(msg.sender == manufacturer || msg.sender == supplier || msg.sender == distributor || msg.sender == retailer);
        condition = _condition;
        timestamp = now;
        emit ConditionUpdated(_condition);
    }
}
