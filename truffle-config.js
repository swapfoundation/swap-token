const LedgerWalletProvider = require('truffle-ledger-provider');
 
const ledgerOptions = {
  networkId: 1, // mainnet
  path: "44'/60'/0'/0", // ledger default derivation path
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 1     // 第二个账号
};
const provider = new LedgerWalletProvider(ledgerOptions, 'http://localhost:8545');

module.exports = {
  networks: {
    mainnet: {
      host: "127.0.0.1",
      port: 8545,
      provider: provider,
      network_id: 1
    }
  }
};
