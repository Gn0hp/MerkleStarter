require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          'https://data-seed-prebsc-2-s1.binance.org:8545'
        ),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    kovan:{
      provider: function(){
        return new HDWalletProvider(process.env.PRIVATE_KEY, "https://kovan.infura.io/v3/" + process.env.INFURA_ID)
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  compilers: {
    solc: {
      version: '0.6.6',
    },
  },
};
