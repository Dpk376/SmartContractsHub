pragma solidity ^0.8.0;

contract Government {
    address public owner;
    mapping (address => bool) public citizens;
    mapping (address => uint) public votingRights;
    mapping (bytes32 => bool) public proposals;
    mapping (bytes32 => uint) public voteCount;
    mapping (bytes32 => address) public proposer;
    // added mapping

    constructor() public {
        owner = msg.sender;
    }

    function addCitizen(address citizen) public {
        require(msg.sender == owner, "Only the owner can add citizens.");
        citizens[citizen] = true;
        votingRights[citizen] = 1;
    }

    function removeCitizen(address citizen) public {
        require(msg.sender == owner, "Only the owner can remove citizens.");
        citizens[citizen] = false;
        votingRights[citizen] = 0;
    }

    function propose(bytes32 proposalHash, address proposer) public {
        require(citizens[proposer], "Proposer must be a citizen.");
        require(votingRights[proposer] > 0, "Proposer has no voting rights.");
        require(proposals[proposalHash] == false, "Proposal already exists.");
        proposals[proposalHash] = true;
        voteCount[proposalHash] = 0;
        proposer[proposalHash] = proposer;
    }

    function vote(bytes32 proposalHash, bool vote) public {
        require(citizens[msg.sender], "Voter must be a citizen.");
        require(votingRights[msg.sender] > 0, "Voter has no voting rights.");
        require(proposals[proposalHash], "Proposal does not exist.");
        if (vote) {
            voteCount[proposalHash] += votingRights[msg.sender];
        }
    }

    function getVotes(bytes32 proposalHash) public view returns (uint) {
        return voteCount[proposalHash];
    }
    function getProposer(bytes32 proposalHash) public view returns (address) {
        return proposer[proposalHash];
    }
}
