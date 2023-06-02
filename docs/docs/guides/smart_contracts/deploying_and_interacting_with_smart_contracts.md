---
sidebar_position: 1
sidebar_label: 'Deploying and Interacting with Smart Contracts'
---

# Deploying and Interacting with Smart Contracts

## Introduction

In this tutorial, we will walk through the process of deploying a smart contract to the Ethereum network, generating the ABI, and interacting with the smart contract using web3.js version 4.x. We will cover the basic concepts of Ethereum, Solidity, and web3.js and provide step-by-step instructions for deploying a simple smart contract to a test network using Ganache.

## Overview

Here is a high-level overview of the steps we will be taking in this tutorial:

1. Setting up the Environment
2. Create a new project directory and initialize a new Node.js project.
3. Write the Solidity code for the smart contract and save it to a file.
4. Compile the Solidity code using the Solidity Compiler and get its ABI and Bytecode.
5. Set up the web3.js library and connect to the Ganache network.
6. Deploy the smart contract to the Ganache network using web3.js.
7. Interact with the smart contract using web3.js.

## Step 1: Setting up the Environment

Before we start writing and deploying our contract, we need to set up our environment. For that, we need to install the following:

1. Ganache - Ganache is a personal blockchain for Ethereum development that allows you to see how your smart contracts function in real-world scenarios. You can download it from http://truffleframework.com/ganache
2. Node.js - Node.js is a JavaScript runtime environment that allows you to run JavaScript on the server-side. You can download it from https://nodejs.org/en/download/
3. npm - Node Package Manager is used to publish and install packages to and from the public npm registry or a private npm registry. Here is how to install it https://docs.npmjs.com/downloading-and-installing-node-js-and-npm. (Alternatively, you can use yarn instead of npm https://classic.yarnpkg.com/lang/en/docs/getting-started/)

## Step 2: Create a new project directory and initialize a new Node.js project

First, create a new project directory for your project and navigate into it:

```
mkdir smart-contract-tutorial
cd smart-contract-tutorial
```

Next, initialize a new Node.js project using npm:

```
npm init -y
```

This will create a new `package.json` file in your project directory.

## Step 3: Write the Solidity code for the smart contract and save it to a file

In this step, we will write the Solidity code for the smart contract and save it as a file in our project directory.

Create a new file called `MyContract.sol` in your project directory and add the following Solidity code to it:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
	uint256 public myNumber;

	constructor(uint256 _myNumber) {
		myNumber = _myNumber;
	}

	function setMyNumber(uint256 _myNumber) public {
		myNumber = _myNumber;
	}
}

```

This simple smart contract defines a `myNumber` variable that can be set by calling the `setMyNumber` function.

## Step 4: Compile the Solidity code using the Solidity Compiler and get its ABI and Bytecode.

:::tip
📝 Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`. And then rename the files to `MyContractBytecode.bin` and `MyContractAbi.json`, in order to keep them the same as they will be used later in this tutorial.
More on solc-js is at https://github.com/ethereum/solc-js
:::

In this step, we will use the Solidity Compiler (solc) to compile the Solidity code and generate the compiled code.

First, install the `solc` package using npm.

:::note
📝 Specify a version for the compiler that is compatible with the version you specified in the .sol file above (with `pragma solidity ^0.8.0;`):
:::

```
npm install solc@0.8.0
```

Next, create a new file called `compile.js` in your project directory and add the following code to it:

```javascript
// This code will compile smart contract and generate its ABI and bytecode
// Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`

import solc from 'solc';
import path from 'path';
import fs from 'fs';

const fileName = 'MyContract.sol';
const contractName = 'MyContract';

// Read the Solidity source code from the file system
const contractPath = path.join(__dirname, fileName);
const sourceCode = fs.readFileSync(contractPath, 'utf8');

// solc compiler config
const input = {
	language: 'Solidity',
	sources: {
		[fileName]: {
			content: sourceCode,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};

// Compile the Solidity code using solc
const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

// Get the bytecode from the compiled contract
const bytecode = compiledCode.contracts[fileName][contractName].evm.bytecode.object;

// Write the bytecode to a new file
const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
fs.writeFileSync(bytecodePath, bytecode);

// Log the compiled contract code to the console
console.log('Contract Bytecode:\n', bytecode);

// Get the ABI from the compiled contract
const abi = compiledCode.contracts[fileName][contractName].abi;

// Write the Contract ABI to a new file
const abiPath = path.join(__dirname, 'MyContractAbi.json');
fs.writeFileSync(abiPath, JSON.stringify(abi, null, '\t'));

// Log the Contract ABI to the console
console.log('Contract ABI:\n', abi);
```

This code reads the Solidity code from the `MyContract.sol` file, compiles it using `solc`, and generates the ABI and bytecode for the smart contract. It then writes the bytecode to a new file called `MyContractBytecode.bin` and the contract ABI to `MyContractAbi.json`. And it logs them to the console.

Run the following command to compile the Solidity code:

```
node compile.js
```

If everything is working correctly, you should see both the Contract Bytecode and the Contract ABI logged to the console.

:::tip
📝 There are couple of other ways to get the bytecode and the ABI like using Truffle development framework and running `truffle compile` (https://trufflesuite.com/docs/truffle/quickstart/#compile).
Another way is to use Remix and check the _Compilation Details_ after compiling the smart contract (https://remix-ide.readthedocs.io/en/latest/run.html#using-the-abi-with-ataddress)
:::

## Step 5: Set up web3.js and connect to the Ganache network

In this step, we will set up the web3.js library and connect to the Ganache network. So, be sure to run Ganache if you did not already did.

First, install the `web3` package using npm:

```
npm install web3@4.0.1-rc.1
```

Note that we are installing the latest version of 4.x, at the time of this tutorial writing. You can check the latest version at https://www.npmjs.com/package/web3?activeTab=versions

Next, create a new file called `index.js` in your project directory and add the following code to it:

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
node index.js
```

If everything is working correctly, you should see the current block number logged to the console. However, if you got an error with the reason `connect ECONNREFUSED 127.0.0.1:7545` then double check that you are running Ganache locally on port `7545`.

## Step 5: Deploy the smart contract to the Ganache network using web3.js

In this step, we will use web3.js to deploy the smart contract to the Ganache network.

Create a file named `deploy.js` and fill it with the following code:

```javascript
// For simplicity we use `web3` package here. However, if you are concerned with the size,
//	you may import individual packages like 'web3-eth', 'web3-eth-contract' and 'web3-providers-http'.
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Create a new contract object using the ABI and bytecode
const abi = require('./MyContractAbi.json');
const MyContract = new web3.eth.Contract(abi);

async function deploy() {
	const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[0];
	console.log('deployer account:', defaultAccount);

	const myContract = MyContract.deploy({
		data: '0x' + bytecode,
		arguments: [1],
	});

	// optionally, estimate the gas that will be used for development and log it
	const gas = await myContract.estimateGas({
		from: defaultAccount,
	});
	console.log('estimated gas:', gas);

	try {
		// Deploy the contract to the Ganache network
		const tx = await myContract.send({
			from: defaultAccount,
			gas,
			gasPrice: 10000000000,
		});
		console.log('Contract deployed at address: ' + tx.options.address);

		// Write the Contract address to a new file
		const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
		fs.writeFileSync(deployedAddressPath, tx.options.address);
	} catch (error) {
		console.error(error);
	}
}

deploy();
```

This code reads the bytecode from the `MyContractBytecode.bin` file and creates a new contract object using the ABI and bytecode. And, as an optional step, it estimates the gas that will be used to deploy the smart contract. It then deploys the contract to the Ganache network. It also saves the address inside the file `MyContractAddress.bin` which we be used when interacting with the contract.

Run the following command to deploy the smart contract:

```sh
node deploy.js
```

If everything is working correctly, you should see something like the following:

```
Deployer account: 0xdd5F9948B88608a1458e3a6703b0B2055AC3fF1b
Estimated gas: 142748n
Contract deployed at address: 0x16447837D4A572d0a8b419201bdcD91E6e428Df1
```

## Step 6: Interact with the smart contract using web3.js

In this step, we will use web3.js to interact with the smart contract on the Ganache network.

Create a file named `interact.js` and fill it with the following code:

```javascript
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

// Read the contract address from the file system
const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
const deployedAddress = fs.readFileSync(deployedAddressPath, 'utf8');

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Create a new contract object using the ABI and bytecode
const abi = require('./MyContractAbi.json');
const MyContract = new web3.eth.Contract(abi, deployedAddress);

async function interact() {
	const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[0];

	try {
		// Get the current value of my number
		const myNumber = await MyContract.methods.myNumber().call();
		console.log('my number value: ' + myNumber);

		// Increment my number
		const receipt = await MyContract.methods.setMyNumber(myNumber + 1n).send({
			from: defaultAccount,
			gas: 1000000,
			gasPrice: 10000000000,
		});
		console.log('Transaction Hash: ' + receipt.transactionHash);

		// Get the updated value of my number
		const myNumberUpdated = await MyContract.methods.myNumber().call();
		console.log('my number updated value: ' + myNumberUpdated);
	} catch (error) {
		console.error(error);
	}
}

interact();
```

This code uses the `MyContract` object to interact with the smart contract. It gets the current value of myNumber, increments it and update it, and gets its updated value. It logs myNumber values and transaction receipts to the console.

Run the following command to interact with the smart contract:

```
node interact.js
```

If everything is working correctly, you should see the current counter value logged to the console, followed by the transaction receipt, and then the updated counter value. The output would like:

```sh
my number value: 1
Transaction Hash: 0x9825e2a2115896728d0c9c04c2deaf08dfe1f1ff634c4b0e6eeb2f504372f927
my number updated value: 2
```

## Conclusion

In this tutorial, we learned how to generate the ABI and the Bytecode of a smart contract, deploy it to the Ethereum network, and interact with it using web3.js version 4.x.

With this knowledge, you can start experimenting with writing smart contract in order for building your decentralized applications (dApps) on the Ethereum network using web3.js. Keep in mind that this is just the beginning, and there is a lot more to learn about Ethereum and web3.js. So keep exploring and building, and have fun!

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
