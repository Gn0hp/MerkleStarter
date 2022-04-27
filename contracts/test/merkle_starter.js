require('dotenv').config();

const { ethers } = require('ethers');
const { Contract, Wallet } = ethers;

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

var provider = new ethers.providers.InfuraProvider('kovan', process.env.INFURA_ID);
var wallet = new Wallet(process.env.PRIVATE_KEY, provider);

let token = new Contract(tokenAddress, erc20ABI, provider).connect(wallet);
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MerkleStarter", function ( accounts ) {
  it("should assert true", async function () {
    const instance = await MerkleStarter.deployed(token, 5);
    const value = await MerkleStarter.seedNewAllocations(0x4140c387cb08c73ed772f7f4bb434ef28946ac7eabecc13342bbad1ddca50728, 2000000000000000000, {from: accounts[1]})
    console.log(value)
    assert.equal(log.event, "TrancheAdded")
  });
});
