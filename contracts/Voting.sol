// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @dev Optimized voting contract with quorum and min voter requirements.
 * Improvements:
 * 1. Security: Resolved variable shadowing (endTime).
 * 2. Modernization: Replaced 'now' with 'block.timestamp'.
 * 3. Gas: Used custom errors, fixed precision math, and optimized storage.
 * 4. Clarity: Improved data structures and access control.
 */
contract Voting is Ownable {
    struct Proposal {
        bool exists;
        address proposer;
        uint256 endTimestamp;
        uint256 voteCount;
        bool closed;
        bool passed;
        address[] voters;
    }

    uint256 public minimumVoters;
    uint256 public quorumPercentage;

    mapping(address => bool) public isVoter;
    mapping(address => uint256) public votingRights;
    mapping(bytes32 => Proposal) public proposals;
    mapping(bytes32 => mapping(address => bool)) public hasVoted;

    error OnlyVoter();
    error NoVotingRights();
    error ProposalAlreadyExists();
    error ProposalDoesNotExist();
    error VotingPeriodEnded();
    error VotingPeriodNotEnded();
    error AlreadyVoted();
    error ProposalAlreadyClosed();

    event VoterAdded(address indexed voter, uint256 rights);
    event VoterRemoved(address indexed voter);
    event ProposalCreated(bytes32 indexed proposalHash, address indexed proposer, uint256 endTimestamp);
    event VoteCast(bytes32 indexed proposalHash, address indexed voter, uint256 weight);
    event ProposalClosed(bytes32 indexed proposalHash, bool passed);

    constructor() Ownable(msg.sender) {
        minimumVoters = 10;
        quorumPercentage = 50;
    }

    function addVoter(address voter, uint256 rights) external onlyOwner {
        isVoter[voter] = true;
        votingRights[voter] = rights;
        emit VoterAdded(voter, rights);
    }

    function removeVoter(address voter) external onlyOwner {
        isVoter[voter] = false;
        votingRights[voter] = 0;
        emit VoterRemoved(voter);
    }

    function propose(bytes32 proposalHash, uint256 duration) external {
        if (!isVoter[msg.sender]) revert OnlyVoter();
        if (votingRights[msg.sender] == 0) revert NoVotingRights();
        if (proposals[proposalHash].exists) revert ProposalAlreadyExists();
        
        uint256 endTimestamp = block.timestamp + duration;

        proposals[proposalHash] = Proposal({
            exists: true,
            proposer: msg.sender,
            endTimestamp: endTimestamp,
            voteCount: 0,
            closed: false,
            passed: false,
            voters: new address[](0)
        });

        emit ProposalCreated(proposalHash, msg.sender, endTimestamp);
    }

    function vote(bytes32 proposalHash) external {
        if (!isVoter[msg.sender]) revert OnlyVoter();
        if (votingRights[msg.sender] == 0) revert NoVotingRights();
        
        Proposal storage p = proposals[proposalHash];
        if (!p.exists) revert ProposalDoesNotExist();
        if (block.timestamp > p.endTimestamp) revert VotingPeriodEnded();
        if (hasVoted[proposalHash][msg.sender]) revert AlreadyVoted();

        uint256 weight = votingRights[msg.sender];
        p.voteCount += weight;
        p.voters.push(msg.sender);
        hasVoted[proposalHash][msg.sender] = true;

        emit VoteCast(proposalHash, msg.sender, weight);
    }

    function closeProposal(bytes32 proposalHash) external onlyOwner {
        Proposal storage p = proposals[proposalHash];
        if (!p.exists) revert ProposalDoesNotExist();
        if (p.closed) revert ProposalAlreadyClosed();
        if (block.timestamp <= p.endTimestamp) revert VotingPeriodNotEnded();

        p.closed = true;
        uint256 totalVoters = p.voters.length;
        
        if (totalVoters >= minimumVoters) {
            // quorum check: (votes / totalVoters) >= (quorumPercentage / 100)
            // rearranged for precision: (votes * 100) >= (totalVoters * quorumPercentage)
            if ((p.voteCount * 100) >= (totalVoters * quorumPercentage)) {
                p.passed = true;
            }
        }

        emit ProposalClosed(proposalHash, p.passed);
    }

    // View functions for transparency
    function getVotersList(bytes32 proposalHash) external view returns (address[] memory) {
        return proposals[proposalHash].voters;
    }
}
