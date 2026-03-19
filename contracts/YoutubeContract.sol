pragma solidity ^0.8.0;

contract YouTubeClone {
    // Video struct
    struct Video {
        uint256 id;
        string title;
        string url;
        uint256 views;
        uint256 rating;
    }

    // Mapping to store all videos
    mapping (uint256 => Video) public videos;

    // Counter to keep track of the number of videos
    uint256 public videoCount;

    // Event to signal a new video has been added
    event NewVideo(
        uint256 id,
        string title,
        string url
    );

    // Function to upload a new video
    function uploadVideo(string memory title, string memory url) public {
        // Increment the video count
        videoCount++;

        // Create a new video
        Video memory newVideo = Video({
            id: videoCount,
            title: title,
            url: url,
            views: 0,
            rating: 0
        });

        // Add the video to the mapping
        videos[videoCount] = newVideo;

        // Trigger the NewVideo event
        emit NewVideo(videoCount, title, url);
    }

    // Function to view a video
    function viewVideo(uint256 id) public {
        // Increment the number of views for the video
        videos[id].views++;
    }

    // Function to rate a video
    function rateVideo(uint256 id, uint256 rating) public {
        // Update the rating for the video
        videos[id].rating = rating;
    }
}
