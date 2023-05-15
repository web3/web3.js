---
sidebar_position: 2
sidebar_label: Providers
---

## Introduction

Web3.js providers are objects responsible for enabling connection with the Ethereum network in numerous ways. Connecting your web application to an Ethereum node is necessary for sending transactions, querying data, and interacting with smart contracts on the network. In this tutorial, we'll explore the different types of providers available in Web3.js version 4, how to set them up, and how to use them in your code.

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and Ethereum. And we need to set up our environment. For that, we need to install the following:

1. Ganache - Ganache is a personal blockchain for Ethereum development that allows you to see how your smart contracts function in real-world scenarios. You can download it from [http://truffleframework.com/ganache](http://truffleframework.com/ganache)
2. Node.js - Node.js is a JavaScript runtime environment that allows you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
3. NPM - Node Package Manager is used to publish and install packages to and from the public npm registry or a private npm registry. Here is how to install it [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) Alternatively, you can use yarn instead of npm [https://classic.yarnpkg.com/lang/en/docs/getting-started/](https://classic.yarnpkg.com/lang/en/docs/getting-started/)

## Types of Providers

Web3.js supports several types of providers, each with its own unique features or that can be used in certain cases. Here are the main types:

1. Browser Injected Ethereum Provider
2. HTTP Provider
3. WebSocket Provider
4. IPC Provider (for Node.js)
5. Providers from third parties (Compliant with EIP 1193)

### Browser Injected Ethereum Provider

Connecting to the Ethereum network with Web3.js and MetaMask, or another similar extensions or Ethereum enabled browser, is easy. MetaMask is a browser extension that injects a Web3 object into the browser's JavaScript context, so you can interact with the Ethereum network directly from your web application.

Actually, the browser injected Ethereum provider is intended to use `window.ethereum` when it is injected by the MetaMask browser extension or another Ethereum enabled browser. However, before using this provider, we need to detect if the user has MetaMask installed and call `enable()` to request access to the user's MetaMask account. In this provider, we can make both read-only and write transactions.

Follow these steps to connect to the Ethereum network with MetaMask and Web3.js. They also includes the steps to create a local web server using Node.js:

1. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.
2. Install MetaMask extension for your browser. You can download MetaMask from their website: https://metamask.io/.
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
			You need to approve connecting this website to MetaMask. Click on MetaMask icon in the
			browser extension if it did not already show a popup.
		</div>

		<script src="https://cdn.jsdelivr.net/npm/web3@4.0.1-rc.1/dist/web3.min.js"></script>
		<script>
			window.addEventListener('load', function () {
				// Check if web3 is available
				if (typeof window.ethereum !== 'undefined') {
					// Use the browser injected Ethereum provider
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
					// If web3 is not available, give instructions to install MetaMask
					document.getElementById('log').innerHTML =
						'Please install MetaMask to connect with the Ethereum network.';
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

11. Save the file.
12. Open your command prompt window and navigate to the directory where `server.js` is located.
13. Type `node server.js` and press Enter. This will start the server on port 8000.
14. Open your web browser and navigate to `http://localhost:8000/`. MetaMask should ask your approval to connect to your website, follow the steps give your concent.
15. If everything is set up properly, you should be able to connect to the Ethereum network with MetaMask and see the logged account address.

This code will create a local web server using Node.js and Express, and serve your HTML file from the root directory of your project. You can customize the port number and the root directory if needed.

Now you can start building your Ethereum application with Web3.js and MetaMask!

## HTTP Provider

HTTP Provider is a way to connect with a publicly available Ethereum node, making it easy and straightforward to communicate with the Ethereum network from your web application. This provider is ideal for hosting tokens and dApps because it is read-only, so you can't make any write transactions to the network with it.

Follow these steps to connect to the Ethereum network using HTTP provider:

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

4. Create a new JavaScript file called `web3-http-provider.js` in your code editor.

5. Copy and paste the following code into your `web3-http-provider.js` file and save it:

```js
const { Web3 } = require('web3');

// Connect to the Ethereum network using HTTP provider
const ganacheUrl = 'http://localhost:7545';
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
const web3 = new Web3(httpProvider);

async function main() {
	try {
		// Get the current block number from the network
		const currentBlockNumber = await web3.eth.getBlockNumber();
		console.log('Current block number:', currentBlockNumber);

		// Get the list of accounts in the connected node which is in this case: Ganache.
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
		console.error(error);
	}
}

main();
```

6. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.

7. In the command prompt or terminal window, type `node web3-http-provider.js` and press Enter. This will run your JavaScript file and connect to the Ethereum network using the HTTP provider and Ganache.

If everything is set up properly, you should see the current block number, a transaction hash, transaction receipt, and the updated block number printed in the console.

This example demonstrates how to connect to the Ethereum network using HTTP provider, get the current block number, send a transaction, and get the updated block number.

## WebSocket Provider

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

    // Connect to the Ethereum network using WebSocket provider
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
    		console.error(error);
    	}
    }

    main();
    ```

6. Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.

7. Type `node web3-websocket-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the new block headers, transaction hash, and pending transaction printed in the console. The unique feature of WebSocket provider highlighted in this example is that it can subscribe to new block headers and pending transactions in real-time.

## IPC Provider (for Node.js)

IPC Provider allows us to interact with the Ethereum network via Inter-Process Communication (IPC), which is useful for Node.js applications that require direct access to local Ethereum node. This provider is ideal for development and testing on a local machine. And it is the most secure way of communicating with a node. However, it requires that the application and the node are on the same machine.

Follow these steps to connect to the Ethereum network using IPC provider:

:::tip
The first 3 steps are the same as in the previous section. So, you may skip them if you already executed the previous section.
:::

1. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
2. Create a new folder and navigate to it:

    ```sh
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

3. Install Web3.js using npm:

    ```sh
    npm install web3
    ```

4. Setup `geth` client:

To connect to Ethereum network using IPC Provider through `geth` in development mode, you will need to run `geth` with the `--dev --ipcpath <path>` command line arguments, as follow:

Start a `geth` node in development mode by opening a terminal window and navigating to the `geth` executable file. Then, run the following command to create a development chain:

```sh
geth --dev --ipcpath <path>
```

Make sure to replace `<path>` with the desired IPC path. For example:

```sh
geth --dev --ipcpath /Users/username/Library/Ethereum/geth.ipc
```

This will start a `geth` node in development mode with IPC enabled and an IPC path specified. If the command is successful, the `geth` node will be running, and you should see output similar to the following:

```sh
INFO [12-10|15:10:37.121] IPC endpoint opened              url=<path>
INFO [12-10|15:10:37.122] HTTP endpoint opened             url=http://localhost:8545
INFO [12-10|15:10:37.122] WebSocket endpoint opened        url=ws://localhost:8546
INFO [12-10|15:10:37.127] Mapped network port              proto=udp extport=0 intport=30303 interface=UPnP(UDP)
```

5. Create a new JavaScript file called `web3-ipc-provider.js` in your code editor.
6. Copy and paste the following code into your `web3-ipc-provider.js` file and save it:

    ```js
    const { Web3 } = require('web3');

    // Connect to the Ethereum network using IPC Provider
    const ipcPath = '\\\\.\\pipe\\geth.ipc';
    const ipcProvider = new Web3.providers.IpcProvider(ipcPath);
    const web3 = new Web3(ipcProvider);

    async function main() {
    	try {
    		console.log(
    			'Do the provider supports subscription?:',
    			ipcProvider.supportsSubscriptions(),
    		);

    		// Subscribe to new block headers
    		const subscription1 = await web3.eth.subscribe('newBlockHeaders', (error, result) => {
    			if (!error) {
    				console.log('New block header:', result);
    			} else {
    				console.log(error);
    			}
    		});

    		// Subscribe to new pending transactions
    		const subscription2 = await web3.eth.subscribe(
    			'pendingTransactions',
    			(error, result) => {
    				if (!error) {
    					console.log('New pending transaction:', result);
    				} else {
    					console.log(error);
    				}
    			},
    		);

    		// Send a transaction to the network
    		const transactionReceipt = await web3.eth.sendTransaction({
    			from: accounts[0],
    			to: accounts[1],
    			value: web3.utils.toWei('0.001', 'ether'),
    		});
    		console.log('Transaction Receipt:', transactionReceipt);

    		// Wait for 2 seconds, then stop the subscriptions
    		setTimeout(() => {
    			subscription1.unsubscribe();
    			subscription2.unsubscribe();
    		}, 2000);
    	} catch (error) {
    		console.error(error);
    	}
    }

    main();
    ```

7. Type `node web3-ipc-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

This code connects to the Ethereum network using IPC Provider and subscribes to new block headers and pending transactions. It then sends a transaction. And it logs the results to the console. Note that this is a Node.js specific code and will only work in the Node.js environment and not in client-side javascript or web browsers.

So, if everything is set up properly, you should see the transaction receipt and a the new head printed in the console.

IPC provider is a websocket alternative when web3 needs to communicate with the Ethereum nodes over `Inter-process Communication`. The IPC providers, similar to WebSocket providers, support subscriptions, which means we can subscribe to contract events and receive real-time updates.

Keep in mind that using IPC Provider with `geth` in development mode in a production environment is not recommended as it can pose a security risk.

**IPC Provider (for Node.js)**

IPC Provider allows us to interact with the Ethereum network via Inter-Process Communication (IPC), which is useful for Node.js applications that require direct access to local Ethereum node. This provider is ideal for development and testing on a local machine.

To connect to Ethereum network using IPC Provider through `geth` in development mode, you will need to run `geth` with the `--dev --ipcpath <path>` command line arguments:

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
INFO [12-10|15:10:37.121] IPC endpoint opened              url=<path>
INFO [12-10|15:10:37.122] HTTP endpoint opened             url=http://localhost:8545
INFO [12-10|15:10:37.122] WebSocket endpoint opened        url=ws://localhost:8546
INFO [12-10|15:10:37.127] Mapped network port              proto=udp extport=0 intport=30303 interface=UPnP(UDP)
```

2. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
3. Create a new folder and navigate to it:

    ```sh
    mkdir web3-providers-tutorial
    cd web3-providers-tutorial
    ```

4. Install Web3.js using npm:

    ```sh
    npm install web3
    ```

5. Create a new JavaScript file called `web3-ipc-provider.js` in your code editor.
6. Copy and paste the following code into your `web3-ipc-provider.js` file and save it:

    ```js
    const { Web3 } = require('web3');

    // Connect to the Ethereum network using IPC provider
    const ipcPath = '<path>';
    const ipcProvider = new Web3.providers.IpcProvider(ipcPath);
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
    		console.error(error);
    	}
    }

    main();
    ```

    **Note**: replace `<path>` with the `ipcPath` specified when starting the `geth` node.

7. Type `node web3-ipc-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the list of accounts and transaction receipt printed in the console.

Keep in mind that using IPC Provider with `geth` in development mode in a production environment is not recommended as it can pose a security risk.

### Providers from third parties (Compliant with EIP 1193)

web3.js accepts any provider that is in compliance with [EIP-1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md). Actually, the section Browser Injected Ethereum Provider was about using a special case of those third party providers. And web3.js has been tested with @truffle/hdwallet-provider, Ganache provider, Hardhat provider, and Incubed (IN3) as a provider.

Here's a step-by-step example and a code snippet to connect your web application to the Ethereum network using `@truffle/hdwallet-provider` as an example of an external provider that is compliant with EIP 1193.

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

// Connect to the Ethereum network using an HTTP provider and WalletProvider
const provider = new HDWalletProvider(
	'seed phrase',
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

6. You need to replace `'YOUR_INFURA_PROJECT_ID'` with your own Infura project ID. You can get an Infura project ID by signing up for a free account at https://infura.io/register. However, you can put also any other url that is compatible with HDWalletProvider, like using a local Ganache that is accessible with `'http://localhost:7545'`

7. In the command prompt, write `node index.js` and press Enter. This will run your JavaScript file and connect to the Ethereum network using the HDWalletProvider with Infura.

If everything is set up properly, you should see the current block number printed in the console.

This code will connect your web application to the Ethereum network using infura. And you modify it to interact with the network, perform transactions, and read/write data from the Ethereum network.

## Setting Web3 Provider using String URL

Web3.js allows you to set the Ethereum network provider by passing a string URL containing either `http`, `https`, `ws`, or `wss` protocol. This provider can be used to connect to a remote server or node.

And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `ws`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.

To set the Web3 provider from a url, you can use the following code snippet:

```js
const web3 = new Web3('https://ropsten.infura.io/v3/<YOUR_INFURA_PROJECT_ID>');
```

Replace `<YOUR_INFURA_PROJECT_ID>` with your own Infura project ID. This code snippet creates a new Web3 instance with Infura's Ropsten network endpoint as the provider.

However, if you do not want to use Infura and want to run your own Ethereum node, you can set the provider to a local node with `http` protocol, like this:

```js
const web3 = new Web3('http://localhost:8545');
```

This code snippet sets the provider to a local node running on port 8545.

You can also use the `WebSocket` protocol to connect to a remote Ethereum node that supports it, like this:

```js
const web3 = new Web3('wss://eth-mainnet.alchemyapi.io/v2/<YOUR_API_KEY>');
```

With this code snippet, Web3 creates a WebSocket provider connection to Alchemy's mainnet endpoint. And you need to replace `<YOUR_API_KEY>` with your own API Key.

Few points to consider:

-   Make sure the URL you are using is correct, including the protocol and port if necessary.
-   If you are using a remote node, make sure your firewall allows access to the specified port.
-   It is recommended to use encrypted protocols `https` and `wss` when connecting to Ethereum network by string URL.

Using a string URL to set the Web3 provider is an easy way to connect to a remote Ethereum node for interacting with the Ethereum network or you can connect to your own node running on your local machine. The method is useful for those who do not have direct access to a node through IPC or RPC provider, and you can choose the protocol you want to use based on your specific use case.

## Conclusion

In this tutorial, we've covered the different types of providers available in Web3.js, how to set them up, and how to use them in your code. Depending on your application's needs, you can choose the provider that best suits your requirements. The HTTP Provider is the simplest and most widely used provider, while the Websocket Provider and IPC Provider offer real-time communication and faster performance, respectively. With these providers, you can connect your web application to the Ethereum network and start building decentralized applications.

To get more about providers like more about their priorities and options, check the [web3.js Providers Guide](/docs/guides/web3_providers_guide/) and [Providers Events Listening Guide](/docs/guides/web3_providers_guide/events_listening)
