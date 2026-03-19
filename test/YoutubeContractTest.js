const YouTubeClone = artifacts.require("YouTubeClone");

contract("YouTubeClone", function(accounts) {
    let youtubeClone;

    beforeEach(async function() {
        youtubeClone = await YouTubeClone.new();
    });

    it("should upload a video", async function() {
        await youtubeClone.uploadVideo("Test Video", "http://test.com/video1", { from: accounts[0] });
        let videoCount = await youtubeClone.videoCount();
        assert.equal(videoCount, 1, "Video count should be 1");
        let video = await youtubeClone.videos(1);
        assert.equal(video.title, "Test Video", "Video title should be Test Video");
        assert.equal(video.url, "http://test.com/video1", "Video url should be http://test.com/video1");
    });

    it("should view a video", async function() {
        await youtubeClone.uploadVideo("Test Video", "http://test.com/video1", { from: accounts[0] });
        await youtubeClone.viewVideo(1, { from: accounts[0] });
        let video = await youtubeClone.videos(1);
        assert.equal(video.views, 1, "Number of views should be 1");
    });

    it("should rate a video", async function() {
        await youtubeClone.uploadVideo("Test Video", "http://test.com/video1", { from: accounts[0] });
        await youtubeClone.rateVideo(1, 5, { from: accounts[0] });
        let video = await youtubeClone.videos(1);
        assert.equal(video.rating, 5, "Rating should be 5");
    });
    
    it("should only allow a user to rate a video once", async function() {
        await youtubeClone.uploadVideo("Test Video", "http://test.com/video1", { from: accounts[0] });
        await youtubeClone.rateVideo(1, 5, { from: accounts[0] });
        let video = await youtubeClone.videos(1);
        assert.equal(video.rating, 5, "First rating should be 5");

        try {
            await youtubeClone.rateVideo(1, 4, { from: accounts[0] });
        } catch (error) {
            assert.include(error.message, "revert", "Error should be revert");
        }

        video = await youtubeClone.videos(1);
        assert.equal(video.rating, 5, "Second rating should not be allowed and should remain 5");
});

});
