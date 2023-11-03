---
sidebar_position: 2
sidebar_label: 'Eth Package Usage Example'
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
npm i typescript @types/node
```

This will install typescript for our project and install the types for node.

## Step 3: Set up web3.js and connect to the Ganache network

In this step, we will set up the web3.js library and connect to the Ganache network. So, be sure to run Ganache if you did not already did.

First, install the `web3` package using npm:

```
npm i web3
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

## Importing specific package
To utilize functions from the web3-eth package, you have the option to import this package directly instead of relying on the global `web3` package.

For example [getBalance](/api/web3-eth/function/getBalance) method:

```typescript
import Web3Eth from 'web3-eth';

const eth = new Web3Eth('http://localhost:7545');

async function test() {
    const accounts = await eth.getAccounts();
    const currentBalance = await eth.getBalance(accounts[0]);
    console.log('Current balance:', currentBalance); // 115792089237316195423570985008687907853269984665640564039437613106102441895127n
}

(async () => {
    await test();
})();

```

## Package methods

### createAccessList

Creating an access list in Ethereum is typically associated with Ethereum Improvement Proposal (EIP)-2930, which introduces a way to specify which accounts and storage keys a transaction expects to access. Access lists are used to optimize gas costs for transactions by providing explicit information about what the transaction needs to access.

The [createAccessList](/api/web3-eth/function/createAccessList) method is used to create an access list.

The [createAccessList](/api/web3-eth/function/createAccessList) function typically takes the following parameters:

- transaction ([TransactionForAccessList](/api/web3/namespace/types/#TransactionForAccessList)) - Transaction object
- blockNumber ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - Specifies what block to use as the current state of the blockchain while processing the transaction.
- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

This method returns a Promise that resolves to an object which includes accessList object.

```typescript
import Web3 from 'web3';

const web3 = new Web3('http://localhost:7545');

async function test() {
    const transaction = {
        from: '0x2d085f612100e857c415ea6b4279aea20ed16155',
        to: '0xb82b0eff62906b20e3cec4436ed6f4b672b6e8b5',
        data: '0xcfae3217'
    };
    const result = await web3.eth.createAccessList(transaction, 'latest');
    console.log('Result:', result);
    // Result: {
    //   accessList: [
    //      {
    //        address: '0xb82b0eff62906b20e3cec4436ed6f4b672b6e8b5',
    //        storageKeys: [
    //          '0x0000000000000000000000000000000000000000000000000000000000000000'
    //        ]
    //      }
    //   ],
    //   gasUsed: '0x68c5'
    // }
}
(async () => {
    await test();
})();
```

### estimateGas

The [estimateGas](/api/web3-eth/function/estimateGas) function is used to estimate the amount of gas that will be consumed when executing a specific transaction or invoking a contract function. This can be very useful when you want to determine the potential cost of a transaction or function call before actually sending it to the Ethereum network. It helps users ensure that they have enough ether to cover the gas costs for the operation.

The [estimateGas](/api/web3-eth/function/estimateGas) function typically takes the following parameters:

- transaction ([Transaction](/api/web3/namespace/types#Transaction)) - An object that describes the transaction or contract function call you want to estimate gas for. This object includes fields like from, to, data, gas, value, etc., depending on the type of operation you are estimating gas for.
- blockNumber ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - Number of block or tag

The function returns a Promise that resolves to the estimated gas cost for the given operation.


```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

const value = web3.utils.toWei('1', 'ether');

async function test() {
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];
    const toAddress = accounts[1];
    // Create a new transaction object
    const tx = {
        from: fromAddress,
        to: toAddress,
        value: value,
    };

    const estimatedGas = await web3.eth.estimateGas(tx);

    console.log('Estimated gas:', estimatedGas); // 21000n
}
(async () => {
    await test();
})();
```

### getBalance

The [getBalance](/api/web3-eth/function/getBalance) function is used to retrieve the balance of an Ethereum address, which represents the amount of Ether (ETH) associated with that address. It's a fundamental and frequently used function when working with Ethereum applications.

The [getBalance](/api/web3-eth/function/getBalance) function typically takes two parameters:

- address ([Address](/api/web3/namespace/types#Address)) - the address for which you want to check the balance
- blockNumber ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - Number of block or tag

The function returns a Promise that resolves to the balance of the specified Ethereum address in Wei, which is the smallest unit of Ether (1 Ether = 1e18 Wei). To convert the balance from Wei to Ether, you can use the web3.utils.fromWei function provided by the web3 library.
```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const accounts = await web3.eth.getAccounts();

    const currentBalance = await web3.eth.getBalance(accounts[0]);

    console.log('Current balance:', currentBalance); // 100000000000000000000n
}
(async () => {
    await test();
})();
```

### getBlock

The [getBlock](/api/web3-eth/function/getBlock) function is used to retrieve information about a specific Ethereum block. Ethereum blocks are the fundamental building blocks of the blockchain, containing a collection of transactions and other data.

The [getBlock](/api/web3-eth/function/getBlock) function typically takes two parameters:
- block ([HexString32Bytes](/api/web3/namespace/types/#HexString32Bytes) | [BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - Number of block or tag
- hydrated (boolean) -  if true, it returns the detail of each transaction. If false, only the hashes of the transactions.

The function returns a Promise that resolves to an object containing details about the requested block. The structure of this object may vary depending on whether you requested transaction objects. The block information often includes fields like number, hash, parentHash, nonce, miner, gasLimit, gasUsed, timestamp, and more.
```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const block = await web3.eth.getBlock('latest');
    console.log('Block:', block);
    // Block: {
    //     number: 0n,
    //     hash: '0x1218eb233187b0120a09fea9eae5d5360df5abbad66cb59d0f93538fcf4748e5',
    //     parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    //     mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    //     nonce: 0n,
    //     sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
    //     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    //     transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    //     stateRoot: '0xf1613937d7faa51ee731f0f2c7a7828ab0ddd2e4644a268d3be2f1b315b023d1',
    //     receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    //     miner: '0x0000000000000000000000000000000000000000',
    //     difficulty: 0n,
    //     totalDifficulty: 0n,
    //     extraData: '0x',
    //     size: 1000n,
    //     gasLimit: 6721975n,
    //     gasUsed: 0n,
    //     timestamp: 1698721176n,
    //     uncles: []
    // }
}
(async () => {
    await test();
})();
```

### getBlockNumber

The [getBlockNumber](/api/web3-eth/function/getBlockNumber) function is used to retrieve the latest block number (also known as the block height) of the Ethereum blockchain. The block number is a crucial piece of information in Ethereum as it represents the current state of the blockchain, indicating the total number of blocks that have been mined up to the present.

The [getBlockNumber](/api/web3-eth/function/getBlockNumber) function does not require any parameters. It simply sends a request to the Ethereum node specified in your web3 provider to get the current block number.

The function returns a Promise that resolves to the latest block number as a numeric value.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Block number:', blockNumber);
    // Block number: 0n
}
(async () => {
    await test();
})();
```

### getBlockTransactionCount

The [getBlockTransactionCount](/api/web3-eth/function/getBlockTransactionCount) function is used to retrieve the number of transactions in a specific Ethereum block. It allows you to determine how many transactions were included in a particular block on the Ethereum blockchain.

This function typically takes one parameter:
- block ([HexString32Bytes](/api/web3/namespace/types/#HexString32Bytes) | [BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - Number of block or tag

The function returns a Promise that resolves to the number of transactions in the specified block as a numeric value.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const blockTransactionCount = await web3.eth.getBlockTransactionCount('latest');
    console.log('Block transaction count:', blockTransactionCount);
    // Block transaction count: 0n
}
(async () => {
    await test();
})();
```

### getBlockUncleCount

The [getBlockUncleCount](/api/web3-eth/function/getBlockUncleCount) function is used to retrieve the number of uncle blocks associated with a specific Ethereum block. In Ethereum, uncle blocks (also known as "stale blocks" or "ommer blocks") are blocks that were mined but not included in the main blockchain. They are referenced by other blocks as a way to reward miners for their efforts even if their blocks weren't part of the main chain.

This function typically takes one parameter:
- block ([HexString32Bytes](/api/web3/namespace/types/#HexString32Bytes) | [BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - Number of block or tag

The function returns a Promise that resolves to the number of uncle blocks (also known as "uncles") associated with the specified block as a numeric value.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const blockUncleCount = await web3.eth.getBlockUncleCount('latest');
    console.log('Block uncle count:', blockUncleCount);
    // Block uncle count: 0n
}
(async () => {
    await test();
})();
```

### getChainId

The [getChainId](/api/web3-eth/function/getChainId) function is used to retrieve the chain ID of the connected Ethereum network. The chain ID is a unique identifier for a specific Ethereum network, and it's used to help prevent replay attacks when signing transactions. Different Ethereum networks, such as the mainnet, testnets, and private networks, have distinct chain IDs.

This function does not require any parameters.

The [getChainId](/api/web3-eth/function/getChainId) function returns a Promise that resolves to the chain ID of the connected Ethereum network as a numeric value.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const chainId = await web3.eth.getChainId();
    console.log('Chain Id:', chainId);
    // Chain Id: 1337n
}
(async () => {
    await test();
})();
```

### getCode

The [getCode](/api/web3-eth/function/getCode) function library is used to retrieve the bytecode of a smart contract deployed on the Ethereum blockchain. Smart contracts on Ethereum are typically created by deploying bytecode to a specific address, and this function allows you to fetch the bytecode associated with a particular contract address.

This function takes two parameters:
- address ([Address](/api/web3/namespace/types#Address)) - This is the Ethereum address of the smart contract for which you want to retrieve the bytecode.
- blockNumber ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - This parameter specifies the block at which you want to retrieve the contract's bytecode. It can be a block number, block tag (e.g., 'latest', 'earliest', or 'pending'), or a block hash. If you omit this parameter, it defaults to 'latest', which retrieves the bytecode from the most recent block.

The function returns a Promise that resolves to the bytecode of the specified contract as a hexadecimal string.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const accounts = await web3.eth.getAccounts();
    const code = await web3.eth.getCode(accounts[0], 'latest');
    console.log('Code:', code);
    // Code: 0x608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610b15565b60405180910390f35b6100e660048036038101906100e19190610bd0565b610308565b6040516100f39190610c2b565b60405180910390f35b61010461032b565b6040516101119190610c55565b60405180910390f35b610134600480360381019061012f9190610c70565b610335565b6040516101419190610c2b565b60405180910390f35b610152610364565b60405161015f9190610cdf565b60405180910390f35b610182600480360381019061017d9190610bd0565b61036d565b60405161018f9190610c2b565b60405180910390f35b6101b260048036038101906101ad9190610cfa565b6103a4565b6040516101bf9190610c55565b60405180910390f35b6101d06103ec565b6040516101dd9190610b15565b60405180910390f35b61020060048036038101906101fb9190610bd0565b61047e565b60405161020d9190610c2b565b60405180910390f35b610230600480360381019061022b9190610bd0565b6104f5565b60405161023d9190610c2b565b60405180910390f35b610260600480360381019061025b9190610d27565b610518565b60405161026d9190610c55565b60405180910390f35b60606003805461028590610d96565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610d96565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610770565b6103588585856107fc565b60019150509392505050565b60006012905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190610df6565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610d96565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610d96565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610e9c565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fc565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610616576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060d90610f2e565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610685576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067c90610fc0565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107639190610c55565b60405180910390a3505050565b600061077c8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f657818110156107e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107df9061102c565b60405180910390fd5b6107f584848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610862906110be565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d190611150565b60405180910390fd5b6108e5838383610a7b565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610962906111e2565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546109fe9190610df6565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a629190610c55565b60405180910390a3610a75848484610a80565b50505050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610abf578082015181840152602081019050610aa4565b60008484015250505050565b6000601f19601f8301169050919050565b6000610ae782610a85565b610af18185610a90565b9350610b01818560208601610aa1565b610b0a81610acb565b840191505092915050565b60006020820190508181036000830152610b2f8184610adc565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610b6782610b3c565b9050919050565b610b7781610b5c565b8114610b8257600080fd5b50565b600081359050610b9481610b6e565b92915050565b6000819050919050565b610bad81610b9a565b8114610bb857600080fd5b50565b600081359050610bca81610ba4565b92915050565b60008060408385031215610be757610be6610b37565b5b6000610bf585828601610b85565b9250506020610c0685828601610bbb565b9150509250929050565b60008115159050919050565b610c2581610c10565b82525050565b6000602082019050610c406000830184610c1c565b92915050565b610c4f81610b9a565b82525050565b6000602082019050610c6a6000830184610c46565b92915050565b600080600060608486031215610c8957610c88610b37565b5b6000610c9786828701610b85565b9350506020610ca886828701610b85565b9250506040610cb986828701610bbb565b9150509250925092565b600060ff82169050919050565b610cd981610cc3565b82525050565b6000602082019050610cf46000830184610cd0565b92915050565b600060208284031215610d1057610d0f610b37565b5b6000610d1e84828501610b85565b91505092915050565b60008060408385031215610d3e57610d3d610b37565b5b6000610d4c85828601610b85565b9250506020610d5d85828601610b85565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610dae57607f821691505b602082108103610dc157610dc0610d67565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610e0182610b9a565b9150610e0c83610b9a565b9250828201905080821115610e2457610e23610dc7565b5b92915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000610e86602583610a90565b9150610e9182610e2a565b604082019050919050565b60006020820190508181036000830152610eb581610e79565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000610f18602483610a90565b9150610f2382610ebc565b604082019050919050565b60006020820190508181036000830152610f4781610f0b565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000610faa602283610a90565b9150610fb582610f4e565b604082019050919050565b60006020820190508181036000830152610fd981610f9d565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b6000611016601d83610a90565b915061102182610fe0565b602082019050919050565b6000602082019050818103600083015261104581611009565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b60006110a8602583610a90565b91506110b38261104c565b604082019050919050565b600060208201905081810360008301526110d78161109b565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b600061113a602383610a90565b9150611145826110de565b604082019050919050565b600060208201905081810360008301526111698161112d565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b60006111cc602683610a90565b91506111d782611170565b604082019050919050565b600060208201905081810360008301526111fb816111bf565b905091905056fea26469706673582212200f5d4d388d874300a0683419c878ee355f87f7a6d61c24dc48ad65d7996e729964736f6c63430008100033
}
(async () => {
    await test();
})();
```

### getCoinbase

The [getCoinbase](/api/web3-eth/function/getCoinbase) function is used to retrieve the address of the Ethereum account that is currently acting as the coinbase address for mining on the connected Ethereum node. The coinbase address is the address to which block rewards are sent when miners successfully mine a new block on the Ethereum blockchain. Miners configure their coinbase addresses to receive rewards for their mining efforts.

This function does not require any parameters. It simply sends a request to the Ethereum node to obtain the coinbase address.

The [getCoinbase](/api/web3-eth/function/getCoinbase) function returns a Promise that resolves to the Ethereum address (in hexadecimal format, starting with "0x") that is currently configured as the coinbase address on the connected Ethereum node.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const coinbase = await web3.eth.getCoinbase();
    console.log('Coinbase:', coinbase);
    // Coinbase: 0x8020b965731933170a83e2aea7b50afbc66ce0af
}
(async () => {
    await test();
})();
```

### getGasPrice

The [getGasPrice](/api/web3-eth/function/getGasPrice) function is used to retrieve the current gas price on the Ethereum network. Gas price is the amount of Ether (ETH) that users are willing to pay for each unit of gas when executing a transaction on the Ethereum network. Gas price is an important factor in determining the transaction fee (in ETH) for a transaction.

This function does not require any parameters. It simply sends a request to the Ethereum node to fetch the current gas price.

The [getGasPrice](/api/web3-eth/function/getGasPrice) function returns a Promise that resolves to the current gas price.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const gasPrice = await web3.eth.getGasPrice();
    console.log('GasPrice:', gasPrice);
    // GasPrice: 20000000000n
}
(async () => {
    await test();
})();
```

### getPendingTransactions

The [getPendingTransactions](/api/web3-eth/function/getPendingTransactions) function is used to retrieve information about pending transactions in the Ethereum network. Pending transactions are transactions that have been submitted to the network but have not yet been included in a mined block. This function allows you to access information about transactions that are waiting to be confirmed by miners.

The [getPendingTransactions](/api/web3-eth/function/getPendingTransactions) function does not require any parameters. It sends a request to the Ethereum node to fetch a list of pending transactions.

The function returns a Promise that resolves to an array of pending transaction objects. Each transaction object typically contains information such as the sender's address, recipient's address, transaction hash, gas price, nonce, and more.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const pendingTransactions = await web3.eth.getPendingTransactions();
    console.log('Pending transactions:', pendingTransactions);
    // Pending transactions: []
}
(async () => {
    await test();
})();
```

### getProof

The [getProof](/api/web3-eth/function/getProof) function is used to obtain a Merkle proof or Patricia trie proof for a specific value or data in an Ethereum smart contract's storage. This function is typically used when you want to validate that a piece of data is stored in the contract's storage or to provide evidence for data inclusion without having to interact with the entire contract state.

In Ethereum, storage proofs are used to demonstrate the existence of a value within a contract's storage without querying the entire storage of the contract, which can be computationally expensive. These proofs are essential for various applications, including decentralized exchanges, blockchain explorers, and certain cryptographic operations.

The [getProof](/api/web3-eth/function/getProof) function typically takes the following parameters:

- address ([Address](/api/web3/namespace/types#Address)) - The Ethereum address of the smart contract from which you want to retrieve the proof.

- key ([Bytes[]](/api/web3/namespace/types#Bytes)): The storage key for which you want to obtain the proof. This is often represented as a hexadecimal string.

- blockNumber ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - The block number or tag (e.g., 'latest', 'earliest', or 'pending') at which you want to retrieve the proof. If omitted, it defaults to 'latest,' which means the proof will be based on the most recent block.

- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const contractAddress = '0x9f61CE799EbA957503157191ec8794D02ab54D6A';
    const proof = await web3.eth.getProof(contractAddress, [new Uint8Array([0])],'latest');
    console.log('Proof:', proof);
    // Proof: {
    //     accountProof: [
    //         '0xf901f1a0c4c526e227be3fdee81488f12fc52a58bfa6b52e23802123385708bdfb1d74c0a05127f4930f7a35382a870978e53e0a4cc8123fc2720a5bfde2aa7b5a5a424c87a0a90d2b672c284410b451cf739595a12bf1d3336fee770897adf5da52fd98510ba043658986f4f0e9df11ce83cab5a644f536ef27b200fcdc40774bb45bebcc6c1ea08a9777d7a1f633cabad7d680c9889a9681b4fdb736c75f4afdda8739af430331a0c15920b31f92dae4dace57555b5ae09c37897d0ef18fcf93e7c8e6755eac8180a013bdce56aa712761684d8b0d67623df11b9b39401f9eb8795c4fe6a3d334d1cca026f5f99c521337bb453cbd5c7ae7b6ab01df1f8fa7f3c37cf74ab0364678b4bba0e85117f7e14343fc497c3555cf9431090f1f9a06b8ae0b27c222e9f65c3ce474a0a8aa5eb13534eccaa8f97850cbff5a7abc6612404a25d25539ed7618ad1801bfa06301b39b2ea8a44df8b0356120db64b788e71f52e1d7a6309d0d2e5b86fee7cba048c1454205a3a7cf4070677cd6eeb80b0d78d5c6485a6ab36a4f40ba74a3d0b5a07cb1e4f6824f303c354ebd46981043da8c0dca746c3ff184c5407a60afcd8dc4a012545779ccbc84d85525bd7e61fe9e63757b8fae2bf6a5381c86648192b38f37a018e9e4e95467a98d9072fc39a286ea1c12f1a68b691591351a875752e4e1b6ef8080',
    //         '0xf869a03330b34465872051674cc07ce393e696b669a7c03f51c1e631d842de2fceb846b846f8440180a0645f5edbacf45fb4d3bb88bf93872c79a31c4943373709e5575586f3e4dca886a04a2bfcb239d51ace7af4b55ea5123f54aa6ed267e1b5d1b2cc53989357f5ab16'
    //     ],
    //     balance: 0n,
    //     codeHash: '0x4a2bfcb239d51ace7af4b55ea5123f54aa6ed267e1b5d1b2cc53989357f5ab16',
    //     nonce: 1n,
    //     storageHash: '0x645f5edbacf45fb4d3bb88bf93872c79a31c4943373709e5575586f3e4dca886',
    //     storageProof: [
    //       {
    //           key: '0x0000000000000000000000000000000000000000000000000000000000000000',
    //           value: 10n,
    //            proof: [
    //                '0xf8718080a0aeae4387bbc764f377f9c2aadeaa0055d277a88de6240834729e86ced64ad60580a015503e91f9250654cf72906e38a7cb14c3f1cc06658379d37f0c5b5c32482880808080808080a05b8d76a9dfcef07c603d80d41e24128f8676bd89d802c9ff3b3fde76fefc8a998080808080',
    //                '0xe2a0390decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5630a'
    //            ]
    //       }
    //    ]
    // }
}
(async () => {
    await test();
})();
```

### getProtocolVersion

You can use the [getProtocolVersion](/api/web3-eth/function/getProtocolVersion) method to retrieve the current Ethereum protocol version of the connected Ethereum node. 

This method returns a Promise that resolves to a string representing the protocol version.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const version = await web3.eth.getProtocolVersion();
    console.log('Version:', version);
    // Version: 63
}
(async () => {
    await test();
})();
```

### getStorageAt

The [getStorageAt](/api/web3-eth/function/getStorageAt) method is used to fetch the data stored at a specific storage slot of an Ethereum address. It is often used for inspecting the internal state of smart contracts, especially when you want to retrieve the value of a specific variable in a contract's storage.

The [getStorageAt](/api/web3-eth/function/getProof) function typically takes the following parameters:

- address ([Address](/api/web3/namespace/types#Address)) - The Ethereum address (contract address) from which you want to retrieve the storage data.

- storageSlot ([Numbers](/api/web3/namespace/types#Numbers)): The index of the storage slot you want to access. It can be a hex string or a numeric index.

- blockNumber ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - The block number, block tag, or "latest" specifying the block at which you want to retrieve the storage data. If not provided, it defaults to "latest."

- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const contractAddress = '0xEf58954D89174b80320304aD00e162cCA09bB5dd';
    const storage = await web3.eth.getStorageAt(contractAddress, 1);
    console.log('Storage:', storage);
    // Storage: 0x7374720000000000000000000000000000000000000000000000000000000006
}
(async () => {
    await test();
})();
```

### getTransaction

The [getTransaction](/api/web3-eth/function/getTransaction) method allows you to retrieve information about a transaction based on its transaction hash. You provide the transaction hash, and this method returns an object containing details about the transaction

The [getTransaction](/api/web3-eth/function/getTransaction) function typically takes the following parameters:

- transactionHash ([Bytes](/api/web3/namespace/types#Bytes)) - The hash of the transaction you want to retrieve information for.

- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const tx = await web3.eth.getTransaction('0xef602804f745ce03c5fbb7431487e4e436be094587c14675d9407f5444c7fa3f');
    console.log('Transaction:', tx);
    // Transaction: {
    //     blockHash: '0x91be71e76099d51fed70fca3f80dc9a52ebf027a1330455ff7cb8a7481190960',
    //     blockNumber: 62n,
    //     from: '0xc8fae455deaf7cd62c3eb57cccd544eb3009ce07',
    //     gas: 300000n,
    //     gasPrice: 2500290802n,
    //     maxFeePerGas: 2500655484n,
    //     maxPriorityFeePerGas: 2500000000n,
    //     hash: '0xef602804f745ce03c5fbb7431487e4e436be094587c14675d9407f5444c7fa3f',
    //     input: '0x',
    //     nonce: 7n,
    //     to: '0x1a5c923e760076ed8ce1cd1690e2c7bc1a8b1913',
    //     transactionIndex: 0n,
    //     value: 1n,
    //     type: 2n,
    //     accessList: [],
    //     chainId: 1337n,
    //     v: 1n,
    //     r: '0xa0a4fb6da46cb8816a80ee566d46c7621a3e44d753e1c24454f90df192827cbb',
    //     s: '0x770e5726202603312d6bcb0236bbbc303e2a34448b288ae26078c15e5513728c',
    //     data: '0x'
    // }
}
(async () => {
    await test();
})();
```

### getTransactionCount

The [getTransactionCount](/api/web3-eth/function/getTransactionCount) method allows you to retrieve the transaction count (nonce) of a specific Ethereum address.

The [getTransactionCount](/api/web3-eth/function/getTransactionCount) function typically takes the following parameters:

- address ([Address](/api/web3/namespace/types#Address)) - The Ethereum address for which you want to retrieve the transaction count (nonce).

- blockNumber ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - The block number, block tag, or "latest," specifying the block at which you want to retrieve the transaction count. If not provided, it defaults to "latest."

- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const txCount = await web3.eth.getTransactionCount('0x03095dc4857bb26f3a4550c5651df8b7f6b6b1ef', 'latest');
    console.log('Transaction count:', txCount);
    // Transaction count: 1n
}
(async () => {
    await test();
})();
```

### getTransactionReceipt

The [getTransactionReceipt](/api/web3-eth/function/getTransactionReceipt) method allows you to retrieve the transaction receipt for a specific transaction based on its transaction hash.

The [getTransactionReceipt](/api/web3-eth/function/getTransactionReceipt) function typically takes the following parameters:

- transactionHash ([Bytes](/api/web3/namespace/types#Bytes)) - The hash of the transaction for which you want to retrieve the receipt
- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.


```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const receipt = await web3.eth.getTransactionReceipt('0x07667543cddaeea65ed6277395e63c26603184469f9092776c8c6563337b10ab');
    console.log('Receipt:', receipt);
    // Receipt: {
    //   blockHash: '0xe22e56a09a7d0a591edfc65fa4377073d50f4be63d3bc7f3711730aff3d2f1f6',
    //   blockNumber: 95n,
    //   cumulativeGasUsed: 21000n,
    //   effectiveGasPrice: 2500003807n,
    //   from: '0x58422b64d0e95ab4e93a9d95b755d9b53545c9ef',
    //   gasUsed: 21000n,
    //   logs: [],
    //   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    //   status: 1n,
    //   to: '0xc8378dc00c6dcdc2d1e090e9543ad45d22c4d5c0',
    //   transactionHash: '0x07667543cddaeea65ed6277395e63c26603184469f9092776c8c6563337b10ab',
    //   transactionIndex: 0n,
    //   type: 2n
    // }
}
(async () => {
    await test();
})();
```


### getUncle

The [getUncle](/api/web3-eth/function/getUncle) method allows you to retrieve information about an uncle block at a specific index within a given block.

The [getUncle](/api/web3-eth/function/getUncle) function typically takes the following parameters:

- block ([BlockNumberOrTag](/api/web3/namespace/types/#BlockNumberOrTag)) - The hash or number of the block that contains the uncle you want to retrieve information about.
- uncleIndex ([Numbers](/api/web3/namespace/types/#Numbers)) - The index of the uncle within the block. Indexes start from 0.
- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const uncle = await web3.eth.getUncle('latest', 0);
    console.log('Uncle:', uncle);
    // Uncle: {}

}
(async () => {
    await test();
})();
```

### isMining

The [isMining](/api/web3-eth/function/isMining) function returns a boolean value, indicating whether the node is actively mining or not.

The [isMining](/api/web3-eth/function/isMining) function does not require any parameters.

This method returns a Promise that resolves to a boolean value indicating whether the node is actively mining (true) or not (false). You can use this information to determine the mining status of your Ethereum node.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const isMining = await web3.eth.isMining();
    console.log('Is mining:', isMining);
    // Is mining: true
}
(async () => {
    await test();
})();
```

### isSyncing

The [isSyncing](/api/web3-eth/function/isSyncing) method allows you to check the current synchronization status of your Ethereum node.

The [isSyncing](/api/web3-eth/function/isSyncing) function does not require any parameters.

This method returns a Promise that resolves to an object containing information about the synchronization status of the node. If the node is currently syncing, you can access properties like currentBlock and highestBlock to determine the progress of the synchronization.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const isSyncing = await web3.eth.isSyncing();
    console.log('Is syncing:', isSyncing);
    // Is syncing: {
    //     startingBlock: 100,
    //     currentBlock: 312,
    //     highestBlock: 512,
    //     knownStates: 234566,
    //     pulledStates: 123455
    // }
}
(async () => {
    await test();
})();
```

### sendTransaction

The [sendTransaction](/api/web3-eth/function/sendTransaction) method is used to create and send a transaction to the Ethereum network.

:::note
Please be cautious when sending transactions, especially when dealing with smart contracts, as they may execute specific functions that can have irreversible effects. Always ensure that the details in your transaction object are accurate and intended.
:::

The [sendTransaction](/api/web3-eth/function/sendTransaction) function typically takes the following parameters:

- transaction ([Transaction](/api/web3/namespace/types/#Transaction) | [TransactionWithFromLocalWalletIndex](/api/web3/namespace/types/#TransactionWithFromLocalWalletIndex) | [TransactionWithToLocalWalletIndex](/api/web3/namespace/types/#TransactionWithToLocalWalletIndex) | [TransactionWithFromAndToLocalWalletIndex](/api/web3/namespace/types/#TransactionWithFromAndToLocalWalletIndex)
  ) - An object that contains the details of the transaction, including properties such as from (sender address), to (recipient address), value (amount in Wei), data (transaction data or smart contract method call), and more.
- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.
- options ([SendTransactionOptions](/api/web3/namespace/types/#SendTransactionOptions)) - A configuration object used to change the behavior of the [sendTransaction](/api/web3-eth/function/sendTransaction) method.

This method returns a Promise that resolves to a transaction receipt, which contains information about the transaction, including the transaction hash, block number, gas used, and more.

:::note
[Here](/guides/basics/sign_and_send_tx/) you can find more examples how to send transaction.
:::

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const tx = {
        from: '0xf1e4df637e764eb7bd9b9f2aab391cc757b875a0',
        value: '0x1',
        maxPriorityFeePerGas: BigInt(500000000),
        maxFeePerGas: BigInt(500000000),
        to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
        type: BigInt(1)
    }

    const receipt = await web3.eth.sendTransaction(tx);
    console.log('Receipt:', receipt);
    // Receipt: {
    //   blockHash: '0x50cc6c50e4ea0a2e900eebe8a8883e68c4cc33d1cfdb66da65fa0b7fa3110a4f',
    //   blockNumber: 120n,
    //   cumulativeGasUsed: 21000n,
    //   effectiveGasPrice: 500000000n,
    //   from: '0xf1e4df637e764eb7bd9b9f2aab391cc757b875a0',
    //   gasUsed: 21000n,
    //   logs: [],
    //   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    //   status: 1n,
    //   to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
    //   transactionHash: '0x1b05c073e8593a928cdb689fd3c620f252fb2969d33710f297e909ef69dc56c6',
    //   transactionIndex: 0n,
    //   type: 2n
    // }
}
(async () => {
    await test();
})();
```


### sign

The [sign](/api/web3-eth/function/sign) method is used to sign a message or data using a private key. This is often used to prove ownership or authorship of a specific piece of data or to provide cryptographic proof in various Ethereum-related operations.

The [sign](/api/web3-eth/function/sign) function typically takes the following parameters:

- message ([Bytes](/api/web3/namespace/types/#Bytes)) - The message or data you want to sign.
- addressOrIndex ([Address](/api/web3/namespace/types/#Address)) - Address to sign data with, can be an address or the index of a local wallet.
- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

This method returns a Promise that resolves to a signature.

```typescript
import Web3 from 'web3';
const web3 = new Web3('http://localhost:7545');

async function test() {
    const signedData = await web3.eth.sign('0x123123', '0xf1e4df637e764eb7bd9b9f2aab391cc757b875a0');
    console.log('SignedData:', signedData);
    // SignedData: 0x4f2a46f6e087ac4bba79a19e5ee45fb1c53a0326cc9e5ba79e512f851e2ca75809f407e46c07dde25a0b34b7fb475e4d2d449dd620cf69d4784239c60447d94c1c
}
(async () => {
    await test();
})();

```

### signTransaction

The [signTransaction](/api/web3-eth/function/signTransaction) method is used to sign an Ethereum transaction, creating a signed transaction object that can be broadcast to the Ethereum network.
The [signTransaction](/api/web3-eth/function/signTransaction) function typically takes the following parameters:

- transaction ([Transaction](/api/web3/namespace/types/#Transaction)) - The message or data you want to sign.
- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.

This method returns a Promise that resolves to an object which includes `raw` field. You can use the `raw` to send the transaction to the Ethereum network using the [sendSignedTransaction](/api/web3-eth/function/sendSignedTransaction) method.

```typescript
import Web3 from 'web3';

const web3 = new Web3('http://localhost:7545');

async function test() {
    const from = '0xf1e4df637e764eb7bd9b9f2aab391cc757b875a0';
    const tx = {
        from,
        to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
        value: '0x1',
        gas: BigInt(21000),
        nonce: await web3.eth.getTransactionCount(from),
        gasPrice: await web3.eth.getGasPrice()
    }
    const signedTransaction = await web3.eth.signTransaction(tx);
    console.log('Signed transaction:', signedTransaction);
    // Signed transaction: {
    //     raw: '0xf86514849502f9948252089427aa427c1d668ddefd7bc93f8857e7599ffd16ab0180820a96a0b9f6257bcf97ff1e868732f0479ae38d6e4f6c6ffaa1600bae08340923e665e5a07067d17e148775d97adc3cea4a4a5277fb255494370356cc8c59da29bdc99088',
    //     tx: {
    //         type: 0n,
    //         chainId: 1337n,
    //         nonce: 20n,
    //         to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
    //         gas: 21000n,
    //         gasPrice: 2500000148n,
    //         value: 1n,
    //         input: '0x',
    //         v: 2710n,
    //         r: '0xb9f6257bcf97ff1e868732f0479ae38d6e4f6c6ffaa1600bae08340923e665e5',
    //         s: '0x7067d17e148775d97adc3cea4a4a5277fb255494370356cc8c59da29bdc99088',
    //         data: '0x'
    //     }
    // }
}
(async () => {
    await test();
})();
```

### sendSignedTransaction


The [sendSignedTransaction](/api/web3-eth/function/sendSignedTransaction) method is used to send a signed Ethereum transaction to the Ethereum network. Before sending a transaction, you need to sign it using a private key, and then you can use this method to broadcast the signed transaction to the network.

The [sendSignedTransaction](/api/web3-eth/function/sendSignedTransaction) function typically takes the following parameters:

- transaction ([Bytes](/api/web3/namespace/types/#Bytes)) - The signed transaction data in hexadecimal format. This data includes the signed transaction details, such as the sender's address, recipient's address, value, gas limit, gas price, and the transaction's nonce.
- returnFormat ([ReturnFormat](/api/web3/namespace/types/#DEFAULT_RETURN_FORMAT)) - Specifies how the return data should be formatted.
- options ([SendTransactionOptions](/api/web3/namespace/types/#SendTransactionOptions)) - A configuration object used to change the behavior of the [sendSignedTransaction](/api/web3-eth/function/sendSignedTransaction) method.

This method returns a Promise that resolves to a transaction receipt object.

:::note
[Here](/guides/basics/sign_and_send_tx/) you can find more examples how to send transaction.
:::

```typescript
import Web3 from 'web3';

const web3 = new Web3('http://localhost:7545');

async function test() {
    const from = '0xf1e4df637e764eb7bd9b9f2aab391cc757b875a0';
    const tx = {
        from,
        to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
        value: '0x1',
        gas: BigInt(21000),
        nonce: await web3.eth.getTransactionCount(from),
        gasPrice: await web3.eth.getGasPrice()
    }
    const signedTransaction = await web3.eth.signTransaction(tx);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.raw);
    console.log('Signed transaction receipt:', receipt);
    // Signed transaction receipt: {
    //     blockHash: '0x8ea85e1563e023ff6523474452bd1d0543be9b64509d854a91394b7d7784e8e0',
    //     blockNumber: 121n,
    //     cumulativeGasUsed: 21000n,
    //     effectiveGasPrice: 2500000148n,
    //     from: '0xf1e4df637e764eb7bd9b9f2aab391cc757b875a0',
    //     gasUsed: 21000n,
    //     logs: [],
    //     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    //     status: 1n,
    //     to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
    //     transactionHash: '0xecadf379c96fe30faeb586a35d2631e5c0651abf9ac31ce50b212beb52d2d635',
    //     transactionIndex: 0n,
    //     type: 0n
    // }
}
(async () => {
    await test();
})();
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
