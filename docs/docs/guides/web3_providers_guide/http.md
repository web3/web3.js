---
sidebar_position: 3
sidebar_label: 'Tutorial: HTTP Provider'
---

# Tutorial: HTTP Provider

The HTTP Provider is the simplest and most widely used provider, while the Websocket Provider and IPC Provider offer real-time communication and faster performance, respectively. With these providers, you can connect your web application to the Ethereum network and start building decentralized applications.

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and Ethereum. Additionally, we need to set up our environment by installing the following:

1. **Ganache**

    Ganache is a personal blockchain for Ethereum development that allows you to test how your smart contracts function in real-world scenarios. You can download it from [http://truffleframework.com/ganache](http://truffleframework.com/ganache).

2. **Node.js**

    Node.js is a JavaScript runtime environment that enables you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

3. **npm**

    npm (Node Package Manager) is used to publish and install packages to and from the public npm registry or a private npm registry. You can install it by following the instructions here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

    Alternatively, you can use **yarn** instead of **npm** by following the instructions here: [https://classic.yarnpkg.com/lang/en/docs/getting-started/](https://classic.yarnpkg.com/lang/en/docs/getting-started/).

## HTTP Provider

The HTTP Provider allows you to connect to a publicly available Ethereum node, making it easy and straightforward to communicate with the Ethereum network from your web application.

To connect to the Ethereum network using the HTTP provider, follow these steps:

1. Open a command prompt or terminal window and navigate to the directory where you want to create the folder for this example.
2. Create a new folder and navigate to it:

```bash
mkdir web3-providers-tutorial
cd web3-providers-tutorial
```

3. Install web3.js using npm:

```bash
npm i web3
```

4. Create a new JavaScript file called `web3-http-provider.js` in your code editor.

5. Copy and paste the following code into your `web3-http-provider.js` file and save it:

```typescript title='HTTP Provider'
import { Web3 } from 'web3';

// Connect to the Ethereum network using the HTTP provider
const ganacheUrl = 'http://localhost:7545';
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
const web3 = new Web3(httpProvider);

async function main() {
  try {
    // Get the current block number from the network
    const currentBlockNumber = await web3.eth.getBlockNumber();
    console.log('Current block number:', currentBlockNumber);

    // Get the list of accounts in the connected node (e.g., Ganache)
    const accounts = await web3.eth.getAccounts();

    // Send a transaction to the network and wait for the transaction to be mined.
    // Note that sending a transaction with Ganache will cause it, in its default configuration, to min a new block.
    const transactionReceipt = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[1],
      value: web3.utils.toWei('0.001', 'ether'),
    });
    console.log('Transaction Receipt:', transactionReceipt);

    // Get the updated block number
    const updatedBlockNumber = await web3.eth.getBlockNumber();
    console.log('Updated block number:', updatedBlockNumber);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
```

6. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.

7. In the command prompt or terminal window, type `node web3-http-provider.js` and press Enter. This will run your JavaScript file and connect to the Ethereum network using the HTTP provider and Ganache.

If everything is set up properly, you should see the current block number, the transaction receipt, and the updated block number printed in the console:

```bash
Current block number: 0n
Transaction Receipt: {
  transactionHash: '0x0578672e97d072b4b91773c8bfc710e4f777616398b82b276323408e59d11362',
  transactionIndex: 0n,
  blockNumber: 1n,
  blockHash: '0x348a6706e7cce6547fae2c06b3e8eff1f58e4669aff88f0af7ca250ffdcdeef5',
  from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
  to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
  cumulativeGasUsed: 21000n,
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  effectiveGasPrice: 2000000000n,
  type: 0n
}
Updated block number: 1n
```
