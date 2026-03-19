pragma solidity ^0.8.0;

contract Hackathon {
    address public organizer;
    address[] public participants;
    mapping(address => bool) public isParticipant;
    uint public prizePool;
    address[] public winners;
    string public hackathonName;
    uint public registrationFee;
    address[] public judges;
    mapping(address => bool) public isJudge;
    mapping(address => uint) public participantScore;

    constructor(address _organizer, string memory _hackathonName, uint _registrationFee) public {
        organizer = _organizer;
        hackathonName = _hackathonName;
        registrationFee = _registrationFee;
    }

    function register(address participant) public payable {
        require(msg.value == registrationFee);
        require(!isParticipant[participant]);
        isParticipant[participant] = true;
        participants.push(participant);
    }

    function addPrize(uint prize) public {
        require(msg.sender == organizer);
        prizePool += prize;
    }

    function addJudge(address judge) public {
        require(msg.sender == organizer);
        require(!isJudge[judge]);
        isJudge[judge] = true;
        judges.push(judge);
    }

    function assignScore(address participant, uint score) public {
        require(isJudge[msg.sender]);
        participantScore[participant] = score;
    }

    function selectWinner() public {
        require(msg.sender == organizer);
        uint maxScore = 0;
        address maxScorer;
        for (uint i = 0; i < participants.length; i++) {
            if (participantScore[participants[i]] > maxScore) {
                maxScore = participantScore[participants[i]];
                maxScorer = participants[i];
            }
        }
        winners.push(maxScorer);
    }

    function distributePrizes() public {
        require(msg.sender == organizer);
        for (uint i = 0; i < winners.length; i++) {
            winners[i].transfer(prizePool / winners.length);
        }
    }
}
