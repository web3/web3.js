---
sidebar_position: 1
sidebar_label: 'Migration from ethers.js'
title: 'Migration from ethers.js'
---

Follow this guide, if you're currently using the ethers.js library to interact with the Ethereum blockchain and want to migrate to web3.js.

However, migrating from a library to another would usually need careful changes. But, ethers.js have lots of similarities with web3.js and migration would usually be easy and straightforward. However, you still need to check your code for possible tweaks as needed.

## Installation

First, install the latest version of web3.js:

```bash
npm install web3
```

## Initialization and getting the last block number

With ethers.js, you would initialize like:

```typescript
import { ethers } from 'ethers';

async function getBlockNumber() {
	const provider = new ethers.JsonRpcProvider(
		'https://mainnet.infura.io/v3/ec907b4a35c64ea1852711ba1cd42415',
	);
	const ts = provider.getBlockNumber();
	ts.then(console.log);
}
// outputs something like: 18561956n
getBlockNumber();
```

With web3.js v4:

```typescript
import { Web3 } from 'web3';

async function getBlockNumber() {
	const web3 = new Web3('https://mainnet.infura.io/v3/ec907b4a35c64ea1852711ba1cd42415');
	const ts = web3.eth.getBlockNumber();
	ts.then(console.log);
}
// outputs something like: 18561956
getBlockNumber();
```

## Use browser-injected provider

With ethers.js:

```typescript
// v5
provider = new ethers.providers.Web3Provider(window.ethereum);

// v6:
provider = new ethers.BrowserProvider(window.ethereum);
```

With web3.js:

```typescript
const web3 = new Web3(window.ethereum);
```

## Generate Private Key

With ethers.js:

```typescript
// this would generate a private key similar to:
//  '0x286f65c4191759fc5c7e6083b8c275ac2238cc7abb5915bd8c905ae4404215c9'
// (Be sure to store it encrypted in a safe place)
const privateKey = ethers.Wallet.createRandom().privateKey;
```

With web3.js:

```typescript
// this would generate a private key similar to:
//  '0x286f65c4191759fc5c7e6083b8c275ac2238cc7abb5915bd8c905ae4404215c9'
// (Be sure to store it encrypted in a safe place)
const privateKey = web3.eth.accounts.create().privateKey;
```

## Wallets and Accounts

### Create a wallet

In ethers.js:

```typescript
async function createWallet() {
	const wallet = new ethers.Wallet(
		// A private key that you might had generated with:
		//  ethers.Wallet.createRandom().privateKey
		privateKey,
	);

	console.log(wallet.address);
}
// outputs: 0x6f7D735dFB514AA1778E8D97EaCE72BfECE71865
createWallet();
```

In web3.js:

```typescript
async function createWallet() {
	const web3 = new Web3();
	const wallet = web3.eth.accounts.wallet.add(
		// you can generate a private key using web3.eth.accounts.create().privateKey
		privateKey,
	);

	console.log(wallet[0].address);
}
// outputs: 0x6f7D735dFB514AA1778E8D97EaCE72BfECE71865
createWallet();
```

### Get unlocked account

In ethers.js:

```typescript
const signer = await provider.getSigner();
```

In web3.js:

```typescript
const account = (await web3.eth.getAccounts())[0];
```


## Sending Transactions

Sending a transaction with ethers.js:

```typescript
async function sendTransaction() {
  const signer = new ethers.Wallet(privateKey, provider);

  const tx = await signer.sendTransaction({
    to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
    value: ethers.parseUnits('0.001', 'ether'),
  });
  console.log(tx);
}

sendTransaction();
```

In web3.js v4:

The method web3.eth.sendTransaction is helpful if you are using a browser-injected provider like metamask. Or, if you are using a local dev node, and you have some accounts already unlocked at the node. Note that it is highly risky and not recommended to unlock an account at a production or even a test node.

```typescript
async function sendTransaction() {
	const web3 = new Web3('http://localhost:8545');

	// The method web3.eth.sendTransaction is helpful if you are using a browser-injected provider like metamask.
	//  Or, if you are using a local dev node like ganache; and you have some accounts already unlocked at the node.
	//  And this is how you would get the first unlocked account from a local node (not advised for production or even on test node to use unlock accounts on the node).
	const account = (await web3.eth.getAccounts())[0];

	const tx = await web3.eth.sendTransaction({
		from: account,
		to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
		value: web3.utils.toWei('0.00000000001', 'ether'),
	});
	console.log(tx);
}

sendTransaction();
```

## Sending a Signed Transactions

Posting a signed transaction to the node with ethers.js:

```typescript
// v5
// provider.sendTransaction(signedTx)

// v6
provider.broadcastTransaction(signedTx);
```

In web3.js v4:

```typescript
async function sendSignedTransaction() {
  const transaction: Transaction = {
    from: senderPublicAddress,
    to: receiverPublicAddress,
    value: 1,
    gas: 21000,
    type: 1,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transaction,
    privateKey,
  );
  const tx = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction,
  );

  console.log(tx);
}

sendTransaction();
```

### Signing a string message
with ethers.js:

```typescript
signature = await signer.signMessage('Some data')
```

In web3.js v4:

```typescript

// web3 (using a private key)
const signature = web3.eth.accounts.sign('Some data', privateKey).signature;

// Using an unlocked account managed by connected RPC client or a browser-injected provider
const signature = await web3.eth.sign(
    web3.utils.utf8ToHex('Some data'), // data to be signed (4.x only supports Hex Strings)
    '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe' // the address that its private key would be used to sign
  );
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
