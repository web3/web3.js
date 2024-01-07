---
sidebar_position: 4
sidebar_label: 'Tutorial: WebSocket Provider'
---

# Tutorial: WebSocket Provider

The WebSocket Provider provides real-time communication and enhanced performance, offering a dynamic alternative to the simplicity of the HTTP Provider. In comparison to the widely used HTTP Provider, the WebSocket Provider enables your web application to establish a continuous, bidirectional connection, allowing for live updates and faster interactions with the Ethereum network. Incorporate the WebSocket Provider to empower your decentralized applications with real-time capabilities.

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and Ethereum. Additionally, we need to set up our environment by installing the following:

1. **Ganache**

    Ganache is a personal blockchain for Ethereum development that allows you to test how your smart contracts function in real-world scenarios. You can download it from [http://truffleframework.com/ganache](http://truffleframework.com/ganache).

2. **Node.js**

    Node.js is a JavaScript runtime environment that enables you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

3. **npm**

    npm (Node Package Manager) is used to publish and install packages to and from the public npm registry or a private npm registry. You can install it by following the instructions here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

    Alternatively, you can use **yarn** instead of **npm** by following the instructions here: [https://classic.yarnpkg.com/lang/en/docs/getting-started/](https://classic.yarnpkg.com/lang/en/docs/getting-started/).

## WebSocket Provider

WebSocket Provider allows us to communicate with the Ethereum node via WebSocket protocol, which is useful when we want continuous updates on our subscribed items. This provider is ideal for real-time applications that require constant updates from the Ethereum network.

Follow these steps to connect to the Ethereum network using WebSocket provider:

:::tip
The first 3 steps are the same as in the pervious section. So, you may skip them if you already executed the previous section.
:::

1.  Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
2.  Create a new folder and navigate to it:

```bash
mkdir web3-providers-tutorial
cd web3-providers-tutorial
```

3.  Install web3.js using npm:

```bash
npm i web3
```

4.  Create a new JavaScript file called `web3-websocket-provider.js` in your code editor.

5.  Copy and paste the following code into your `web3-websocket-provider.js` file and save it:

```typescript title='WebSocket Provider'
import { Web3 } from 'web3';

// Connect to the Ethereum network using WebSocket provider
const ganacheUrl = 'ws://localhost:8545';
const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl);
const web3 = new Web3(wsProvider);

async function main() {
  try {
    console.log('Does the provider support subscriptions?:', wsProvider.supportsSubscriptions());

    // Subscribe to new block headers
    const subscription = await web3.eth.subscribe('newBlockHeaders');

    subscription.on('data', async (blockhead) => {
      console.log('New block header: ', blockhead);

      // You do not need the next line if you like to keep being notified for every new block
      await subscription.unsubscribe();
      console.log('Unsubscribed from new block headers.');
    });
    subscription.on('error', (error) => console.log('Error when subscribing to New block header: ', error));

    // Get the list of accounts in the connected node which is in this case: Ganache.
    const accounts = await web3.eth.getAccounts();
    // Send a transaction to the network
    const transactionReceipt = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[1],
      value: web3.utils.toWei('0.001', 'ether'),
    });
    console.log('Transaction Receipt:', transactionReceipt);
  } catch (error) {
    console.error(error);
  }
}

main();
```

6. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.

7. Type `node web3-websocket-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the new block headers, transaction hash, and pending transaction printed in the console. The unique feature of WebSocket provider highlighted in this example is that it can subscribe to new block headers and pending transactions to get them in real-time. And by running the sample, you will get something similar to this in your console:

```bash
Do the provider supports subscription?: true
New block header: {
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  miner: '0x0000000000000000000000000000000000000000',
  difficulty: '0',
  totalDifficulty: '0',
  extraData: '0x',
  gasLimit: 6721975,
  gasUsed: 21000,
  hash: '0xd315cecf3336640bcd1301930805370b7fe7528c894b931dcf8a3b1c833b68c8',
  mixHash: '0x1304070fde1c7bee383f3a59da8bb94d515cbd033b2638046520fb6fb596d827',
  nonce: '0x0000000000000000',
  number: 40,
  parentHash: '0xeb7ce3260911db2596ac843df11dbcbef302e813e1922db413f6f0b2a54d584d',
  receiptsRoot: '0xf78dfb743fbd92ade140711c8bbc542b5e307f0ab7984eff35d751969fe57efa',
  stateRoot: '0x95e416eec0932e725ec253779a4e28b3d014d05e41e63c3369f5da42d26d1240',
  timestamp: 1684165088,
  transactionsRoot: '0x8f87380cc7acfb6d10633e10f72567136492cb8301f52a41742eaca9449bb378',
  sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  baseFeePerGas: 4959456,
  size: undefined
}
Transaction Receipt: {
  transactionHash: '0x0578672e97d072b4b91773c8bfc710e4f777616398b82b276323408e59d11362',
  transactionIndex: 0n,
  blockNumber: 1n,
  blockHash: '0x5c05248fe0fb8f45a8c9b9600904a36c0e5c74dce01495cfc72278c185fe7838',
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
Unsubscribed from new block headers.
```
