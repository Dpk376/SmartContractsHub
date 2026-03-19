pragma solidity ^0.8.0;

contract Crowdfunding {
    address public campaignCreator;
    string public campaignName;
    string public campaignDescription;
    uint public campaignGoal;
    uint public campaignFunds;
    mapping(address => bool) public backers;
    event FundTransfer(address backer, uint amount);

    constructor(address _campaignCreator, string memory _campaignName, string memory _campaignDescription, uint _campaignGoal) public {
        campaignCreator = _campaignCreator;
        campaignName = _campaignName;
        campaignDescription = _campaignDescription;
        campaignGoal = _campaignGoal;
        campaignFunds = 0;
    }

    function contribute() public payable {
        require(msg.value > 0);
        require(!backers[msg.sender]);

        backers[msg.sender] = true;
        campaignFunds += msg.value;
        emit FundTransfer(msg.sender, msg.value);
    }

    function checkGoalReached() public view returns (bool) {
        return campaignFunds >= campaignGoal;
    }

    function refund() public {
        require(msg.sender == campaignCreator);
        require(checkGoalReached() == false);

        for (address backer in backers) {
            backer.transfer(address(this).balance);
        }
    }

    function withdraw() public {
        require(msg.sender == campaignCreator);
        require(checkGoalReached());

        campaignCreator.transfer(address(this).balance);
    }
}
