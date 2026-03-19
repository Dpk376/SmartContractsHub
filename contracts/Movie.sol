pragma solidity ^0.8.0;

contract Movie {
    struct MovieData {
        string title;
        string director;
        string[] cast;
        uint releaseDate;
    }
    MovieData public movie;
    mapping(address => bool) public buyers;
    address public owner;
    mapping(address => uint) public ticketCount;
    mapping(address => uint) public royalties;

    constructor(string memory _title, string memory _director, string[] memory _cast, uint _releaseDate) public {
        owner = msg.sender;
        movie.title = _title;
        movie.director = _director;
        movie.cast = _cast;
        movie.releaseDate = _releaseDate;
    }

    function purchase() public payable {
        require(msg.value >= 1 ether, "Minimum purchase value is 1 ether");
        buyers[msg.sender] = true;
    }

    function isPurchased() public view returns (bool) {
        return buyers[msg.sender];
    }

    function release() public {
        require(msg.sender == owner, "Only the owner can release the movie");
        movie.releaseDate = now;
    }

    function distributeRoyalties() public {
        require(msg.sender == owner, "Only the owner can distribute royalties");
        uint royalties = address(this).balance;
        msg.sender.transfer(royalties);
    }
   
    function buyTicket(uint _ticketCount) public payable {
        require(msg.value >= _ticketCount * ticketPrice, "Insufficient funds");
        ticketCount[msg.sender] += _ticketCount;
    }
    
    function hasAccess() public view returns (bool) {
        return buyers[msg.sender] || msg.sender.call.value(0)("hasRightsToMovie", title);
    }

    function distributeRoyalties(address[] memory _stakeholders, uint[] memory _percentages) public {
        require(msg.sender == owner, "Only the owner can distribute royalties");
        require(_stakeholders.length == _percentages.length, "Number of stakeholders must match number of percentages");
        uint royalties = address(this).balance;
        for (uint i = 0; i < _stakeholders.length; i++) {
            royalties[_stakeholders[i]] = royalties.mul(_percentages[i]).div(100);
        }
    }
    
    struct Review 
    {
        address reviewer;
        uint rating;
        string text;
    }

    Review[] public reviews;

    function review(uint _rating, string memory _text) public {
        require(buyers[msg.sender], "You must purchase the movie to leave a review");
        Review memory newReview;
        newReview.reviewer = msg.sender;
        newReview.rating = _rating;
        newReview.text = _text;
        reviews.push(newReview);
    }

}
