/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.17",
  networks: {
    accounts: {
      url: "http://127.0.0.1:8545",
      mnemonic: process.env.WEB3_SYSTEM_TEST_MNEMONIC,
      passphrase: "123",
      chainId: 1337
    }
  }
};
