---
sidebar_position: 1
sidebar_label: 'Mastering the Web3Eth package'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting Started with `eth` Package

## Introduction

The `web3-eth` package provides a set of powerful functionalities to interact with the Ethereum blockchain and smart contracts. In this tutorial, we will guide you through the basics of using the `web3-eth` package of web3.js version 4. We will be using TypeScript throughout the examples.

## Overview

Here is a high-level overview of the steps we will be taking in this tutorial:

1. [Setting up the Environment](#step-1-setting-up-the-environment)
2. [Create a new project directory and initialize a new Node.js project](#step-2-create-a-new-project-directory-and-initialize-a-new-nodejs-project)
3. [Set up web3.js and connect to the Ganache network](#step-3-set-up-web3js-and-connect-to-the-ganache-network)
4. [Interact with the Ethereum blockchain using web3.js](#step-4-interact-with-the-ethereum-blockchain-using-web3js)
5. [Importing specific package](#step-5-importing-specific-package)
6. [Send different type of transactions](#step-6-send-different-type-of-transactions)

## Step 1: Setting up the Environment

Before we start writing and deploying our contract, we need to set up our environment. For that, we need to install the following:

:::tip
You can also interact with a mainnet/testnet by using a node provider instead of ganache, you can use [Alchemy](https://www.alchemy.com/), [Infura](https://www.infura.io/), [QuickNode](https://www.quicknode.com/) or get a public endpoint from [Chainlist](https://chainlist.org/)
:::

1. `Ganache` - Ganache is a personal blockchain for Ethereum development that allows you to see how your smart contracts function in real-world scenarios. You can download it from http://truffleframework.com/ganache 
2. `Node.js` - Node.js is a JavaScript runtime environment that allows you to run JavaScript on the server-side. You can download it from https://nodejs.org/en/download/
3. `npm` - Node Package Manager is used to publish and install packages to and from the public npm registry or a private npm registry. Here is how to install it https://docs.npmjs.com/downloading-and-installing-node-js-and-npm. (Alternatively, you can use yarn instead of npm https://classic.yarnpkg.com/lang/en/docs/getting-started/)

## Step 2: Create a new project directory and initialize a new Node.js project

First, create a new project directory for your project and navigate into it:

```bash
mkdir web3-eth-tutorial
cd web3-eth-tutorial
```

Next, initialize a new Node.js project using npm:

```bash
npm init -y
```

This will create a new `package.json` file in your project directory.

```bash
npm i typescript @types/node
```

This will install typescript for our project and install the types for node.

## Step 3: Set up web3.js and connect to the Ganache network

In this step, we will set up the web3.js library and connect to the Ganache network. So, be sure to run Ganache if you did not already did.

First, install the `web3` package using npm:

```bash
npm i web3
```

Next, create a new file called `index.ts` in your project directory and add the following code to it:

```ts
import { Web3 } from 'web3';

// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
/* NOTE:
instead of using ganache, you can also interact with a testnet/mainnet using another provider
https://app.infura.io/
https://dashboard.alchemy.com/
or use a public provider https://chainlist.org/
*/

// Log the current block number to the console
const block = await web3.eth.getBlockNumber();

console.log('Last block:', block);
// ↳ Last block: 4975299n
```

This code sets up a connection to the Ganache network and logs the current block number to the console.

Run the following command to test the connection:

```
npx ts-node index.ts
```

If everything is working correctly, you should see the current block number logged to the console. However, if you got an error with the reason `connect ECONNREFUSED 127.0.0.1:7545` then double check that you are running Ganache locally on port `7545`.

## Step 4: Interact with the Ethereum blockchain using web3.js

In this step, we will use web3.js to interact with the Ganache network.

In the first example, we are going to send a simple value transaction.
Create a file named `transaction.ts` and fill it with the following code:

```typescript
import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';

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
    // value should be passed in wei. For easier use and to avoid mistakes,
    //	we utilize the auxiliary `toWei` function:
    value: web3.utils.toWei('1', 'ether'),
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

:::important
📝 When running a local development blockchain using Ganache, all accounts are typically unlocked by default, allowing easy access and transaction execution during development and testing. This means that the accounts are accessible without requiring a private key or passphrase. That's why we just indicate the accounts in the examples with the `from` field.
:::

Run the following:

```bash
npx ts-node transaction.ts
```

If everything is working correctly, you should see something like the following:

```ts
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
  logsBloom: '0x......000'
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
import { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } from 'web3';

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

  let contract = new web3.eth.Contract(abi);

  const deployment = contract.deploy({
    data: '0x608060405234801561001057600080fd5b506040516101d93803806101d983398181016040528101906100329190610054565b806000819055505061009e565b60008151905061004e81610087565b92915050565b60006020828403121561006657600080fd5b60006100748482850161003f565b91505092915050565b6000819050919050565b6100908161007d565b811461009b57600080fd5b50565b61012c806100ad6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806323fd0e401460375780636ffd773c146051575b600080fd5b603d6069565b6040516048919060bf565b60405180910390f35b6067600480360381019060639190608c565b606f565b005b60005481565b8060008190555050565b60008135905060868160e2565b92915050565b600060208284031215609d57600080fd5b600060a9848285016079565b91505092915050565b60b98160d8565b82525050565b600060208201905060d2600083018460b2565b92915050565b6000819050919050565b60e98160d8565b811460f357600080fd5b5056fea2646970667358221220d28cf161457f7936995800eb9896635a02a559a0561bff6a09a40bfb81cd056564736f6c63430008000033',
    // @ts-expect-error
    arguments: [1],
  });

  let estimatedGas = await deployment.estimateGas({ from: acc }, DEFAULT_RETURN_FORMAT);
  // the returned data will be formatted as a bigint

  console.log('Default format:', estimatedGas);

  estimatedGas = await deployment.estimateGas({ from: acc }, ETH_DATA_FORMAT);
  // the returned data will be formatted as a hexstring

  console.log('Eth format:', estimatedGas);
}

(async () => {
  await estimate();
})();
```

Run the following:

```bash
npx ts-node estimate.ts
```

If everything is working correctly, you should see something like the following:

```bash
Default format: 140648n
Eth format: 0x22568
```

:::note
📝 Note that numbers returned from web3.js are returned by default in the `BigInt` format. In this example we used `ETH_DATA_FORMAT` parameter, which, can be passed in most methods in web3.js in order to format the result in `hex`.
:::

In the next example we are going to sign a transaction and use `sendSignedTransaction` to send the signed transaction. Create a file named `sendSigned.ts` and fill it with the following code:

```typescript
import { Web3 } from 'web3';
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

```bash
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
  logsBloom: '0x...0000',
  status: 1n,
  effectiveGasPrice: 10000000000n,
  type: 2n
}
```

## Step 5: Importing specific package

To harness the capabilities of the web3-eth package, you can opt to import this package directly rather than depending on the global web3 package, which will result in a reduction in the build size.

### Import web3-eth directly

For example [getBalance](/api/web3-eth/function/getBalance) method:

```typescript
import { Web3Eth } from 'web3-eth';

const eth = new Web3Eth('http://localhost:7545');

async function test() {
	const accounts = await eth.getAccounts();
	const currentBalance = await eth.getBalance(accounts[0]);
	console.log('Current balance:', currentBalance);
	// 115792089237316195423570985008687907853269984665640564039437613106102441895127n
}

(async () => {
	await test();
})();
```

### Set config directly to web3-eth package

```typescript
import { Web3Eth } from 'web3-eth';

const eth = new Web3Eth('http://localhost:8545');

console.log('defaultTransactionType before', eth.config.defaultTransactionType);
// defaultTransactionType before 0x0

eth.setConfig({ defaultTransactionType: '0x1' });

console.log('eth.config.defaultTransactionType after', eth.config.defaultTransactionType);
// defaultTransactionType before 0x1
```

## Step 6: Send different type of transactions:

### Legacy Transaction

In Ethereum, a 'legacy transaction' typically refers to the traditional transactions, where gas fees are set explicitly by the sender and can fluctuate based on network demand. These legacy transactions were prevalent on the Ethereum network before the implementation of Ethereum Improvement Proposal (EIP) 1559.

Key characteristics of legacy transactions include:

1. Gas Price: In legacy transactions, the sender specifies a gas price (in Gwei) that they are willing to pay for each unit of gas consumed by the transaction. The gas price can be adjusted by the sender, and it determines the transaction's priority in getting processed by miners. Higher gas prices mean faster transaction confirmation.

2. Gas Limit: The sender also sets a gas limit, which is the maximum amount of gas that the transaction can consume. Gas is the computational fuel used to execute transactions and smart contracts on the Ethereum network. The gas limit is primarily set to ensure that the sender doesn't run out of Ether while processing the transaction. It can also impact the success or failure of the transaction.

3. Uncertainty in Fees: Legacy transactions are subject to fluctuating gas prices based on network congestion. During periods of high demand, gas prices can surge, causing users to pay more for their transactions to be processed promptly. Conversely, during quieter network periods, users can pay lower fees.

4. Manual Fee Estimation: Users are responsible for manually estimating the appropriate gas price to include in their legacy transactions to ensure timely processing. This process can be challenging, as setting gas prices too low may result in slow confirmation, while setting them too high may lead to overpaying.

5. EIP-1559, as described below, introduced changes to Ethereum's transaction fee system, making it more user-friendly and predictable. With EIP-1559, the concept of a 'base fee' replaces the manual setting of gas prices, which has reduced some of the uncertainties associated with legacy transactions.

While EIP-1559 has significantly improved the user experience, legacy transactions are still supported on the Ethereum network, and users can continue to send transactions with manually specified gas prices and gas limits if they prefer. However, the EIP-1559 mechanism is now the recommended approach for most transactions, as it simplifies the process and reduces the likelihood of overpaying for fees.

To send Legacy transaction use code below:

```typescript
import { Web3 } from 'web3';

const web3 = new Web3('http://localhost:8545');

async function test() {
  const privateKey = 'YOUR PRIVATE KEY HERE';
  // add private key to wallet to have auto-signing transactions feature
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  // create transaction object
  const tx = {
    from: account.address,
    to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
    value: '0x1',
    gas: BigInt(21000),
    gasPrice: await web3.eth.getGasPrice(),
    type: BigInt(0), // <- specify type
  };

  // send transaction
  const receipt = await web3.eth.sendTransaction(tx);

  console.log('Receipt:', receipt);
  // Receipt: {
  //   blockHash: '0xc0f2fea359233b0843fb53255b8a7f42aa7b1aff53da7cbe78c45b5bac187ad4',
  //   blockNumber: 21n,
  //   cumulativeGasUsed: 21000n,
  //   effectiveGasPrice: 2569891347n,
  //   from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
  //   gasUsed: 21000n,
  //   logs: [],
  //   logsBloom: '0x0...00000',
  //   status: 1n,
  //   to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
  //   transactionHash: '0x0ffe880776f5631e4b64caf521bd01cd816dd2cc29e533bc56f392211856cf9a',
  //   transactionIndex: 0n,
  //   type: 0n
  // }
}
(async () => {
  await test();
})();
```

### EIP-2930 Transaction

Ethereum Improvement Proposal 2930 is a proposal for a change to the Ethereum network that was implemented as part of the Berlin hard fork, which was activated in April 2021. EIP-2930 introduces a feature called 'Transaction Type and Access List.' This improvement enhances the gas efficiency of certain smart contract interactions and provides more flexibility in specifying who can access specific resources within a smart contract. Here are the key components of EIP-2930:

1. Transaction Type: EIP-2930 introduces a new transaction type called 'Access List Transaction.' This transaction type is designed to make certain interactions with smart contracts more efficient by allowing the sender to specify a list of addresses that may be accessed or modified during the transaction.

2. Access List: The Access List is a structured data format included with the transaction. It contains a list of addresses and storage keys that are expected to be accessed or modified during the execution of the transaction. This helps in reducing the amount of gas required for these operations, as miners can check the Access List to optimize the execution.

3. Gas Savings: EIP-2930 is intended to significantly reduce the gas costs for transactions that use the Access List feature. By specifying which storage slots and addresses are relevant to the transaction, it allows for a more efficient use of gas, especially in interactions with smart contracts that have a large state.

4. Contract Interactions: This improvement is particularly useful when interacting with contracts that have complex state structures, as it minimizes the gas required to read from or write to specific storage slots. This can lead to cost savings for users and make certain interactions more practical.

EIP-2930 is part of Ethereum's ongoing efforts to improve the network's efficiency and reduce transaction costs, making it more accessible and scalable for decentralized applications and users. It is especially beneficial for interactions with stateful contracts that rely on specific storage operations and access control mechanisms.

To send EIP-2930 transaction use code below:

```typescript
import {Web3} from 'web3';

const web3 = new Web3('http://localhost:8545');

async function test() {
  const privateKey = 'YOUR PRIVATE KEY HERE';
  // add private key to wallet to have auto-signing transactions feature
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  // create transaction object
  const tx = {
    from: account.address,
    to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
    value: '0x1',
    gasLimit: BigInt(21000),
    type: BigInt(1), // <- specify type
    // gasPrice - you can specify this property directly or web3js will fill this field automatically
  };

  // send transaction
  const receipt = await web3.eth.sendTransaction(tx);

  console.log('Receipt:', receipt);
  // Receipt: {
  //   blockHash: '0xd8f6a3638112d17b476fd1b7c4369d473bc1a484408b6f39dbf64410df44adf6',
  //   blockNumber: 24n,
  //   cumulativeGasUsed: 21000n,
  //   effectiveGasPrice: 2546893579n,
  //   from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
  //   gasUsed: 21000n,
  //   logs: [],
  //   logsBloom: '0x...0000',
  //   status: 1n,
  //   to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
  //   transactionHash: '0xd1d682b6f6467897db5b8f0a99a6be2fb788d32fbc1329b568b8f6b2c15e809a',
  //   transactionIndex: 0n,
  //   type: 1n
  // }
}
(async () => {
  await test();
})();
```

Here is an example of how to use an access list in a transaction.

:::note
The code of `Greeter` contract you can find [here](https://github.com/web3/web3.js/blob/4.x/fixtures/build/Greeter.ts)
:::

```typescript
import {Web3} from 'web3';

import { GreeterAbi, GreeterBytecode } from './fixture/Greeter';

const web3 = new Web3('http://localhost:8545');

async function test() {
  const privateKey = 'YOUR PRIVATE KEY HERE';
  // add private key to wallet to have auto-signing transactions feature
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  // deploy contract
  const contract = new web3.eth.Contract(GreeterAbi);
  const deployedContract = await contract
    .deploy({
      data: GreeterBytecode,
      arguments: ['My Greeting'],
    })
    .send({ from: account.address });
  deployedContract.defaultAccount = account.address;

  const transaction = {
    from: account.address,
    to: deployedContract.options.address,
    data: '0xcfae3217', // greet function call data encoded
  };
  const { accessList } = await web3.eth.createAccessList(transaction, 'latest');

  console.log('AccessList:', accessList);
  // AccessList: [
  //   {
  //     address: '0xce1f86f87bd3b8f32f0fb432f88e848f3a957ed7',
  //     storageKeys: [
  //       '0x0000000000000000000000000000000000000000000000000000000000000001'
  //     ]
  //   }
  // ]

  // create transaction object with accessList
  const tx = {
    from: account.address,
    to: deployedContract.options.address,
    gasLimit: BigInt(46000),
    type: BigInt(1), // <- specify type
    accessList,
    data: '0xcfae3217',
    // gasPrice - you can specify this property directly or web3js will fill this field automatically
  };

  // send transaction
  const receipt = await web3.eth.sendTransaction(tx);

  console.log('Receipt:', receipt);
  // Receipt: {
  //   blockHash: '0xc7b9561100c8ff6f1cde7a05916e86b7d037b2fdba86b0870e842d1814046e4b',
  //   blockNumber: 43n,
  //   cumulativeGasUsed: 26795n,
  //   effectiveGasPrice: 2504325716n,
  //   from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
  //   gasUsed: 26795n,
  //   logs: [],
  //   logsBloom: '0x...00000000000',
  //   status: 1n,
  //   to: '0xce1f86f87bd3b8f32f0fb432f88e848f3a957ed7',
  //   transactionHash: '0xa49753be1e2bd22c2a8e2530726614c808838bb0ebbed72809bbcb34f178799a',
  //   transactionIndex: 0n,
  //   type: 1n
  // }
}
(async () => {
  await test();
})();
```

### EIP-1559 Transaction

Ethereum Improvement Proposal 1559 is a significant upgrade to the Ethereum network's fee market and transaction pricing mechanism. It was implemented as part of the Ethereum London hard fork, which occurred in August 2021. EIP-1559 introduces several changes to how transaction fees work on the Ethereum blockchain, with the primary goals of improving user experience and network efficiency.

Here are some of the key features and changes introduced by EIP-1559:

1. Base Fee: EIP-1559 introduces a concept called the 'base fee.' The base fee is the minimum fee required for a transaction to be included in a block. It is determined algorithmically by the network and adjusts dynamically based on network congestion. When the network is busy, the base fee increases, and when it's less congested, the base fee decreases.

2. Inclusion Fee: In addition to the base fee, users can voluntarily include a 'tip' or 'inclusion fee' to incentivize miners to include their transactions in the next block. This allows users to expedite their transactions by offering a tip to miners.

3. Predictable Fees: With EIP-1559, users have a more predictable way to estimate transaction fees. They can set the maximum fee they are willing to pay, which includes the base fee and the tip. This eliminates the need for users to guess the appropriate gas price.

4. Burn Mechanism: EIP-1559 introduces a mechanism by which the base fee is 'burned' from circulation, reducing the overall supply of Ether (ETH). This deflationary mechanism can help address some of the concerns related to the increasing supply of ETH and potentially make it a better store of value.

5. Improved Fee Auctions: Under EIP-1559, fee auctions are more efficient. Users specify the maximum fee they are willing to pay, and the protocol automatically adjusts the tip to ensure transactions get processed promptly without overpaying.

6. Simpler Transaction Process: Users experience a simplified transaction process, as they don't have to set gas prices manually. Instead, they specify the maximum fee they are willing to pay, and the wallet software handles the rest.

EIP-1559 has been well-received for its potential to create a more user-friendly and efficient transaction fee system, making the Ethereum network more accessible and predictable for users. It is also seen as an important step in the transition to Ethereum 2.0, which aims to address scalability and sustainability challenges on the network.

To send EIP-1559 transaction use code below:

```typescript
import { Web3 } from 'web3';

const web3 = new Web3('http://localhost:8545');

async function test() {
  const privateKey = 'YOUR PRIVATE KEY HERE';
  // add private key to wallet to have auto-signing transactions feature
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  // create transaction object
  const tx = {
    from: account.address,
    to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
    value: '0x1',
    gasLimit: BigInt(21000),
    type: BigInt(2), // <- specify type
    // maxFeePerGas - you can specify this property directly or web3js will fill this field automatically
    // maxPriorityFeePerGas - you can specify this property directly or web3js will fill this field automatically
  };

  // send transaction
  const receipt = await web3.eth.sendTransaction(tx);

  console.log('Receipt:', receipt);
  // Receipt: {
  //   blockHash: '0xfe472084d1471720b6887071d32a793f7c4576a489098e7d2a89aef205c977fb',
  //   blockNumber: 23n,
  //   cumulativeGasUsed: 21000n,
  //   effectiveGasPrice: 2546893579n,
  //   from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
  //   gasUsed: 21000n,
  //   logs: [],
  //   logsBloom: '0x0000...00000000000',
  //   status: 1n,
  //   to: '0x27aa427c1d668ddefd7bc93f8857e7599ffd16ab',
  //   transactionHash: '0x5c7a3d2965b426a5776e55f049ee379add44652322fb0b9fc2f7f57b38fafa2a',
  //   transactionIndex: 0n,
  //   type: 2n
  // }
}
(async () => {
  await test();
})();
```

## Conclusion

In this tutorial, we learned how to use different methods provied by the `web3-eth` package.

With this knowledge, you can start experimenting with the Ethereum blockchain. Keep in mind that this is just the beginning, and there is a lot more to learn about Ethereum and web3.js. So keep exploring and building, and have fun!

Web3.js version 4.x provides a powerful and easy-to-use interface for interacting with the Ethereum network and building decentralized applications. And it has been rewritten in TypeScript but for simplicity of this tutorial we interacted with it in JavaScript.

The Ethereum ecosystem is constantly evolving, and there is always more to learn and discover. As you continue to develop your skills and knowledge, keep exploring and experimenting with new technologies and tools to build innovative and decentralized solutions.

## Additional Resources

-   [Official web3.js Documentation](https://docs.web3js.org/)
-   [Solidity Documentation](https://solidity.readthedocs.io/)
-   [Ganache](https://www.trufflesuite.com/ganache)
-   [Truffle](https://trufflesuite.com/)
-   [Remix IDE](https://remix.ethereum.org/)

## Tips and Best Practices

-   Always test your smart contracts on a local network like Ganache or Hardhat before deploying them to the mainnet.
-   Use the latest version of web3.js and Solidity to take advantage of the latest features and security patches.
-   Keep your private keys secure and never share them with anyone.
-   Use the gas limit and gas price parameters carefully to avoid spending too much on transaction fees.
-   Use the `estimateGas` function in web3.js to estimate the gas required for a transaction before sending it to the network.
-   Use events to notify the client application about state changes in the smart contract.
-   Use a linter like Solhint to check for common Solidity coding errors.

