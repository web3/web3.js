---
sidebar_label: '🔄 Migration to ethers.js'
title: 'Migration from Web3.js to Ethers.js'
position: 17
---

This guide will help you migrate from web3.js to ethers.js for interacting with the Ethereum blockchain. The guide covers ethers.js v6, providing code examples for both libraries.

### Installation

To begin migrating from Web3.js to ethers.js, first install the ethers.js package:

```
npm install ethers@6

```

### Providers Initialization

When migrating from Web3.js to ethers.js, the first step is to update how you connect to the Ethereum network. Both libraries use providers, but their initialization differs.

```typescript
import { Web3 } from 'web3';

// private RPC endpoint
const web3 = new Web3(providerURL);

const blockNumber = await web3.eth.getBlockNumber();
console.log(blockNumber);
```

To migrate this to ethers.js, you'll need to replace it with JsonRpcProvider. Note that ethers.js separates provider types more explicitly:

```typescript
import { ethers } from 'ethers';

// ethers.js v6
const provider = new ethers.JsonRpcProvider(providerURL);

const blockNumber = await provider.getBlockNumber();
console.log(blockNumber);
```

### Browser-injected Provider

When migrating browser wallet connections, you'll need to update how you handle the injected provider (like MetaMask). Here's your existing Web3.js code:

```typescript
const web3 = new Web3(window.ethereum);
```

In ethers.js v6, you'll need to use the BrowserProvider class instead. This provider is specifically designed for browser environments:

```typescript
// in v6
const provider = new ethers.BrowserProvider(window.ethereum);
```

### Wallets and Accounts - Generate Private Key

If your code generates private keys with Web3.js, here's how to migrate that functionality. Your existing Web3.js code:

```typescript
// this would generate a private key similar to:
//  '0x286f65c4191759fc5c7e6083b8c275ac2238cc7abb5915bd8c905ae4404215c9'
// (Be sure to store it encrypted in a safe place)
const privateKey = web3.eth.accounts.create().privateKey;
```

To achieve the same in ethers.js, use the `Wallet.createRandom()` method:

```typescript
// this would generate a private key similar to:
//  '0x286f65c4191759fc5c7e6083b8c275ac2238cc7abb5915bd8c905ae4404215c9'
// (Be sure to store it encrypted in a safe place)
const privateKey = ethers.Wallet.createRandom().privateKey;
```

### Wallets and Accounts - Create a wallet

When migrating wallet creation code, you'll need to change how accounts are added to wallets. Your existing Web3.js code using `wallet.add()`:

```typescript
const web3 = new Web3();
const wallet = web3.eth.accounts.wallet.add(
	// you can generate a private key using web3.eth.accounts.create().privateKey
	privateKey,
);

// outputs: 0x6f7D735dFB514AA1778E8D97EaCE72BfECE71865
console.log(wallet[0].address);
```

In ethers.js, wallet creation uses the Wallet constructor:

```typescript
const wallet = new ethers.Wallet(
	// A private key that you might had generated with:
	ethers.Wallet.createRandom().privateKey,
	// or explicitly given privateKey
);

// outputs: 0x6f7D735dFB514AA1778E8D97EaCE72BfECE71865
console.log(wallet.address);
```

### Get Signer account

When migrating code that gets the current account, you'll need to change from Web3.js's getAccounts():

```typescript
const account = (await web3.eth.getAccounts())[0];
```

To ethers.js's getSigner() method, which returns a signer object instead of just an address:

```typescript
const signer = await provider.getSigner();
```

### Signing

When migrating message signing functionality, you'll need to update from Web3.js's sign methods:

```typescript
// Sign with web3.js, using a private key:
const signature = web3.eth.accounts.sign('Some data', privateKey).signature;

// Sign using an account managed by the connected provider
const signature = await web3.eth.sign(
	web3.utils.utf8ToHex('Some data'), // data to be signed (4.x only supports Hex Strings)
	'0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4', // the address
);
```

In ethers.js, signing is simplified using the signMessage method:

```typescript
const signer = new ethers.Wallet(privateKey);
const signature = await signer.signMessage('Some data');
```

## Signing and Sending Transactions

### Sending Transactions

When migrating transaction sending code, you'll need to update how transactions are signed and sent. Your existing Web3.js code where transactions are signed using an unlocked or added account:

```typescript
const web3 = new Web3(url);

// Add wallet to be used as a signer
const wallet = web3.eth.accounts.wallet.add(givenPrivateKey);
const account = wallet[0].address;

const tx = await web3.eth.sendTransaction({
	from: account,
	to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
	value: web3.utils.toWei('0.00000000001', 'ether'),
});
console.log(tx);
```

In ethers.js, transactions are sent using a signer instance, which combines the private key and provider:

```typescript
const signer = new ethers.Wallet(privateKey, provider);

const tx = await signer.sendTransaction({
	to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
	value: ethers.parseUnits('0.001', 'ether'),
});
console.log(tx);
```

### Sending a Signed Transaction

When migrating code that separates transaction signing and broadcasting, you'll need to update from Web3.js's two-step process:

```typescript
const transaction = {
	from: senderPublicAddress,
	to: receiverPublicAddress,
	value: 1,
	gas: 21000,
};

const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);

const tx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

console.log(tx);
```

In ethers.js, you can broadcast a pre-signed transaction using the provider's broadcastTransaction method:

```typescript
await provider.broadcastTransaction(signedTx);
```

## Contracts

### Contract Deployment

When migrating contract deployment code, you'll need to update from Web3.js's deploy and send pattern:

```typescript
const contract = new web3.eth.Contract(abi);
const deployTx = await contract
	.deploy({
		data: bytecode,
		arguments: ['constructor param'],
	})
	.send({
		from: '0x12598d2Fd88B420ED571beFDA8dD112624B5E730',
		gas: '1000000',
	});

console.log('contract address', deployTx.options.address);
```

In ethers.js, contract deployment uses the ContractFactory class:

```typescript
const signer = await provider.getSigner();
const factory = new ethers.ContractFactory(abi, bytecode, signer);
const contract = await factory.deploy('constructor param');
console.log('contract address', contract.address);

// wait for contract creation transaction to be mined
await contract.deployTransaction.wait();
```

### Contract Method Calls

When migrating contract method calls, you'll need to update from Web3.js's methods object pattern:

```typescript
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

// For read operations
const result = await contract.methods.someFunction().call();

// For write operations
const tx = await contract.methods.someFunction().send();
```

In ethers.js, contract methods are called directly as functions:

```typescript
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
const result = await contract.someFunction();
```

### Contract Events

When migrating event handling code, you'll need to update from Web3.js's events interface:

```typescript
const event = contract.events.SomeEvent({
	filter: { val: 100 },
	fromBlock: 0,
});

event.on('data', resolve);
event.on('error', reject);
```

In ethers.js, event listening is :

```typescript
contract.on('SomeEvent', (arg1, arg2, event) => {
	// event handling
});
```

### Gas Estimation

When migrating gas estimation code, you'll need to update from Web3.js's estimateGas method:

```typescript
const gasAmount = await contract.methods.myMethod(123).estimateGas({
	from: transactionSenderAddress,
});
```

In ethers.js, gas estimation is made through a direct method call:

```typescript
const gasEstimate = await contract.myMethod.estimateGas(123);
```

## Utility methods

### Hashing

When migrating code that computes Keccak-256 hashes, you'll need to update from Web3.js's utility methods:

```typescript
// computes the Keccak-256 hash of the input and returns a hexstring
const hash1 = web3.utils.sha3('hello world');

// alternative keccak256 method with broader input support
const hash2 = web3.utils.keccak256('hello world');
```

In ethers.js, hashing requires explicit conversion of strings to bytes:

```typescript
import { keccak256, toUtf8Bytes } from 'ethers';

const message = 'Hello, World!';
const messageBytes = toUtf8Bytes(message);
const hash = keccak256(messageBytes);
```

### Ether Unit Conversion

When migrating code that converts between ether units, you'll need to update from Web3.js's fromWei and toWei methods:

```typescript
// Convert Wei to Ether
const fromWeiToEther = web3.utils.fromWei('1000000000000000000', 'ether');
// outputs: 1
console.log(fromWeiToEther);

// Convert Ether to Wei
const fromEtherToWei = web3.utils.toWei('1.0', 'ether');
// outputs: 1000000000000000000
console.log(fromEtherToWei);
```

In ethers.js, use formatEther and parseEther for common ether conversions:

```typescript
// Convert Wei to Ether
const fromWeiToEther = ethers.formatEther('1000000000000000000');
// outputs: 1.0
console.log(fromWeiToEther);

// Convert Ether to Wei
const fromEtherToWei = ethers.parseEther('1.0');
// outputs: 1000000000000000000n
console.log(fromEtherToWei);
```
