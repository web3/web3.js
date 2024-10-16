---
sidebar_position: 2
sidebar_label: Quickstart
---

# Quickstart

Use the live code editor to try Web3.js in your browser now! Keep reading to learn how to use Web3.js in a local development environment.

## Live Code Editor

<iframe width="100%" height="700px"  src="https://stackblitz.com/edit/vitejs-vite-aksddx?embed=1&file=main.js&showSidebar=1"></iframe>

## Installation

If NPM is being used as package manager, install Web3.js with the following command:

```
npm i web3
```

For projects using Yarn as a package manager, use:

```
yarn add web3
```

Note: Installing Web3.js in this way will bring in all Web3.js sub-[packages](/#packages). If you only need specific packages, it is recommended to install them individually (e.g, if you want the [Contract](/libdocs/Contract) package, use `npm i web3-eth-contract` instead)

## Importing Web3.js

Web3.js v4 supports both CommonJS (CJS) and native ECMAScript module (ESM) imports. For importing the main Web3 class in CJS, use:

```js
const { Web3 } = require('web3');
```

For ESM-style imports, use:

```ts
import { Web3 } from 'web3';
```

## Initialize `Web3` with a Provider

[Providers](/guides/web3_providers_guide/) are services that are responsible for enabling connectivity with the Ethereum network. The `Web3` object must be initialized with a valid provider to function as intended. Web3.js supports [HTTP](/guides/web3_providers_guide/#http-provider), [WebSocket](/guides/web3_providers_guide/#websocket-provider), and [IPC](/guides/web3_providers_guide/#ipc-provider) providers, and exposes packages for working with each type of provider.

Web3.js is in compliance with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193), the Ethereum Provider JavaScript API, so any EIP-1193 provider can be used to initialize the `Web3` object.

```ts
import { Web3 } from 'web3';

// private RPC endpoint
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_ID');

// or public RPC endpoint
// const web3 = new Web3('https://eth.llamarpc.com');

web3.eth.getBlockNumber().then(console.log);
// ↳ 18849658n
```

## Querying the Blockchain

After instantiating the `Web3` instance with a provider, the [`web3-eth`](/libdocs/Web3Eth) package can be used to fetch data from the Ethereum network:

```ts
// get the balance of an address
await web3.eth.getBalance('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
// ↳ 114438180989009447638n

// get last block number
await web3.eth.getBlockNumber();
// ↳ 18849658n

// get the chain id of the current provider
await web3.eth.getChainId();
// ↳ 1n

// get the nonce of an address
await web3.eth.getTransactionCount('0x37826D8B5F4B175517A0f42c886f8Fca38C55Fe7');
// ↳ 7n

// get the current gas price
await web3.eth.getGasPrice();
// ↳ 23879160756n
```

## Setting Up a Wallet

To send transactions to the Ethereum network (e.g. [transferring ETH](/guides/getting_started/quickstart#transfer-eth) or [interacting with smart contracts](/guides/getting_started/quickstart#interact-with-smart-contracts)), it's necessary to use an [account](https://ethereum.org/en/developers/docs/accounts/) with funds to cover [gas fees](https://ethereum.org/en/developers/docs/gas/).

The [`Wallet`](/api/web3-eth-accounts/class/Wallet) object is designed to manage a set of accounts that can be used to send transactions with [`web3.eth.sendTransaction`](/api/web3/class/Web3Eth#sendTransaction) or [`web3.eth.contract.methods.contractfunction().send()`](/api/web3-eth-contract/class/Contract).

### Create a Random Account

Using the `Wallet` to create a random account is a good way to accelerate the development process, but it's not suitable for mainnet or production uses, since random accounts will not have funds to cover gas fees. Use the [`Wallet.create`](/api/web3-eth-accounts/class/Wallet#create) method to create a random account.

```ts
// create random wallet with 1 account
web3.eth.accounts.wallet.create(1);
/* ↳ 
Wallet(1) 
[
  {
    address: '0xcE6A5235d6033341972782a15289277E85E5b305',
    privateKey: '0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(1) { '0xce6a5235d6033341972782a15289277e85e5b305' => 0 },
  _defaultKeyName: 'web3js_wallet'
]
*/
```

### Add an Account from a Private Key

Use the [`Wallet.add`](/api/web3-eth-accounts/class/Wallet#add) method to use a private key to add an existing account to a wallet.

:::warning
Private keys are sensitive data and should be treated as such. Make sure that private keys are kept private, which includes making sure they are not committed to code repositories.
:::

```ts
// the private key must start with the "0x" prefix
const account = web3.eth.accounts.wallet.add(
	'0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec',
);

console.log(account[0].address);
//↳ 0xcE6A5235d6033341972782a15289277E85E5b305

console.log(account[0].privateKey);
//↳ 0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec
```

### Transfer ETH

This is an example of using a private key to add an account to a wallet, and then using that account to transfer ETH:

```ts
// add an account to a wallet
const account = web3.eth.accounts.wallet.add(
	'0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec',
);

// create transaction object to send 1 eth to '0xa32...c94' address from the account[0]
const tx = {
	from: account[0].address,
	to: '0xa3286628134bad128faeef82f44e99aa64085c94',
	value: web3.utils.toWei('1', 'ether'),
};
// the "from" address must match the one previously added with wallet.add

// send the transaction
const txReceipt = await web3.eth.sendTransaction(tx);

console.log('Tx hash:', txReceipt.transactionHash);
// ↳ Tx hash: 0x03c844b069646e08af1b6f31519a36e3e08452b198ef9f6ce0f0ccafd5e3ae0e
```

## Interact with Smart Contracts

[Smart contracts](https://ethereum.org/en/developers/docs/smart-contracts/) are programs that run on the Ethereum network. Keep reading to learn how to use Web3.js to interact with smart contracts.

### Instantiate a Smart Contract

The first step to interacting with a smart contract is to instantiate it, which requires the [ABI](https://docs.soliditylang.org/en/develop/abi-spec.html) and address of the smart contract. The following examples demonstrates instantiating the [Uniswap](https://uniswap.org/) token smart contract:

```ts
// Uniswap token smart contract address (Mainnet)
const address = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

// you can find the complete ABI on etherscan.io
// https://etherscan.io/address/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984#code
const ABI = [
	{
		name: 'symbol',
		outputs: [{ type: 'string' }],
		type: 'function',
	},
	{
		name: 'totalSupply',
		outputs: [{ type: 'uint256' }],
		type: 'function',
	},
];

// instantiate the smart contract
const uniswapToken = new web3.eth.Contract(abi, address);
```

### Read Methods

Since reading data from a smart contract does not consume any gas, it's not necessary to use an account to do so. Here are some examples of reading data from the Uniswap token smart contract:

```ts
// make the call to the contract
const symbol = await uniswapToken.methods.symbol().call();

console.log('Uniswap symbol:', symbol);
// ↳ Uniswap symbol: UNI

// make the call to the contract
const totalSupply = await uniswapToken.methods.totalSupply().call();

console.log('Uniswap Total supply:', totalSupply);
// ↳ Uniswap Total Supply: 1000000000000000000000000000n
```

### Write Methods

Writing data to a smart contract consumes gas and requires the use of an account with funds. The following example demonstrates such an interaction:

```ts
// address to send the token
const to = '0xcf185f2F3Fe19D82bFdcee59E3330FD7ba5f27ce';

// value to transfer (1 with 18 decimals)
const value = web3.utils.toWei('1', 'ether');

// send the transaction => return the Tx receipt
const txReceipt = await uniswapToken.methods.transfer(to, value).send({ from: account[0].address });

console.log('Tx hash:', txReceipt.transactionHash);
// ↳ Tx hash: 0x14273c2b5781cc8f1687906c68bfc93482c603026d01b4fd37a04adb6217ad43
```

### Query Past Events

Smart contracts emit [events](https://ethereum.org/en/developers/docs/smart-contracts/anatomy/#events-and-logs) to communicate important interactions. This example demonstrates how to query the Uniswap token smart contract for all `Transfer` events that occurred after a certain block number:

```ts
// get past `Transfer` events from block 18850576
const eventTransfer = await uniswapToken.getPastEvents('Transfer', { fromBlock: 18850576 });

console.log(eventTransfer);
// ↳ [{...},{...}, ...] array with all the events emitted
```

:::note
You can only query logs from the most recent 100,000 blocks.
:::

### Subscribing to Events

Web3.js allows user to subscribe to events for real-time notification of important contract interactions. Here is an example of creating a subscription to the Uniswap token's `Transfer` event:

:::note
HTTP providers do not support real-time event subscriptions. Use one of the other [provider types](/guides/web3_providers_guide/#providers-types) to subscribe to real-time events.
:::

```ts
import { Web3 } from 'web3';

// WebSocket provider
const web3 = new Web3('wss://ethereum.publicnode.com');

// instantiate contract
const uniswapToken = new web3.eth.Contract(abi, address);

// create the subscription to all the 'Transfer' events
const subscription = uniswapToken.events.Transfer();

// listen to the events
subscription.on('data', console.log);
// ↳ [{...},{...}, ...] live events will be printed in the console
```
