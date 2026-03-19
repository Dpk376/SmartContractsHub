pragma solidity ^0.8.0;

contract SimpleBlockchain {
    // Define an array to store blocks
    Block[] public blocks;
    // Define a mapping to store the balance of each address
    mapping (address => uint) public balance;
    // Define an event for when a new block is added
    event NewBlock(bytes32 previousHash, bytes32 data, uint timestamp);

    // Define a struct to represent a block
    struct Block {
        bytes32 previousHash;
        bytes32 data;
        uint timestamp;
    }

    // Define a function to add a new block
    function addBlock(bytes32 _previousHash, bytes32 _data) public {
        // Check if the sender has enough balance
        require(balance[msg.sender] >= 1 ether, "Not enough balance to add a new block");
        // Deduct the cost of adding a new block from the sender's balance
        balance[msg.sender] -= 1 ether;

        Block memory newBlock;
        newBlock.previousHash = _previousHash;
        newBlock.data = _data;
        newBlock.timestamp = now;
        blocks.push(newBlock);

        // Emit an event for the new block
        emit NewBlock(_previousHash, _data, now);
    }

    // Define a function to retrieve the current block
    function getBlock(uint _blockNumber) public view returns (bytes32, bytes32, uint) {
        return (blocks[_blockNumber].previousHash, blocks[_blockNumber].data, blocks[_blockNumber].timestamp);
    }

    // Define a function to get the balance of an address
    function getBalance(address _address) public view returns (uint) {
        return balance[_address];
    }

    // Define a function to deposit ether to the contract
    function deposit() public payable {
        require(msg.value > 0, "Cannot deposit 0 ether");
        balance[msg.sender] += msg.value;
    }

    // Define a function to validate blocks
    function validateBlock(uint _blockNumber) public view returns(bool) {
        // Retrieve the current block
        Block memory currentBlock = blocks[_blockNumber];
        // Retrieve the previous block
        Block memory previousBlock = blocks[_blockNumber - 1];
        // Compare the previous hash of the current block to the hash of the previous block
        if (currentBlock.previousHash == keccak256(abi.encodePacked(previousBlock.data, previousBlock.timestamp))) {
            return true;
        } else {
            return false;
        }
    }
}
