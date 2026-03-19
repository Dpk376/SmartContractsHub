const Game = artifacts.require("Game");

contract("Game", accounts => {
    let contract;
    const player1 = accounts[0];
    const player2 = accounts[1];
    const player3 = accounts[2];
    const score1 = 10;
    const score2 = 20;
    const score3 = 30;

    beforeEach(async () => {
        contract = await Game.new();
    });

    it("should allow players to play and update their score", async () => {
        await contract.play(score1, { from: player1 });
        assert.equal(await contract.getPlayerScore(player1), score1);
    });

    it("should emit a NewScore event when a player plays", async () => {
        const tx = await contract.play(score1, { from: player1 });
        assert.equal(tx.logs[0].event, "NewScore");
        assert.equal(tx.logs[0].args.player, player1);
        assert.equal(tx.logs[0].args.score, score1);
    });

    it("should get the top 10 players with the highest scores", async () => {
        await contract.play(score3, { from: player1 });
        await contract.play(score2, { from: player2 });
        await contract.play(score1, { from: player3 });
        const topPlayers = await contract.getTopPlayers();
        assert.equal(topPlayers.length, 3);
        assert.equal(topPlayers[0], player1);
        assert.equal(topPlayers[1], player2);
        assert.equal(topPlayers[2], player3);
    });
    
    it("should update scores for multiple players", async () => {
      await contract.play(score1, { from: player1 });
      await contract.play(score2, { from: player2 });
      await contract.play(score3, { from: player3 });
      assert.equal(await contract.getPlayerScore(player1), score1);
      assert.equal(await contract.getPlayerScore(player2), score2);
      assert.equal(await contract.getPlayerScore(player3), score3);
    });
    
    it("should handle concurrent access from multiple players", async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
          promises.push(contract.play(score1, { from: player1 }));
      }
      await Promise.all(promises);
      assert.equal(await contract.getPlayerScore(player1), score1 * 10);
    });

    
    it("should reset all scores", async () => {
        await contract.play(score1, { from: player1 });
        await contract.play(score2, { from: player2 });
        await contract.play(score3, { from: player3 });
        assert.notEqual(await contract.getPlayerScore(player1), 0);
        assert.notEqual(await contract.getPlayerScore(player2), 0);
        assert.notEqual(await contract.getPlayerScore(player3), 0);
        await contract.resetAllScores({ from: owner });
        assert.equal(await contract.getPlayerScore(player1), 0);
    });
});
