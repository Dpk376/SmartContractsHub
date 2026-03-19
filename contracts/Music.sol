pragma solidity ^0.8.0;

contract Music {
    struct MusicData {
        string title;
        string artist;
        string album;
        uint releaseDate;
    }
    MusicData public music;
    mapping(address => bool) public buyers;
    address public owner;
    mapping(address => uint) public streamingCount;
    mapping(address => uint) public royalties;
    mapping(address => bool) public licensed;
    Review[] public reviews;

    constructor(string memory _title, string memory _artist, string memory _album, uint _releaseDate) public {
        owner = msg.sender;
        music.title = _title;
        music.artist = _artist;
        music.album = _album;
        music.releaseDate = _releaseDate;
    }

    function purchase() public payable {
        require(msg.value >= 0.1 ether, "Minimum purchase value is 0.1 ether");
        buyers[msg.sender] = true;
    }

    function isPurchased() public view returns (bool) {
        return buyers[msg.sender];
    }

    function distributeRoyalties() public {
        require(msg.sender == owner, "Only the owner can distribute royalties");
        uint royalties = address(this).balance;
        msg.sender.transfer(royalties);
    }
    

    function stream(uint _seconds) public payable {
        require(msg.value >= _seconds * streamingPrice, "Insufficient funds");
        streamingCount[msg.sender] += _seconds;
    }
    
    function hasAccess() public view returns (bool) {
        return buyers[msg.sender] || msg.sender.call.value(0)("hasRightsToMusic", title);
    }
    

    function distributeRoyalties(address[] memory _stakeholders, uint[] memory _percentages) public {
        require(msg.sender == owner, "Only the owner can distribute royalties");
        require(_stakeholders.length == _percentages.length, "Number of stakeholders must match number of percentages");
        uint royalties = address(this).balance;
        for (uint i = 0; i < _stakeholders.length; i++) {
            royalties[_stakeholders[i]] = royalties.mul(_percentages[i]).div(100);
        }
    }
    

    function license(string memory _usage, uint _fee) public payable {
        require(msg.value >= _fee, "Insufficient funds");
        licensed[msg.sender] = true;
        // store usage and fee information
    }

    struct Review {
        address reviewer;
        uint rating;
        string text;
    }


    function review(uint _rating, string memory _text) public {
        require(buyers[msg.sender], "You must purchase the song to leave a review");
        Review memory newReview;
        newReview.reviewer = msg.sender;
        newReview.rating = _rating;
        newReview.text = _text;
        reviews.push(newReview);
    }
}
