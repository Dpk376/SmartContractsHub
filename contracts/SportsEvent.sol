pragma solidity ^0.8.0;

contract SportsEvent {
    struct EventData {
        string homeTeam;
        string awayTeam;
        uint date;
        address location;
    }
    EventData public event;
    mapping(address => uint) public ticketPurchases;
    uint public ticketPrice;
    uint public ticketTotal;
    address public owner;
    mapping(address => bool) public liveStreamAccess;
    mapping(address => string) public supportedTeam;
    mapping(address => mapping(string => uint)) public bets;


    constructor(string memory _homeTeam, string memory _awayTeam, uint _date, address _location, uint _ticketPrice, uint _ticketTotal) public {
        owner = msg.sender;
        event.homeTeam = _homeTeam;
        event.awayTeam = _awayTeam;
        event.date = _date;
        event.location = _location;
        ticketPrice = _ticketPrice;
        ticketTotal = _ticketTotal;
    }

    function purchaseTicket() public payable {
        require(msg.value >= ticketPrice, "Insufficient funds");
        require(ticketPurchases[msg.sender] < 5, "You have reached the maximum number of tickets that can be purchased");
        ticketPurchases[msg.sender]++;
        ticketTotal--;
    }

    function distributeRevenue() public {
        require(msg.sender == owner, "Only the owner can distribute revenue");
        uint revenue = address(this).balance;
        msg.sender.transfer(revenue);
    }
    

    function liveStream() public payable {
        require(msg.value >= liveStreamPrice, "Insufficient funds");
        liveStreamAccess[msg.sender] = true;
    }
    
    function selectTeam(string memory _team) public {
        require(_team == event.homeTeam || _team == event.awayTeam, "Invalid team selection");
        supportedTeam[msg.sender] = _team;
    }
   

    function placeBet(string memory _team, uint _amount) public payable {
        require(msg.value >= _amount, "Insufficient funds");
        require(_team == event.homeTeam || _team == event.awayTeam, "Invalid team selection");
        bets[msg.sender][_team] += _amount;
    }
    
    function refund() public {
        require(ticketPurchases[msg.sender] > 0, "You haven't purchased a ticket for this event");
        ticketTotal++;
        ticketPurchases[msg.sender]--;
        msg.sender.transfer(ticketPrice);
    }

}
