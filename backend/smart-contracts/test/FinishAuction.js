// test/FinishAuction.js
const AuctionContract = artifacts.require("./Auction");

contract("AuctionContract", accounts => {
  const owner = accounts[0];
  const bidder1 = accounts[1];
  const bidder2 = accounts[2];
  const ipfsHash = "QmX6CvU6SPLszSzhrJU6YBE1VepTUNNhJhD2as9Xjza3qG";
  const price = web3.utils.toWei("1", "ether");
  const step = web3.utils.toWei("0.1", "ether");
  const startTime = Math.floor(Date.now() / 1000) - 60; // 1 minute from now
  const endTime = Math.floor(Date.now() / 1000) + 300; // 2 minutes from now

  /***** HAPPY PATH ****/
  it("should allow owner to finish auction", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, 
        Math.floor(Date.now() / 1000) - 1200,
        Math.floor(Date.now() / 1000) + 2
      );

      function timeout(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
      }

      // Bidder1 places the first valid bid
      const bid1 = web3.utils.toWei("1.2", "ether");
      await contractInstance.placeBid({
        from: bidder1,
        value: bid1
      });
      assert.equal(await contractInstance.highestBid(), bid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), bid1);
      assert.equal(await contractInstance.bidderCount(), 1);
      
      await timeout(7000);

      await contractInstance.finishAuction({ from:owner });
    });

    /** FAILURES */
    it("should not allow owner to finish auction", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime
      );

      // Bidder1 places the first valid bid
      const bid1 = web3.utils.toWei("1.2", "ether");
      await contractInstance.placeBid({
        from: bidder1,
        value: bid1
      });
      assert.equal(await contractInstance.highestBid(), bid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), bid1);
      assert.equal(await contractInstance.bidderCount(), 1);

      try {
          await contractInstance.finishAuction({ from:owner });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("Auction cannot be finished before its end time"), 
                 "Expected to fail with: Auction cannot be finished before its end time")
        }
      
    });

    it("should not allow anyone but owner to finish auction", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime
      );

      // Bidder1 places the first valid bid
      const bid1 = web3.utils.toWei("1.2", "ether");
      await contractInstance.placeBid({
        from: bidder1,
        value: bid1
      });
      assert.equal(await contractInstance.highestBid(), bid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), bid1);
      assert.equal(await contractInstance.bidderCount(), 1);

      try {
          await contractInstance.finishAuction({ from:bidder2 });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("Only the contract owner can perform this action"), 
                 "Expected to fail with: Only the contract owner can perform this action")
        }
      
    });


});