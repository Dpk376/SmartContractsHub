pragma solidity ^0.8.0;

contract Lottery {
    address public owner;
    address[] public players;
    uint256 public prizePool;

    constructor() public {
        owner = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.1 ether, "entry fee must be greater than 0.1 ether");
        players.push(msg.sender);
        prizePool += msg.value;
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % players.length;
    }

    function selectWinner() public {
        require(msg.sender == owner, "only the owner can select a winner");
        require(players.length > 0, "no players have entered the lottery");

        uint256 winnerIndex = random();
        address winner = players[winnerIndex];
        prizePool.transfer(winner);
    }
    
    address[] public whitelist;

    function addToWhitelist(address _address) public {
        require(msg.sender == owner, "only the owner can add to the whitelist");
        whitelist.push(_address);
    }

    function enter() public payable {
        require(whitelist.length == 0 || whitelist.indexOf(msg.sender) != -1, "address not in whitelist");
        ...
    }
    
    function refund() public {
    require(msg.sender == owner, "only the owner can refund");
    for (uint256 i = 0; i < players.length; i++) {
        if (players[i] != winner) {
            players[i].transfer(msg.value);
        }
    }
}

    mapping(address => uint256) public entries;

    function enter() public payable 
    {
      require(entries[msg.sender] < 10, "limit of 10 entries per address reached");
      entries[msg.sender]++;
      ...
    }
    
    address public winner;

    function selectWinner() public {
        ...
        winner = winnerIndex;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

}
