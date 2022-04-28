require('dotenv').config();
const Merkle = require('../utils/merkle.module');
const csv = require('csv-parser');
const fs = require('fs');
const BN = require('bn.js');
const { ethers } = require('ethers');
const { Contract, Wallet } = ethers;
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

var provider = new ethers.providers.InfuraProvider('kovan', process.env.INFURA_ID);
// var provider = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/e15346e2fa154d95b6b01123fb43dda6");
var wallet = new Wallet(process.env.PRIVATE_KEY, provider);

async function seedNewAllocations(dataFile) {
  try {
    const listeners = [];
    let totalAllocation = new BN('0');
    const s = fs.createReadStream(path.resolve(__dirname, dataFile)).pipe(csv({ headers: false }));
    for await (const row of s) {
      const values = Object.values(row);
      const user = values[0].toLowerCase();
      const alloc = new BN(values[1] + '000000000000000000');
      totalAllocation = totalAllocation.add(alloc);
      listeners.push([user, alloc]);
    }

    if (listeners.length < 2) {
      listeners.push(['0x0000000000000000000000000000000000000000', new BN('0')]);
    }

    let tranche = await Merkle.getTranche(...listeners);

    let tree = await Merkle.createTree(tranche);

    let treeRoot = Merkle.root(tree.tree.layers);
    let merkleRoot = Merkle.hexRoot(treeRoot);

    totalAllocation = totalAllocation.toString();
    console.log('merkleRoot', merkleRoot);
    console.log('totalAllocation', totalAllocation);

    /**
     * Node environment
     */
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const erc20ABI = require(path.resolve(__dirname, '..', 'contracts', 'IERC20.json')).abi;
    const starterAddress = process.env.STARTER_ADDRESS;
    const starterABI = require(path.resolve(__dirname, '..', 'contracts', 'MerkleStarter.json'))
      .abi;

    let token = new Contract(tokenAddress, erc20ABI, provider).connect(wallet);
    let starter = new Contract(starterAddress, starterABI, provider).connect(wallet);

    let tx;
    tx = await token.approve(starterAddress, totalAllocation);
    console.log("Awaiting")
    await tx.wait();
    console.log('approve done!');
    // const estimate = await provider.estimateGas({
    //   from: "0xa400fb98722032d14d732aee8c656451bdf1b21e",
    //   to: "0x78279174141536aa666f26ed13ffbf592fcee6c9",
    //   data: "0x65ef53b1361d8964891c1cce88a2b8976d55862992785e36521561c6cc0fd895bd75497c0000000000000000000000000000000000000000000000004563918244f40000",
    //   type: 0,
    // });
    // console.log(estimate)
    tx = await starter.seedNewAllocations(merkleRoot, totalAllocation);

/*  seedNewAllocations call safeTransferFrom which is in SafeERC20
    ERR could be:
      - totalAllocation -> calcu by Eth not wei
      - wrong import solidity file
      - estimate gas???? (dont know)
      - not enough fund for supply 

  -- All work right except this 
*/


    console.log("Awaiting seed new Allocation")
    await tx.wait();

    console.log('Seed new allocation done !');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function main() {
  const dataFile = argv.dataFile;
  if (!dataFile) {
    console.error('Please provide data file by flag --dataFile');
    process.exit(1);
  }
  await seedNewAllocations(dataFile);
}

main();
