---
sidebar_position: 3
sidebar_label: 'Using web3-eth package'
---

# Getting Started with `eth` Package

## Introduction

The `web3-eth` package provides a set of powerful functionalities to interact with the Ethereum blockchain and smart contracts. In this tutorial, we will guide you through the basics of using the `web3-eth` package of web3.js version 4. We will be using TypeScript throughout the examples.

## Overview

Here is a high-level overview of the steps we will be taking in this tutorial:

1. Setting up the Environment
2. Create a new project directory and initialize a new Node.js project.
3. Set up web3.js and connect to the Ganache network
4. Interact with the Ethereum blockchain using web3.js.

## Step 1: Setting up the Environment

Before we start writing and deploying our contract, we need to set up our environment. For that, we need to install the following:

1. Ganache - Ganache is a personal blockchain for Ethereum development that allows you to see how your smart contracts function in real-world scenarios. You can download it from http://truffleframework.com/ganache
2. Node.js - Node.js is a JavaScript runtime environment that allows you to run JavaScript on the server-side. You can download it from https://nodejs.org/en/download/
3. npm - Node Package Manager is used to publish and install packages to and from the public npm registry or a private npm registry. Here is how to install it https://docs.npmjs.com/downloading-and-installing-node-js-and-npm. (Alternatively, you can use yarn instead of npm https://classic.yarnpkg.com/lang/en/docs/getting-started/)

## Step 2: Create a new project directory and initialize a new Node.js project

First, create a new project directory for your project and navigate into it:

```
mkdir web3-eth-tutorial
cd web3-eth-tutorial
```

Next, initialize a new Node.js project using npm:

```
npm init -y
```

This will create a new `package.json` file in your project directory.

```
npm install typescript
npm install --save @types/node
```

This will install typescript for our project and install the types for node.

## Step 3: Set up web3.js and connect to the Ganache network

In this step, we will set up the web3.js library and connect to the Ganache network. So, be sure to run Ganache if you did not already did.

First, install the `web3` package using npm:

```
npm install web3@4.0.1-rc.1
```

Note that we are installing the latest version of 4.x, at the time of this tutorial writing. You can check the latest version at https://www.npmjs.com/package/web3?activeTab=versions

Next, create a new file called `index.ts` in your project directory and add the following code to it:

```javascript
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)

// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Log the current block number to the console
web3.eth
	.getBlockNumber()
	.then(result => {
		console.log('Current block number: ' + result);
	})
	.catch(error => {
		console.error(error);
	});
```

This code sets up a connection to the Ganache network and logs the current block number to the console.

Run the following command to test the connection:

```
npx ts-node index.ts
```

If everything is working correctly, you should see the current block number logged to the console. However, if you got an error with the reason `connect ECONNREFUSED 127.0.0.1:7545` then double check that you are running Ganache locally on port `7545`.

## Step 3: Interact with the Ethereum blockchain using web3.js

In this step, we will use web3.js to interact with the Ganache network.

In the first example, we are going to send a simple value transaction.
Create a file named `transaction.ts` and fill it with the following code:

```typescript
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

async function interact() {
	//fetch all the available accounts
	const accounts = await web3.eth.getAccounts();
	console.log(accounts);

	let balance1, balance2;
	//The initial balances of the accounts should be 100 Eth (10^18 wei)
	balance1 = await web3.eth.getBalance(accounts[0]);
	balance2 = await web3.eth.getBalance(accounts[1]);

	console.log(balance1, balance2);

	//create a transaction sending 1 Ether from account 0 to account 1
	const transaction = {
		from: accounts[0],
		to: accounts[1],
		value: web3.utils.toWei('1', 'ether'), // value should be passed in wei. For easier use and to avoid mistakes we utilize the auxiliary `toWei` function.
	};

	//send the actual transaction
	const transactionHash = await web3.eth.sendTransaction(transaction);
	console.log('transactionHash', transactionHash);

	balance1 = await web3.eth.getBalance(accounts[0]);
	balance2 = await web3.eth.getBalance(accounts[1]);

	// see the updated balances
	console.log(balance1, balance2);

	// irrelevant with the actual transaction, just to know the gasPrice
	const gasPrice = await web3.eth.getGasPrice();
	console.log(gasPrice);
}

(async () => {
	await interact();
})();
```

:::note
📝 When running a local development blockchain using Ganache, all accounts are typically unlocked by default, allowing easy access and transaction execution during development and testing. This means that the accounts are accessible without requiring a private key or passphrase. That's why we just indicate the accounts in the examples with the `from` field.
:::

Run the following:

```
npx ts-node transaction.ts
```

If everything is working correctly, you should see something like the following:

```typescript
[
  '0xc68863f36C48ec168AD45A86c96347D520eac1Cf',
  '0x80c05939B307f9833d905A685575b45659d3EA70',
  '0xA260Cf742e03B48ea1A2b76b0d20aaCfe6F85E5E',
  '0xf457b8C0CBE41e2a85b6222A97b7b7bC6Df1C0c0',
  '0x32dF9a0B365b6265Fb21893c551b0766084DDE21',
  '0x8a6A2b8b00C1C8135F1B25DcE54f73Ee18bEF43d',
  '0xAFc526Be4a2656f7E02501bdf660AbbaA8fb3d7A',
  '0xc32618116370fF776Ecd18301c801e146A1746b3',
  '0xDCCD49880dCf9603835B0f522c31Fcf0579b46Ff',
  '0x036006084Cb62b7FAf40B979868c0c03672a59B5'
]
100000000000000000000n 100000000000000000000n

transactionHash {
  transactionHash: '0xf685b64ccf5930d3779a33335ca22195b68901dbdc439f79dfc65d87c7ae88b0',
  transactionIndex: 0n,
  blockHash: '0x5bc044ad949cfd32ea4cbb249f0292e7dded44c3b0f599236c6d20ddaa96cc06',
  blockNumber: 1n,
  from: '0xc68863f36c48ec168ad45a86c96347d520eac1cf',
  to: '0x80c05939b307f9833d905a685575b45659d3ea70',
  gasUsed: 21000n,
  cumulativeGasUsed: 21000n,
  logs: [],
  status: 1n,
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
}

98999580000000000000n 101000000000000000000n

20000000000n

```

:::note
📝 In order to calculate the actual ether spent, we have to calculate the value sent plus the fees. Initial_balance = (Remaining_balance + value + gasUsed\*gasPrice). In our case:

98999580000000000000 + 1000000000000000000 + (20000000000\*21000) = 100 Ether
:::

In the next example, we are going to use `estimateGas` function to see the expected gas for contract deployment. (For more on contracts, please see the corresponding tutotial). Create a file named `estimate.ts` and fill it with the following code:

```typescript
import Web3, { ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } from 'web3';

async function estimate() {
	// abi of our contract
	const abi = [
		{
			inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
		{
			inputs: [],
			name: 'myNumber',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
			name: 'setMyNumber',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
	];

	const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

	//get the available accounts
	const accounts = await web3.eth.getAccounts();
	let acc = await accounts[0];

	let contract = new web3.eth.Contract(abi, undefined);

	const deployment = contract.deploy({
		data: '0x608060405234801561001057600080fd5b506040516101d93803806101d983398181016040528101906100329190610054565b806000819055505061009e565b60008151905061004e81610087565b92915050565b60006020828403121561006657600080fd5b60006100748482850161003f565b91505092915050565b6000819050919050565b6100908161007d565b811461009b57600080fd5b50565b61012c806100ad6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806323fd0e401460375780636ffd773c146051575b600080fd5b603d6069565b6040516048919060bf565b60405180910390f35b6067600480360381019060639190608c565b606f565b005b60005481565b8060008190555050565b60008135905060868160e2565b92915050565b600060208284031215609d57600080fd5b600060a9848285016079565b91505092915050565b60b98160d8565b82525050565b600060208201905060d2600083018460b2565b92915050565b6000819050919050565b60e98160d8565b811460f357600080fd5b5056fea2646970667358221220d28cf161457f7936995800eb9896635a02a559a0561bff6a09a40bfb81cd056564736f6c63430008000033',
		// @ts-expect-error
		arguments: [1],
	});
	estimatedGas = await deployment.estimateGas(
		{
			from: acc,
		},
		DEFAULT_RETURN_FORMAT, // the returned data will be formatted as a bigint
	);

	console.log(estimatedGas);

	let estimatedGas = await deployment.estimateGas(
		{
			from: acc,
		},
		ETH_DATA_FORMAT, // the returned data will be formatted as a hexstring
	);

	console.log(estimatedGas);
}

(async () => {
	await estimate();
})();
```

Run the following:

```
npx ts-node estimate.ts
```

If everything is working correctly, you should see something like the following:

```typescript
0x22568;
```

:::note
📝 Note that numbers returned from web3.js are returned by default in the `BigInt` format. In this example we used `ETH_DATA_FORMAT` parameter, which, can be passed in most methods in web3.js in order to format the result in `hex`.
:::

In the next example we are going to sign a transaction and use `sendSignedTransaction` to send the signed transaction. Create a file named `sendSigned.ts` and fill it with the following code:

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

//make sure to copy the private key from ganache
const privateKey = '0x0fed6f64e01bc9fac9587b6e7245fd9d056c3c004ad546a17d3d029977f0930a';
const value = web3.utils.toWei('1', 'ether');

async function sendSigned() {
	const accounts = await web3.eth.getAccounts();
	const fromAddress = accounts[0];
	const toAddress = accounts[1];
	// Create a new transaction object
	const tx = {
		from: fromAddress,
		to: toAddress,
		value: value,
		gas: 21000,
		gasPrice: web3.utils.toWei('10', 'gwei'),
		nonce: await web3.eth.getTransactionCount(fromAddress),
	};

	// Sign the transaction with the private key
	const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

	// Send the signed transaction to the network
	const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

	console.log('Transaction receipt:', receipt);
}
(async () => {
	await sendSigned();
})();
```

Run the following:

```
npx ts-node sendSigned.ts
```

If everything is working correctly, you should see something like the following:

```ts
Transaction receipt: {
  transactionHash: '0x742df8f1ad4d04f6e5632889109506dbb7cdc8a6a1c80af3dfdfc71a67a04ddc',
  transactionIndex: 0n,
  blockNumber: 1n,
  blockHash: '0xab6678d76499b0ee383f182ab8f848ba27bd787e70e227524255c86b25224ed3',
  from: '0x66ce32a5200aac57b258c4eac26bc1493fefddea',
  to: '0x0afcfc43ac454348d8170c77b1f912b518b4ebe8',
  cumulativeGasUsed: 21000n,
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  effectiveGasPrice: 10000000000n,
  type: 2n
}
```

## Conclusion

In this tutorial, we learned how to use different methods provied by the `web3-eth` package.

With this knowledge, you can start experimenting with the Ethereum blockchain. Keep in mind that this is just the beginning, and there is a lot more to learn about Ethereum and web3.js. So keep exploring and building, and have fun!

## Additional Resources

-   [Official web3.js Documentation](https://docs.web3js.org/)
-   [Solidity Documentation](https://solidity.readthedocs.io/)
-   [Ganache](https://www.trufflesuite.com/ganache)
-   [Truffle](https://trufflesuite.com/)
-   [Remix IDE](https://remix.ethereum.org/)

## Tips and Best Practices

-   Always test your smart contracts on a local network like Ganache before deploying them to the mainnet.
-   Use the latest version of web3.js and Solidity to take advantage of the latest features and security patches.
-   Keep your private keys secure and never share them with anyone.
-   Use the gas limit and gas price parameters carefully to avoid spending too much on transaction fees.
-   Use the `estimateGas` function in web3.js to estimate the gas required for a transaction before sending it to the network.
-   Use events to notify the client application about state changes in the smart contract.
-   Use a linter like Solhint to check for common Solidity coding errors.

## Final Thoughts

Web3.js version 4.x provides a powerful and easy-to-use interface for interacting with the Ethereum network and building decentralized applications. And it has been rewritten in TypeScript but for simplicity of this tutorial we interacted with it in JavaScript.

The Ethereum ecosystem is constantly evolving, and there is always more to learn and discover. As you continue to develop your skills and knowledge, keep exploring and experimenting with new technologies and tools to build innovative and decentralized solutions.
