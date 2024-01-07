---
sidebar_position: 7
sidebar_label: 'Tutorial: Third Party Provider'
---

# Truffle 

The Truffle HDWallet Provider will be used as an example of a third party provider that is EIP 1193 compatible.

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and Ethereum. Additionally, we need to set up our environment by installing the following:

1. **Ganache**

    Ganache is a personal blockchain for Ethereum development that allows you to test how your smart contracts function in real-world scenarios. You can download it from [http://truffleframework.com/ganache](http://truffleframework.com/ganache).

2. **Node.js**

    Node.js is a JavaScript runtime environment that enables you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

3. **npm**

    npm (Node Package Manager) is used to publish and install packages to and from the public npm registry or a private npm registry. You can install it by following the instructions here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

    Alternatively, you can use **yarn** instead of **npm** by following the instructions here: [https://classic.yarnpkg.com/lang/en/docs/getting-started/](https://classic.yarnpkg.com/lang/en/docs/getting-started/).

## Third-party Providers (Compliant with EIP 1193)

web3.js accepts any provider that is in compliance with [EIP-1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md). It has tests written to ensure compatibility with @truffle/hdwallet-provider, Ganache provider, Hardhat provider, and Incubed (IN3) as a provider. The following section, [Browser Injected Ethereum Provider](#browser-injected-ethereum-provider), in this tutorial explains how to use a special case of these third-party providers.

Here is a step-by-step example and a code snippet to connect your web application to the Ethereum network using `@truffle/hdwallet-provider` as an example of an external provider compliant with EIP 1193.

1.  Open a command prompt or terminal window in a new folder.
2.  Type `npm init -y` and press Enter. This will create a `package.json` file in the current directory.
3.  Install web3.js and HTTP provider using npm:

```bash
npm i web3 @truffle/hdwallet-provider bip39
```

4.  Create a new JavaScript file, called `index.js`, in your code editor.
5.  Copy and paste the following code into your JavaScript file, and then save the file:

```typescript title='EIP1193 Provider (Truffle)'
import { Web3 } from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import bip39 from 'bip39';

const mnemonic: string = bip39.generateMnemonic(); // generates seed phrase
console.log('seed phrase:', mnemonic);

// Connect to the Ethereum network using an HTTP provider and WalletProvider
const provider: HDWalletProvider = new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const web3: Web3 = new Web3(provider);

// Get the current block number from the network
web3.eth
  .getBlockNumber()
  .then(function (blockNumber: number) {
    console.log('Current block number:', blockNumber);
  })
  .catch(function (error: any) {
    console.log('Error:', error);
  });
```

6. Replace `'YOUR_INFURA_PROJECT_ID'` with your own Infura project ID. You can obtain an Infura project ID by signing up for a free account at https://infura.io/register. Alternatively, you can use any other URL that is compatible with HDWalletProvider, such as a local Ganache accessible at `'http://localhost:7545'`.

7. In the command prompt, run `node index.js` and press Enter. This will execute your JavaScript file and connect to the Ethereum network using HDWalletProvider with Infura.

If everything is set up properly, you should see the current block number printed in the console similar to the following.

```bash
seed phrase: remain climb clock valid budget cable tunnel force split level measure repair
Current block number: 17317844n
```

:::danger
Your seed phrase gives complete access to your Ethereum account and it should **never** be shared with anyone you don't want to give full access to your account. The seed phrase is `console.log`ed in the code example to show you what it looks like, but you should **never** do this with a seed phrase to an account you plan on using to send real money.
:::

The sample above connected you to the Ethereum network using truffle HD Wallet-enabled Web3 provider. You can modify it to interact with the network, perform transactions, and read/write data from the Ethereum network.

