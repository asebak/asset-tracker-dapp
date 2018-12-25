let HDWalletProvider = require("truffle-hdwallet-provider");
let mnemonic = "";
let apiKey = "";
module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    integration: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + apiKey);
      },
      network_id: 1
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
