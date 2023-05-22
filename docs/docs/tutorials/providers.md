---
sidebar_position: 2
sidebar_label: Providers
---

# Providers

## Introduction

Web3.js providers are objects responsible for enabling connectivity with the Ethereum network in various ways. Connecting your web application to an Ethereum node is necessary for sending transactions, querying data, and interacting with smart contracts on the network. In this tutorial, we will explore the different types of providers available in Web3.js version 4, how to set them up, and how to use them in your code.

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and Ethereum. Additionally, we need to set up our environment by installing the following:

1. **Ganache**

    Ganache is a personal blockchain for Ethereum development that allows you to test how your smart contracts function in real-world scenarios. You can download it from [http://truffleframework.com/ganache](http://truffleframework.com/ganache).

2. **Node.js**

    Node.js is a JavaScript runtime environment that enables you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

3. **npm**

    npm (Node Package Manager) is used to publish and install packages to and from the public npm registry or a private npm registry. You can install it by following the instructions here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

    Alternatively, you can use **yarn** instead of **npm** by following the instructions here: [https://classic.yarnpkg.com/lang/en/docs/getting-started/](https://classic.yarnpkg.com/lang/en/docs/getting-started/).

## Types of Providers

Web3.js supports several types of providers, each with its own unique features or specific use cases. Here are the main types:

1. [HTTP Provider](#http-provider)
2. [WebSocket Provider](#websocket-provider)
3. [IPC Provider (for Node.js)](#websocket-provider)
4. [Third-party Providers (Compliant with EIP 1193)](#third-party-providers-compliant-with-eip-1193)

### HTTP Provider

The HTTP Provider allows you to connect to a publicly available Ethereum node, making it easy and straightforward to communicate with the Ethereum network from your web application.

To connect to the Ethereum network using the HTTP provider, follow these steps:

1. Open a command prompt or terminal window and navigate to the directory where you want to create the folder for this example.
2. Create a new folder and navigate to it:

    ```sh
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

3. Install Web3.js using npm:

    ```sh
    npm install web3@4.0.1-rc.1
    ```

4. Create a new JavaScript file called `web3-http-provider.js` in your code editor.

5. Copy and paste the following code into your `web3-http-provider.js` file and save it:

    ```js
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

6. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.

7. In the command prompt or terminal window, type `node web3-http-provider.js` and press Enter. This will run your JavaScript file and connect to the Ethereum network using the HTTP provider and Ganache.

If everything is set up properly, you should see the current block number, a transaction hash, transaction receipt, and the updated block number printed in the console.

This example showed how to connect to the Ethereum network using HTTP provider, get the current block number, send a transaction, and get the updated block number.

### WebSocket Provider

WebSocket Provider allows us to communicate with the Ethereum node via WebSocket protocol, which is useful when we want continuous updates on our subscribed items. This provider is ideal for real-time applications that require constant updates from the Ethereum network.

Follow these steps to connect to the Ethereum network using WebSocket provider:

:::tip
The first 3 steps are the same as in the pervious section. So, you may skip them if you already executed the previous section.
:::

1. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
2. Create a new folder and navigate to it:

    ```sh
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

3. Install Web3.js using npm:

    ```sh
     npm install web3@4.0.1-rc.1
    ```

4. Create a new JavaScript file called `web3-websocket-provider.js` in your code editor.

5. Copy and paste the following code into your `web3-websocket-provider.js` file and save it:

    ```js
    const { Web3 } = require('web3');

    // Connect to the Ethereum network using the WebSocket provider
    const ganacheUrl = 'ws://localhost:7545';
    const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl);
    const web3 = new Web3(wsProvider);

    async function main() {
    	try {
    		console.log(
    			'Do the provider supports subscription?:',
    			wsProvider.supportsSubscriptions(),
    		);

    		// Subscribe to new block headers
    		const subscription = await web3.eth.subscribe('newBlockHeaders', (error, result) => {
    			if (!error) {
    				console.log('New block header:', result);
    			} else {
    				console.log(error);
    			}
    		});

    		// Wait for 2 seconds, then stop the subscription
    		setTimeout(() => {
    			subscription.unsubscribe((error, success) => {
    				if (success) {
    					console.log('Unsubscribed from new block headers');
    				}
    				if (error) {
    					console.log(error);
    				}
    				wsProvider.disconnect();
    			});
    		}, 2000);

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
    		console.error('An error occurred:', error);
    	}
    }

    main();
    ```

6. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.

7. Type `node web3-websocket-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the new block headers, transaction hash, and pending transaction printed in the console. The unique feature of WebSocket provider highlighted in this example is that it can subscribe to new block headers and pending transactions in real-time.

### IPC Provider (for Node.js)

The IPC Provider allows you to connect to an Ethereum node using Inter-Process Communication (IPC) in a Node.js environment. This provider is useful when you have a local Ethereum node running on your machine and want to interact with it using Node.js.

In the following steps you will run `geth` in development mode and you will run a code that reads geth accounts and send a transaction:

To connect to the Ethereum network using the IPC provider, follow these steps:

1. Start a `geth` node in development mode by opening a terminal window and navigating to the `geth` executable file. Then, run the following command to create a development chain:

```sh
geth --dev --ipcpath <path>
```

Make sure to replace `<path>` with the desired IPC path. For example:

```sh
geth --dev --ipcpath /Users/username/Library/Ethereum/geth.ipc
```

This will start a `geth` node in development mode with IPC enabled and an IPC path specified. If the command is successful, the `geth` node will be running, and you should see output similar to the following:

```sh
INFO [12-10|15:10:37.121] IPC endpoint opened			  	url=<path>
INFO [12-10|15:10:37.122] HTTP endpoint opened			 	url=http://localhost:8545
INFO [12-10|15:10:37.122] WebSocket endpoint opened			url=ws://localhost:8546
INFO [12-10|15:10:37.127] Mapped network port			  	proto=udp extport=0 intport=30303 interface=UPnP(UDP)
```

2. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
3. Create a new folder and navigate to it:

    ```sh
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

4. Install Web3.js using npm:

    ```sh
    npm install web3@4.0.1-rc.1
    ```

5. Create a new JavaScript file called `web3-ipc-provider.js` in your code editor.

6. Copy and paste the following code into your `web3-ipc-provider.js` file and save it:

    ```js
    const { Web3 } = require('web3');
    const { IpcProvider } = require('web3-providers-ipc');

    // Connect to the Ethereum network using IPC provider
    const ipcPath = '<path>'; // Replace with your actual IPC path
    const ipcProvider = new IpcProvider(ipcPath);

    const web3 = new Web3(ipcProvider);

    async function main() {
    	try {
    		console.log(
    			'Do the provider supports subscription?:',
    			ipcProvider.supportsSubscriptions(),
    		);

    		// Get the list of accounts in the connected node which is in this case: geth in dev mode.
    		const accounts = await web3.eth.getAccounts();
    		console.log('Accounts:', accounts);

    		// Send a transaction to the network
    		const transactionReceipt = await web3.eth.sendTransaction({
    			from: accounts[0],
    			to: accounts[1],
    			value: web3.utils.toWei('0.001', 'ether'),
    		});
    		console.log('Transaction Receipt:', transactionReceipt);
    	} catch (error) {
    		console.error('An error occurred:', error);
    	}
    }

    main();
    ```

7. replace `<path>` with the `ipcPath` that you had specified, when starting the `geth` node, in the first step.

    **Note**: replace `<path>` with the `ipcPath` specified when starting the `geth` node.

8. Type `node web3-ipc-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the list of accounts and transaction receipt printed in the console.

Keep in mind that using IPC Provider with `geth` in development mode in a production environment is not recommended as it can pose a security risk.

### Third-party Providers (Compliant with EIP 1193)

web3.js accepts any provider that is in compliance with [EIP-1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md). It has tests written to ensure compatibility with @truffle/hdwallet-provider, Ganache provider, Hardhat provider, and Incubed (IN3) as a provider. The following section, [Browser Injected Ethereum Provider](#browser-injected-ethereum-provider), in this tutorial explains how to use a special case of these third-party providers.

Here is a step-by-step example and a code snippet to connect your web application to the Ethereum network using `@truffle/hdwallet-provider` as an example of an external provider compliant with EIP 1193.

1. Open a command prompt or terminal window in a new folder.
2. Type `npm init -y` and press Enter. This will create a `package.json` file in the current directory.
3. Install Web3.js and HTTP provider using npm:

    ```sh
    npm install web3@4.0.1-rc.1 @truffle/hdwallet-provider bip39
    ```

4. Create a new JavaScript file, called `index.js`, in your code editor.
5. Copy and paste the following code into your JavaScript file, and then save the file:

    ```js
    const { Web3 } = require('web3');
    const HDWalletProvider = require('@truffle/hdwallet-provider');
    const bip39 = require('bip39');

    const mnemonic = bip39.generateMnemonic(); //generates seed phrase
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

6. Replace `'YOUR_INFURA_PROJECT_ID'` with your own Infura project ID. You can obtain an Infura project ID by signing up for a free account at https://infura.io/register. Alternatively, you can use any other URL that is compatible with HDWalletProvider, such as a local Ganache accessible at `'http://localhost:7545'`.

7. In the command prompt, run `node index.js` and press Enter. This will execute your JavaScript file and connect to the Ethereum network using HDWalletProvider with Infura.

If everything is set up properly, you should see the current block number printed in the console.

This code will connect your web application to the Ethereum network using truffle HD Wallet-enabled Web3 provider. You can modify it to interact with the network, perform transactions, and read/write data from the Ethereum network.

## Practical ways of connecting to a provider

1. Browser Injected Ethereum Provider
2. Setting Web3 Provider using a string URL

### Browser Injected Ethereum Provider

It is easy to connect to the Ethereum network using an Ethereum browser extension such as MetaMask, or an Ethereum-enabled browser like the browser inside TrustWallet. Because they inject their provider object into the browser's JavaScript context, enabling direct interaction with the Ethereum network from your web application. Moreover, the wallet management is conveniently handled by these extensions or browsers, making it the standard approach for DApp developers to facilitate user interactions with the Ethereum network.

Technically, you use `window.ethereum` when it is injected by the Ethereum browser extension or the Ethereum-enabled browser. However, before using this provider, you need to check if it is available and then call `enable()` to request access to the user's MetaMask account.

Follow these steps to connect to the Ethereum network with MetaMask and Web3.js, including the steps to create a local web server using Node.js:

1. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.
2. Install the MetaMask extension for your browser. You can download MetaMask from their website: https://metamask.io/.
3. Create a new HTML file in your code editor.
4. Copy and paste the following code into your HTML file:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    	<head>
    		<meta charset="UTF-8" />
    		<title>Connecting to the Ethereum network with Web3.js and MetaMask</title>
    	</head>
    	<body>
    		<h1>Connecting to the Ethereum network with Web3.js and MetaMask</h1>
    		<div id="log">
    			You need to approve connecting this website to MetaMask. Click on the MetaMask icon
    			in the browser extension, if it did not show a popup already.
    		</div>

    		<script src="https://cdn.jsdelivr.net/npm/web3@4.0.1-rc.1/dist/web3.min.js"></script>
    		<script>
    			window.addEventListener('load', function () {
    				// Check if web3 is available
    				if (typeof window.ethereum !== 'undefined') {
    					// Use the browser-injected Ethereum provider
    					web3 = new Web3(window.ethereum);
    					// Request access to the user's MetaMask account
    					window.ethereum.enable();
    					// Get the user's accounts
    					web3.eth.getAccounts().then(function (accounts) {
    						// Show the first account
    						document.getElementById('log').innerHTML =
    							'Connected with MetaMask account: ' + accounts[0];
    					});
    				} else {
    					// If web3 is not available, provide instructions to install MetaMask
    					document.getElementById('log').innerHTML =
    						'Please install MetaMask to connect to the Ethereum network.';
    				}
    			});
    		</script>
    	</body>
    </html>
    ```

    5. Save the file as `index.html`.
    6. Open a terminal or command prompt window.
    7. Navigate to the directory where your HTML file is located.
    8. Type `npm init -y` and press Enter. This will create a `package.json` file in the current directory.
    9. Type `npm install --save express` and press Enter. This will install the Express module and add it to your project's dependencies.
    10. Create a new file called `server.js` in the same directory as your HTML file.
    11. Copy and paste the following code into `server.js`:

    ```js
    const express = require('express');
    const app = express();
    const path = require('path');

    app.use(express.static(path.join(__dirname, '.')));

    app.listen(8000, () => {
    	console.log('Server started on port 8000');
    });
    ```

5. Save the file.
6. Open your command prompt window and navigate to the directory where `server.js` is located.
7. Type `node server.js` and press Enter. This will start the server on port 8000.
8. Open your web browser and navigate to `http://localhost:8000/`. MetaMask should ask for your approval to connect to your website. Follow the steps and give your consent.
9. If everything is set up properly, you should be able to connect to the Ethereum network with MetaMask and see the logged account address.

This code will create a local web server using Node.js and Express, serving your HTML file from the root directory of your project. You can customize the port number and the root directory if needed.

Now you can start building your Ethereum application with Web3.js and MetaMask!

## Setting Web3 Provider using a String URL

Web3.js allows you to set the Ethereum network provider, easily, by passing a string URL containing either the `http`, `https`, `ws`, or `wss` protocol. This provider can be used to connect to a remote server or node.

And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `wss`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.

To set the Web3 provider from a URL, you can use the following code snippet:

```js
const web3 = new Web3('https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID');
```

Replace `<YOUR_INFURA_PROJECT_ID>` with your own Infura project ID. This code snippet creates a new Web3 instance with Infura's Ropsten network endpoint as the provider.

However, if you do not want to use Infura and want to run your own Ethereum node, you can set the provider to a local node with the `http` protocol, like this:

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

In this tutorial, we explored different types of providers available in Web3.js and learned how to set them up and use them in our code. Depending on your application's needs, you can choose the provider that best suits your requirements. The HTTP Provider is the simplest and most widely used provider, while the Websocket Provider and IPC Provider offer real-time communication and faster performance, respectively. With these providers, you can connect your web application to the Ethereum network and start building decentralized applications.

To get more about providers like more about their priorities and options, check the [web3.js Providers Guide](/docs/guides/web3_providers_guide/) and [Providers Events Listening Guide](/docs/guides/web3_providers_guide/events_listening)
