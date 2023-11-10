---
sidebar_label: Examples
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Example usage

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

## Types of Providers

web3.js supports several types of providers, each with its own unique features or specific use cases. Here are the main types:

1. [HTTP Provider](#http-provider)
2. [WebSocket Provider](#websocket-provider)
3. [IPC Provider (for Node.js)](#websocket-provider)
4. [Third-party Providers (Compliant with EIP 1193)](#third-party-providers-compliant-with-eip-1193)

### HTTP Provider

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

<Tabs groupId="prog-lang" queryString>

<TabItem value="javascript" label="JavaScript" default
attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');

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

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript"
  	attributes={{className: "typescript-tab"}}>

```typescript
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

  </TabItem>
</Tabs>

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

### WebSocket Provider

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

<Tabs groupId="prog-lang" queryString>

<TabItem value="javascript" label="JavaScript" default
attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');

// Connect to the Ethereum network using WebSocket provider
const ganacheUrl = 'ws://localhost:8545';
const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl);
const web3 = new Web3(wsProvider);

async function main() {
	try {
		console.log(
			'Does the provider support subscriptions?:',
			wsProvider.supportsSubscriptions(),
		);

		// Subscribe to new block headers
		const subscription = await web3.eth.subscribe('newBlockHeaders');

		subscription.on('data', async blockhead => {
			console.log('New block header: ', blockhead);

			// You do not need the next line if you like to keep being notified for every new block
			await subscription.unsubscribe();
			console.log('Unsubscribed from new block headers.');
		});
		subscription.on('error', error =>
			console.log('Error when subscribing to New block header: ', error),
		);

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

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript"
  	attributes={{className: "typescript-tab"}}>

```typescript
import { Web3 } from 'web3';

// Connect to the Ethereum network using WebSocket provider
const ganacheUrl = 'ws://localhost:8545';
const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl);
const web3 = new Web3(wsProvider);

async function main() {
	try {
		console.log(
			'Does the provider support subscriptions?:',
			wsProvider.supportsSubscriptions(),
		);

		// Subscribe to new block headers
		const subscription = await web3.eth.subscribe('newBlockHeaders');

		subscription.on('data', async blockhead => {
			console.log('New block header: ', blockhead);

			// You do not need the next line if you like to keep being notified for every new block
			await subscription.unsubscribe();
			console.log('Unsubscribed from new block headers.');
		});
		subscription.on('error', error =>
			console.log('Error when subscribing to New block header: ', error),
		);

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

  </TabItem>
</Tabs>

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

### IPC Provider (for Node.js)

The IPC Provider allows you to connect to an Ethereum node using Inter-Process Communication (IPC) in a Node.js environment. This provider is useful when you have a local Ethereum node running on your machine and want to interact with it using Node.js.

In the following steps you will run `geth` in development mode and you will run a piece of code that reads the Ethereum accounts and sends a transaction:

To connect to the Ethereum network using the IPC provider, follow these steps:

1. Start a `geth` node in development mode by opening a terminal window and navigating to the `geth` executable file. Then, run the following command to create a development chain:

```bash
geth --dev --ipcpath <path>
```

Make sure to replace `<path>` with the desired IPC path. For example:

```bash
geth --dev --ipcpath /Users/username/Library/Ethereum/geth.ipc
```

This will start a `geth` node in development mode with IPC enabled and an IPC path specified. If the command is successful, the `geth` node will be running, and you should see output similar to the following:

```bash
INFO [12-10|15:10:37.121] IPC endpoint opened		 	url=<path>
INFO [12-10|15:10:37.122] HTTP endpoint opened		 	url=http://localhost:8545
INFO [12-10|15:10:37.122] WebSocket endpoint opened		url=ws://localhost:8546
INFO [12-10|15:10:37.127] Mapped network port		  	proto=udp extport=0 intport=30303 interface=UPnP(UDP)
```

2.  Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
3.  Create a new folder and navigate to it:

    ```bash
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

4.  Install web3.js using npm:

        ```bash

    npm i web3

        ```

5.  Create a new JavaScript file called `web3-ipc-provider.js` in your code editor.

6.  Copy and paste the following code into your `web3-ipc-provider.js` file and save it:

<Tabs groupId="prog-lang" queryString>

<TabItem value="javascript" label="JavaScript" default
attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');
const { IpcProvider } = require('web3-providers-ipc');

// Connect to the Ethereum network using IPC provider
const ipcPath = '<path>'; // Replace with your actual IPC path
const ipcProvider = new IpcProvider(ipcPath);

const web3 = new Web3(ipcProvider);

async function main() {
	try {
		console.log('Does the provider support subscriptions?:', ipcProvider.supportsSubscriptions());

		// Get the list of accounts in the connected node which is in this case: geth in dev mode.
		const accounts = await web3.eth.getAccounts();
		console.log('Accounts:', accounts);

		// Send a transaction to the network
		const transactionReceipt = await web3.eth.sendTransaction({
			from: accounts[0],
			to: accounts[0], // sending a self-transaction
			value: web3.utils.toWei('0.001', 'ether'),
		});
		console.log('Transaction Receipt:', transactionReceipt);
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

main();
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript"
  	attributes={{className: "typescript-tab"}}>

```typescript
import { Web3 } from 'web3';
import { IpcProvider } from 'web3-providers-ipc';

// Connect to the Ethereum network using IPC provider
const ipcPath = '<path>'; // Replace with your actual IPC path
const ipcProvider = new IpcProvider(ipcPath);

const web3 = new Web3(ipcProvider);

async function main() {
	try {
		console.log('Does the provider support subscriptions?:', ipcProvider.supportsSubscriptions());

		// Get the list of accounts in the connected node which is in this case: geth in dev mode.
		const accounts = await web3.eth.getAccounts();
		console.log('Accounts:', accounts);

		// Send a transaction to the network
		const transactionReceipt = await web3.eth.sendTransaction({
			from: accounts[0],
			to: accounts[0], // sending a self-transaction
			value: web3.utils.toWei('0.001', 'ether'),
		});
		console.log('Transaction Receipt:', transactionReceipt);
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

main();
```

  </TabItem>
</Tabs>

7. replace `<path>` with the `ipcPath` that you had specified, when starting the `geth` node, in the first step.

8. Type `node web3-ipc-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the list of accounts and transaction receipt printed in the console, similar to the following:

```bash
Do the provider supports subscription?: true
Accounts: [ '0x82333ED0FAA7a883297C4d8e0FDE1E1CFABAeB7D' ]
Transaction Receipt: {
  blockHash: '0xd1220a9b6f86083e420da025179593f5aad3732165a687019a89528a4ab2bcd8',
  blockNumber: 1n,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 1000000001n,
  from: '0x82333ed0faa7a883297c4d8e0fde1e1cfabaeb7d',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  to: '0x82333ed0faa7a883297c4d8e0fde1e1cfabaeb7d',
  transactionHash: '0x76c05df78dc5dbfade0d11322b3cadc894c17efe36851856aca29488b47c3fbd',
  transactionIndex: 0n,
  type: 0n
}
```

Keep in mind that using IPC Provider with `geth` in development mode in a production environment is not recommended as it can pose a security risk.

### Third-party Providers (Compliant with EIP 1193)

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

<Tabs groupId="prog-lang" queryString>

<TabItem value="javascript" label="JavaScript" default
attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const bip39 = require('bip39');

const mnemonic = bip39.generateMnemonic(); // generates seed phrase
console.log('seed phrase:', mnemonic);

// Connect to the Ethereum network using an HTTP provider and WalletProvider
const provider = new HDWalletProvider(
	mnemonic,
	'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
);
const web3 = new Web3(provider);

// Get the current block number from the network
web3.eth
	.getBlockNumber()
	.then(function (blockNumber) {
		console.log('Current block number:', blockNumber);
	})
	.catch(function (error) {
		console.log('Error:', error);
	});
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript"
  	attributes={{className: "typescript-tab"}}>

```typescript
import { Web3 } from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import bip39 from 'bip39';

const mnemonic: string = bip39.generateMnemonic(); // generates seed phrase
console.log('seed phrase:', mnemonic);

// Connect to the Ethereum network using an HTTP provider and WalletProvider
const provider: HDWalletProvider = new HDWalletProvider(
	mnemonic,
	'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
);
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

  </TabItem>
</Tabs>

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

### Browser Injected Ethereum Provider

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
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Connecting to the Ethereum network with Web3.js and MetaMask</title>
	</head>
	<body>
		<h1>Connecting to the Ethereum network with Web3.js and MetaMask</h1>
		<pre id="log">
  You need to approve connecting this website to MetaMask.
  Click on the MetaMask icon in the browser extension, if it did not show a popup already.
  </pre
		>

		<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
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

					document.getElementById('log').textContent =
						'Sending a self transaction... Follow the instructions on MetaMask.';

					try {
						// Send a transaction to the network and wait for the transaction to be mined.
						const transactionReceipt = await web3.eth.sendTransaction({
							from: accounts[0],
							to: accounts[0], // sending a self-transaction
							value: web3.utils.toWei('0.001', 'ether'),
						});

						document.getElementById('log').textContent =
							'Sending a self transaction succeeded';
						document.getElementById(
							'log',
						).textContent += `\n  Transaction hash: ${transactionReceipt.transactionHash}`;
						document.getElementById(
							'log',
						).textContent += `\n  Gas Used: ${transactionReceipt.gasUsed} gwei`;
					} catch (error) {
						console.log('error', error);
						document.getElementById('log').textContent =
							'Error happened: ' + JSON.stringify(error, null, '  ');
					}
				} else {
					// If web3 is not available, give instructions to install MetaMask
					document.getElementById('log').innerHTML =
						'Please install MetaMask to connect to the Ethereum network.';
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

### Setting Web3 Provider using a String URL

web3.js allows you to set the Ethereum network provider, easily, by passing a string URL containing either the `http`, `https`, `ws`, or `wss` protocol. This provider can be used to connect to a remote server or node.

And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `wss`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.

To set the Web3 provider from a URL, you can use the following code snippet:

```js
const web3 = new Web3('https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID');
```

Replace `<YOUR_INFURA_PROJECT_ID>` with your own Infura project ID. This code snippet creates a new Web3 instance with Infura's Ropsten network endpoint as the provider.

However, if you do not want to use Infura and want to run your own Ethereum node, you can set the provider to a local node with, for example, the `http` protocol, like this:

```js
const web3 = new Web3('http://localhost:8545');
```

This code snippet sets the provider to a local node running on port 8545.

You can also use the `WebSocket` protocol to connect to a remote Ethereum node that supports it, like this:

```js
const web3 = new Web3('wss://eth-mainnet.alchemyapi.io/v2/<YOUR_API_KEY>');
```

With this code snippet, Web3 will create a WebSocket provider object connection to Alchemy's mainnet endpoint. However, you need to replace `<YOUR_API_KEY>` with your own API Key.

A few points to consider:

-   Make sure the URL you are using is correct, including the protocol and port if necessary.
-   If you are using a remote node, make sure your firewall allows access to the specified port.
-   It is recommended to use encrypted protocols `https` and `wss` when connecting to Ethereum network using a string URL.

## Conclusion

In this tutorial, we explored different types of providers available in web3.js and learned how to set them up and use them in our code. Depending on your application's needs, you can choose the provider that best suits your requirements. The HTTP Provider is the simplest and most widely used provider, while the Websocket Provider and IPC Provider offer real-time communication and faster performance, respectively. With these providers, you can connect your web application to the Ethereum network and start building decentralized applications.
