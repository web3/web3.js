---
slug: /
sidebar_position: 2
sidebar_label: Quickstart
---

# Quickstart

## Installation

If NPM is being used as package manager, use the following for installing the web3.js library. 

```
npm i web3
```

For installing using yarn package manager:

```
yarn add web3
```

Note: Installing web3.js in this way will bring in all web3.js sub-packages, if you only need specific packages, it is recommended to install the specific required packages (e.g, if you want the contract package `npm i web3-eth-contract` instead) 

## Importing Web3.js

Web3.js v4 supports both CJS ( CommonJS ) and native ESM module imports. For importing the main Web3 class in CJS you can use:

``` js
const { Web3 } = require('web3');
```

and for ESM style imports, you can use:

``` ts
import { Web3 } from 'web3';
```

## Initialize `Web3` with a provider

Web3.js is in compliance with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) so any EIP-1193 provider can be injected in web3.js . There are HTTP, WebSocket and IPC providers also available as web3.js packages for using.

:::warning
You must initialize the `Web3` object with a provider, otherwise, you won't be able to fully use web3.js functionalities. Here is an example of creating a `web3` instance with an HTTP provider:
:::

``` ts
import { Web3 } from 'web3';

//private RPC endpoint 
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_ID'); 

//or public RPC endpoint
//const web3 = new Web3('https://eth.llamarpc.com'); 

web3.eth.getBlockNumber().then(console.log);
// ↳ 18849658n
```
## Querying the blockchain

After instantiating the `web3` instance with a `new Web3 provider`, we can access the `web3.eth` package to fetch data from the blockchain:

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

## Setting up a wallet

If you want to write data/interact with contracts or send transactions on the blockchain, you must have an account with funds to cover the gas fees.

The object `Wallet` is an array of accounts, it will allow you to hold several accounts from which you can send transactions `web3.eth.sendTransaction` or interact with contract objects `web3.eth.contract.methods.contractfunction().send()`, when you perform these actions, the `Wallet` object uses the account/s it holds to send the transactions.

### Create random wallet

```ts
//create random wallet with 1 account
web3.eth.accounts.wallet.create(1)
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

### Add a private key to create a wallet

```ts
//the private key must start with the '0x' prefix
const account = web3.eth.accounts.wallet.add('0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec');

console.log(account[0].address);
//↳ 0xcE6A5235d6033341972782a15289277E85E5b305

console.log(account[0].privateKey);
//↳ 0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec
```

### Send transactions

```ts title='Sending value'
//add an account to a wallet
const account = web3.eth.accounts.wallet.add('0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec');

//create transaction object to send 1 eth to '0xa32...c94' address from the account[0]
const tx = 
{ 
    from: account[0].address,
    to: '0xa3286628134bad128faeef82f44e99aa64085c94', 
    value: web3.utils.toWei('1', 'ether')
};
//the `from` address must match the one previously added with wallet.add

//send the transaction
const txReceipt = await web3.eth.sendTransaction(tx);

console.log('Tx hash:', txReceipt.transactionHash)
// ↳ Tx hash: 0x03c844b069646e08af1b6f31519a36e3e08452b198ef9f6ce0f0ccafd5e3ae0e
```

## Interact with smart contracts

### Instantiate a contract

The first step to interact with a contract is to instantiate the contract, for which we will need the ABI and the address of the contract

```ts
//Uniswap token address in mainnet
const address = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'

//you can find the complete ABI in etherscan.io
const ABI = 
[
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

//instantiate the contract
const uniswapToken = new web3.eth.Contract(abi, address);
```

### Read-methods

```ts
//make the call to the contract
const symbol = await uniswapToken.methods.symbol().call();

console.log('Uniswap symbol:',symbol);
// ↳ Uniswap symbol: UNI

//make the call to the contract
const totalSupply = await uniswapToken.methods.totalSupply().call();

console.log('Uniswap Total supply:', totalSupply);
// ↳ Uniswap Total Supply: 1000000000000000000000000000n

//use web3 utils to format the units
console.log(web3.utils.fromWei(totalSupply, 'ether'))
// ↳ 1000000000
```

### Writing-methods

```ts
//address to send the token
const to = '0xcf185f2F3Fe19D82bFdcee59E3330FD7ba5f27ce';

//value to transfer (1 with 18 decimals)
const value = web3.utils.toWei('1','ether');

//send the transaction => return the Tx receipt
const txReceipt = await uniswapToken.methods.transfer(to,value).send({from: account[0].address});

console.log('Tx hash:',txReceipt.transactionHash);
// ↳ Tx hash: 0x14273c2b5781cc8f1687906c68bfc93482c603026d01b4fd37a04adb6217ad43
```

### Query past events

```ts
//get past `Transfer` events from block 18850576
const eventTransfer = await uniswapToken.getPastEvents('Transfer', { fromBlock: 18850576 });

console.log(eventTransfer);
// ↳ [{...},{...}, ...] array with all the events emitted
//you can only query logs from the previous 100_000 blocks 
```

### Listening to live events

:::warning
You MUST initialize the `Web3 provider` with a WebSocket endpoint to subscribe to live events
:::

```ts
import { Web3 } from 'web3';

//WebSocket provider
const web3 = new Web3('wss://ethereum.publicnode.com');

//instantiate contract
const uniswapToken = new web3.eth.Contract(abi, address)

//create the subcription to all the 'Transfer' events
const subscription = uniswapToken.events.Transfer();

//listen to the events
subscription.on('data',console.log);
// ↳ [{...},{...}, ...] live events will be printed in the console
```