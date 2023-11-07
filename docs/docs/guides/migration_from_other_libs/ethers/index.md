---
sidebar_position: 1
sidebar_label: 'Migration from ethers.js'
title: 'Migration from ethers.js'
---

**[This is still a draft document]**

If you're currently using the ethers.js library to interact with the Ethereum blockchain and want to migrate to web3.js version 4, follow this guide.

However, migrating from a library to another would usually need careful changes. But, ethers.js have lots of similarities with web3.js and migration would usually be easy and strate forward. However, you still need to check your code for possible tweaks if needed.  

## Installation

First, install the latest version of web3.js:

```bash
npm install web3
```

## Initialization

With ethers.js, you would initialize like:

```typescript 
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_KEY');
```

With web3.js v4:

```typescript
import { Web3 } from 'web3';

const web3 = new Web3('https://rinkeby.infura.io/v3/YOUR_INFURA_KEY');
```


## Fast takes **(needs review)**

1. Replace all instances of `ethers` with `Web3`
2. Replace all instances of `ethers.providers` with `Web3.providers`
3. Replace all instances of `ethers.utils` with `Web3.utils`
4. Replace all instances of `ethers.Contract` with `Web3.eth.Contract`
5. Replace all instances of `ethers.Wallet` with `Web3.eth.accounts.wallet`
6. Replace all instances of `ethers.Signer` with `Web3.eth.accounts`
7. Replace all instances of `ethers.utils.formatEther` with `Web3.utils.fromWei`
8. Replace all instances of `ethers.utils.parseEther` with `Web3.utils.toWei`


## Wallets and Accounts 

To manage wallets and accounts in ethers.js:

```typescript
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
```

In web3.js v4:

```typescript 
web3.eth.accounts.wallet.add('YOUR_PRIVATE_KEY');
// If you want to use the account for subsequent operations
const account = web3.eth.accounts.wallet[0];
```

## Sending Transactions

Sending a transaction with ethers.js:

```typescript
const tx = await wallet.sendTransaction({
  to: 'RECIPIENT_ADDRESS',
  value: ethers.utils.parseEther('1.0')
});
```

In web3.js v4:

```typescript
const tx = await web3.eth.sendTransaction({
  from: account.address,
  to: 'RECIPIENT_ADDRESS',
  value: web3.utils.toWei('1', 'ether') 
});
```

## Interacting with Contracts

To interact with contracts in ethers.js:

```typescript
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
const result = await contract.someFunction();
```

In web3.js v4:

```typescript
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
const result = await contract.methods.someFunction().call(); 
```

## Handling Events

Handling events with ethers.js:

```typescript
contract.on('SomeEvent', (arg1, arg2, event) => {
  // event handling
});
```

In web3.js v4:

```typescript
const event = contract.events.SomeEvent({
  filter: {
	filter: { val: 100 },
	},
  fromBlock: 0  
});

event.on('data', resolve);
event.on('error', reject);
```

This guide should provide a starting point for migrating from ethers.js to web3.js version 4.x. Remember to adapt the example code to your actual use case and verify the function arguments and setup as you migrate your application. The official documentation of web3.js [documentation](https://docs.web3js.org/) will be your go-to resource for detailed information and updates.
