---
sidebar_position: 6
sidebar_label: 'Tutorial: Truffle'
---

# Tutorial: Truffle 

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and Ethereum. Additionally, we need to set up our environment by installing the following:

1. **Ganache**

    Ganache is a personal blockchain for Ethereum development that allows you to test how your smart contracts function in real-world scenarios. You can download it from [http://truffleframework.com/ganache](http://truffleframework.com/ganache).

2. **Node.js**

    Node.js is a JavaScript runtime environment that enables you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

3. **npm**

    npm (Node Package Manager) is used to publish and install packages to and from the public npm registry or a private npm registry. You can install it by following the instructions here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

    Alternatively, you can use **yarn** instead of **npm** by following the instructions here: [https://classic.yarnpkg.com/lang/en/docs/getting-started/](https://classic.yarnpkg.com/lang/en/docs/getting-started/).

4. **Geth** (Optional, used only at the IPC provider example)

    Geth (go-ethereum) is an Ethereum execution client meaning it handles transactions, deployment and execution of smart contracts and contains an embedded computer known as the Ethereum Virtual Machine. You can install it by following the instructions here: [https://geth.ethereum.org/docs/getting-started/installing-geth](https://geth.ethereum.org/docs/getting-started/installing-geth)

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

## Practical ways of connecting to a provider

1. Browser Injected Ethereum Provider
2. Setting Web3 Provider using a string URL

## Browser Injected Ethereum Provider

It is easy to connect to the Ethereum network using an Ethereum browser extension such as MetaMask, or an Ethereum-enabled browser like the browser inside TrustWallet. Because they inject their provider object into the browser's JavaScript context, enabling direct interaction with the Ethereum network from your web application. Moreover, the wallet management is conveniently handled by these extensions or browsers, making it the standard approach for DApp developers to facilitate user interactions with the Ethereum network.

Technically, you use `window.ethereum` when it is injected by the Ethereum browser extension or the Ethereum-enabled browser. However, before using this provider, you need to check if it is available and then call `enable()` to request access to the user's MetaMask account.

Before start coding you will need to setup and configure Ganache and MetaMask, if you have not already:

-   Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.
-   Install the MetaMask extension for your browser. You can download MetaMask from their website: https://metamask.io/.

Follow these steps to connect to the Ethereum network with MetaMask and web3.js, including the steps to create a local web server using Node.js:

1. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
2. Create a new folder and navigate to it:

```bash
mkdir web3-browser-injected-providers
cd web3-browser-injected-providers
```

3. Use npm to initialize the folder. This will simply create a `package.json` file:

```bash
npm init -y
```

4. Install the Express module and add it to your project's dependencies:

```bash
npm i express
```

5. Create a new HTML file named `index.html` in your code editor (inside `web3-browser-injected-providers`).

6. Copy and paste the following code into `index.html`, and save it after:

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <title>Connecting to the Ethereum network with Web3.js and MetaMask</title>
  </head>
  <body>
    <h1>Connecting to the Ethereum network with Web3.js and MetaMask</h1>
    <pre id='log'>
  You need to approve connecting this website to MetaMask.
  Click on the MetaMask icon in the browser extension, if it did not show a popup already.
  </pre
    >

    <script src='https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js'></script>
    <script>
      window.addEventListener('load', async function () {
        // Check if web3 is available
        if (typeof window.ethereum !== 'undefined') {
          // Use the browser injected Ethereum provider
          web3 = new Web3(window.ethereum);
          // Request access to the user's MetaMask account (ethereum.enable() is deprecated)
          // Note: Even though, you can also get the accounts from `await web3.eth.getAccounts()`,
          // 	you still need to make a call to any MetaMask RPC to cause MetaMask to ask for concent.
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          console.log('Accounts requested from MetaMask RPC: ', accounts);

          document.getElementById('log').textContent = 'Sending a self transaction... Follow the instructions on MetaMask.';

          try {
            // Send a transaction to the network and wait for the transaction to be mined.
            const transactionReceipt = await web3.eth.sendTransaction({
              from: accounts[0],
              to: accounts[0], // sending a self-transaction
              value: web3.utils.toWei('0.001', 'ether'),
            });

            document.getElementById('log').textContent = 'Sending a self transaction succeeded';
            document.getElementById('log').textContent += `\n  Transaction hash: ${transactionReceipt.transactionHash}`;
            document.getElementById('log').textContent += `\n  Gas Used: ${transactionReceipt.gasUsed} gwei`;
          } catch (error) {
            console.log('error', error);
            document.getElementById('log').textContent = 'Error happened: ' + JSON.stringify(error, null, '  ');
          }
        } else {
          // If web3 is not available, give instructions to install MetaMask
          document.getElementById('log').innerHTML = 'Please install MetaMask to connect to the Ethereum network.';
        }
      });
    </script>
  </body>
</html>
```

7. Create a new file called `server.js` (inside `web3-browser-injected-providers`).
8. Copy and paste the following code into `server.js`, and save it after:

```js
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '.')));

app.listen(8097, () => {
  console.log('Server started on port 8097');
});
```

9. Start the Node.js server by executing the following command. This will execute the content of `server.js` which will run the server on port 8097:

```bash
node server.js
```

10. Open your web browser and navigate to `http://localhost:8097/`. MetaMask should ask for your approval to connect to your website. Follow the steps and give your consent.
11. If everything is set up properly, you should be able to connect to the Ethereum network with MetaMask and see the logged account address.

Note that in the above steps you had created a local web server using Node.js and Express, serving your HTML file from the root directory of your project. You needs this local server because many browser does not allow extensions to inject objects for static files located on your machine. However, you can customize the port number and the root directory if needed.

Now you can start building your Ethereum application with web3.js and MetaMask!

## Setting Web3 Provider using a String URL

web3.js allows you to set the Ethereum network provider, easily, by passing a string URL containing either the `http`, `https`, `ws`, or `wss` protocol. This provider can be used to connect to a remote server or node.

And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `wss`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.

To set the Web3 provider from a URL, you can use the following code snippet:

```ts
const web3 = new Web3('https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID');
```

Replace `<YOUR_INFURA_PROJECT_ID>` with your own Infura project ID. This code snippet creates a new Web3 instance with Infura's Ropsten network endpoint as the provider.

However, if you do not want to use Infura and want to run your own Ethereum node, you can set the provider to a local node with, for example, the `http` protocol, like this:

```ts
const web3 = new Web3('http://localhost:8545');
```

This code snippet sets the provider to a local node running on port 8545.

You can also use the `WebSocket` protocol to connect to a remote Ethereum node that supports it, like this:

```ts
const web3 = new Web3('wss://eth-mainnet.alchemyapi.io/v2/<YOUR_API_KEY>');
```

With this code snippet, Web3 will create a WebSocket provider object connection to Alchemy's mainnet endpoint. However, you need to replace `<YOUR_API_KEY>` with your own API Key.

A few points to consider:

-   Make sure the URL you are using is correct, including the protocol and port if necessary.
-   If you are using a remote node, make sure your firewall allows access to the specified port.
-   It is recommended to use encrypted protocols `https` and `wss` when connecting to Ethereum network using a string URL.
