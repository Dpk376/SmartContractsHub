const SportsEvent = artifacts.require("SportsEvent");

contract("SportsEvent", accounts => {
    let sportsEvent;
    const homeTeam = "Home Team";
    const awayTeam = "Away Team";
    const date = 1577836800;
    const location = accounts[9];
    const ticketPrice = web3.utils.toWei("1", "ether");
    const ticketTotal = 10;

    beforeEach(async () => {
        sportsEvent = await SportsEvent.new(homeTeam, awayTeam, date, location, ticketPrice, ticketTotal);
    });

    it("should purchase a ticket", async () => {
        await sportsEvent.purchaseTicket({from: accounts[1], value: ticketPrice});
        assert.equal(await sportsEvent.ticketPurchases(accounts[1]), 1);
        assert.equal(await sportsEvent.ticketTotal(), 9);
    });

    it("should not allow a user to purchase a ticket without sufficient funds", async () => {
        try {
            await sportsEvent.purchaseTicket({from: accounts[2], value: web3.utils.toWei("0.5", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "Insufficient funds");
        }
    });

    it("should not allow a user to purchase more than 5 tickets", async () => {
        for (let i = 0; i < 5; i++) {
            await sportsEvent.purchaseTicket({from: accounts[3], value: ticketPrice});
        }
        try{
            await sportsEvent.purchaseTicket({from: accounts[3], value: ticketPrice});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "You have reached the maximum number of tickets that can be purchased");
        }
    });

    it("should allow a user to select a team", async () => {
        await sportsEvent.selectTeam(homeTeam, {from: accounts[4]});
        assert.equal(await sportsEvent.supportedTeam(accounts[4]), homeTeam);
    });

    it("should not allow a user to select an invalid team", async () => {
        try {
            await sportsEvent.selectTeam("Invalid Team", {from: accounts[5]});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "Invalid team selection");
        }
    });

    it("should allow a user to place a bet", async () => {
        await sportsEvent.placeBet(awayTeam, web3.utils.toWei("1", "ether"), {from: accounts[6], value: web3.utils.toWei("1", "ether")});
        assert.equal(await sportsEvent.bets(accounts[6], awayTeam), web3.utils.toWei("1", "ether"));
    });

    it("should not allow a user to place a bet with insufficient funds", async () => {
        try {
            await sportsEvent.placeBet(awayTeam, web3.utils.toWei("1", "ether"), {from: accounts[7], value: web3.utils.toWei("0.5", "ether")});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "Insufficient funds");
        }
    });

    it("should allow a user to request a refund", async () => {
        await sportsEvent.purchaseTicket({from: accounts[8], value: ticketPrice});
        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[8]));
        await sportsEvent.refund({from: accounts[8]});
        assert.equal(await sportsEvent.ticketPurchases(accounts[8]), 0);
        assert.equal(await sportsEvent.ticketTotal(), 11);
        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[8]));
        assert.equal(finalBalance.sub(initialBalance).toString(), ticketPrice.toString());
    });

    it("should not allow a user who hasn't purchased a ticket to request a refund", async () => {
        try {
            await sportsEvent.refund({from: accounts[9]});
            assert.fail();
        } catch (err) {
            assert.equal(err.reason, "You haven't purchased a ticket for this event");
        }
    });
});

       

