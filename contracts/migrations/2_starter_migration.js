require('dotenv').config();
const MerkleStarter = artifacts.require('./MerkleStarter.sol');
const SampleToken = artifacts.require('./SampleToken.sol');

module.exports = async function (deployer) {
  await deployer.deploy(SampleToken, "6000000000000000000", {from: "0xA400fB98722032D14d732AEE8c656451bDF1B21E"})  // fix hardcode
  const tokenAddress = SampleToken.address;
  console.log(tokenAddress)
  await deployer.deploy(MerkleStarter, tokenAddress, '5000000000000000000');    //fix hardcode
};
