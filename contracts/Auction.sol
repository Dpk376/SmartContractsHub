// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Auction
 * @dev Optimized and secure auction contract with a pull-payment pattern.
 * Improvements:
 * 1. Withdrawal Pattern: Prevents DoS attacks by allowing bidders to withdraw their own funds.
 * 2. Security: Added ReentrancyGuard and Ownable.
 * 3. Modernization: Replaced 'now' with 'block.timestamp'.
 * 4. Gas: Used custom errors and optimized state updates.
 */
contract Auction is ReentrancyGuard, Ownable {
    string public itemName;
    string public itemDescription;
    uint256 public immutable startingPrice;
    uint256 public immutable endingTime;
    
    address public highestBidder;
    uint256 public highestBid;
    bool public auctionEnded;

    mapping(address => uint256) public pendingReturns;

    error AuctionAlreadyEnded();
    error AuctionNotYetEnded();
    error BidTooLow(uint256 currentHighest);
    error CannotBidOnOwnAuction();
    error NoFundsToWithdraw();
    error TransferFailed();

    event NewBid(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    constructor(
        string memory _itemName, 
        string memory _itemDescription, 
        uint256 _startingPrice, 
        uint256 _duration
    ) Ownable(msg.sender) {
        itemName = _itemName;
        itemDescription = _itemDescription;
        startingPrice = _startingPrice;
        highestBid = _startingPrice;
        endingTime = block.timestamp + _duration;
    }

    /**
     * @dev Place a bid on the item.
     * Uses a withdrawal pattern to prevent DoS attacks.
     */
    function bid() external payable nonReentrant {
        if (block.timestamp >= endingTime || auctionEnded) revert AuctionAlreadyEnded();
        if (msg.value <= highestBid) revert BidTooLow(highestBid);
        if (msg.sender == owner()) revert CannotBidOnOwnAuction();

        if (highestBidder != address(0)) {
            // Add the previous highest bid to the pending returns mapping
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        emit NewBid(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw a bid that was outbid.
     */
    function withdraw() external nonReentrant returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount <= 0) revert NoFundsToWithdraw();

        pendingReturns[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            pendingReturns[msg.sender] = amount;
            revert TransferFailed();
        }

        return true;
    }

    /**
     * @dev End the auction and send the highest bid to the seller (owner).
     */
    function endAuction() external onlyOwner nonReentrant {
        if (block.timestamp < endingTime && !auctionEnded) revert AuctionNotYetEnded();
        if (auctionEnded) revert AuctionAlreadyEnded();

        auctionEnded = true;
        emit AuctionEnded(highestBidder, highestBid);

        (bool success, ) = payable(owner()).call{value: highestBid}("");
        if (!success) revert TransferFailed();
    }
}
