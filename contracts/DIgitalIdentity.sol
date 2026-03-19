pragma solidity ^0.8.0;

contract DigitalIdentity {
    mapping(address => bool) public identities;
    mapping(address => address) public identityOwners;
    mapping(address => string) public identityData;
    mapping(address => bool) public identityRevoked;

    event IdentityCreated(address indexed _address);
    event IdentityRevoked(address indexed _address);
    event IdentityDataChanged(address indexed _address, string _data);

    function createIdentity(string memory _data) public {
        require(!identities[msg.sender]);
        identities[msg.sender] = true;
        identityOwners[msg.sender] = msg.sender;
        identityData[msg.sender] = _data;
        emit IdentityCreated(msg.sender);
    }

    function revokeIdentity(address _address) public {
        require(identities[_address]);
        require(identityOwners[_address] == msg.sender);
        identityRevoked[_address] = true;
        emit IdentityRevoked(_address);
    }

    function changeIdentityData(address _address, string memory _data) public {
        require(identities[_address]);
        require(identityOwners[_address] == msg.sender);
        identityData[_address] = _data;
        emit IdentityDataChanged(_address, _data);
    }

    function hasIdentity(address _address) public view returns (bool) {
        return identities[_address] && !identityRevoked[_address];
    }

    function getIdentityData(address _address) public view returns (string memory) {
        require(hasIdentity(_address));
        return identityData[_address];
    }
}
