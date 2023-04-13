const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const Auction = require('./../contracts/Auction.json');

const { sendResponse, deployDataToIPFS } = require("../utils/helper");

// Address and private key in this case this identifies creator of the auction
const address = '0xDf1a0eb2Fc860399DF81082720E9333AC512651e';                             // Use 3rd entry of generated by Ganache
const privateKey = '9b0572c204675343ddbf4ec15bbafd7fd7c23caee62ecad14379b50466137cfc';    // Use 3rd entry of generated by Ganache
const infuraUrl = 'http://184.73.59.112:8545'                                             // Taken from ganache

module.exports.handler = async (event) => {

   const contractAddress = event.contractAddress;

   const provider = new Provider(privateKey, infuraUrl);
   const web3 = new Web3(provider);
   const networkId = await web3.eth.net.getId();
   // A contract can be deployed from here. See my chatGpt
   const auctionContract = new web3.eth.Contract(
     Auction.abi,
     contractAddress
   );
   try{
     console.log("Placaing first bid...")
     let result = await auctionContract.methods.placeBid().send( {from: address, value: 17} )
     console.log(`Transaction Hash: ${result.transactionHash}`)
   } catch (err) {
     console.log(err);
     const errorMessage = err.message ? err.message : 'Internal Server Error';
     return sendResponse(500, { errorMessage });
   }
}