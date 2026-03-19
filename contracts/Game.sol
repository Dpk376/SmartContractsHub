pragma solidity ^0.8.0;

contract Game {
    mapping(address => uint) public score;
    event NewScore(address indexed player, uint score);

    function play(uint _score) public {
        score[msg.sender] += _score;
        emit NewScore(msg.sender, _score);
    }

    function getPlayerScore(address player) public view returns (uint) {
        return score[player];
    }

    function getTopPlayers() public view returns (address[] memory) {
        address[] memory topPlayers;
        uint count = 0;
        for (address player in score) {
            if (count == 10) {
                break;
            }
            topPlayers.push(player);
            count++;
        }
        return topPlayers;
    }
    function resetAllScores() public {
    require(msg.sender == owner, "Only the owner can reset all scores.");
    for (address player in score) {
        score[player] = 0;
    }
}

}
