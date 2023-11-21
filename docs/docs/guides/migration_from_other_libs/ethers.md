---
sidebar_position: 1
sidebar_label: 'Migration from ethers.js'
title: 'Migration from ethers.js'
---

Follow this guide, if you're currently using the ethers.js library to interact with the Ethereum blockchain and want to migrate to web3.js. This guide is for ethers v5 and v6. And, if there are differences, code for both would be provided. And, if you find something missing, or worth adding, feel free to open a PR, please.

However, migrating from a library to another would usually need careful changes. But, ethers.js have lots of similarities with web3.js and migration would usually be easy and straightforward. However, you still need to check your code for possible tweaks as needed.

## Installation

First, install the latest version of web3.js:

```bash
npm install web3
```

## Providers

### Initialization and Calling RPC Methods

With ethers.js, you would get the last block number from a provider like this:

```typescript
import { ethers } from 'ethers';

// in v5:
const provider = new ethers.providers.JsonRpcProvider(url);

// in v6:
const provider = new ethers.JsonRpcProvider(url);

const blockNumber = provider.getBlockNumber();

// outputs something like: 18561956
blockNumber.then(console.log);
```

With web3.js, you would get the last block number from a provider like this:

```typescript
import { Web3 } from 'web3';

const web3 = new Web3(url);
const blockNumber = web3.eth.getBlockNumber();

// outputs something like: 18561956n
blockNumber.then(console.log);
```

:::tip
📝 web3.js uses `bigint` as the default type for all big numbers returned. For, this you see above the blocknumber has the `n` at its end (`18561956n`). However, you can change the returned type by passing an optional parameter like: 
```ts
import { Web3, DEFAULT_RETURN_FORMAT, FMT_NUMBER } from 'web3';

const blockNumber = web3.eth.getBlockNumber({
  ...DEFAULT_RETURN_FORMAT,
  number: FMT_NUMBER.HEX, // to get the block number in hex format
});
// outputs something like: 0x11B3BA4
blockNumber.then(console.log);


const blockNumber = web3.eth.getBlockNumber({
  ...DEFAULT_RETURN_FORMAT,
  number: FMT_NUMBER.STR, // to get the block number as a string
});
// the value would like: '18561956'
blockNumber.then(console.log);
```
:::

### Use browser-injected provider

With ethers.js:

```typescript
// in v5
const provider = new ethers.providers.Web3Provider(window.ethereum);

// in v6
const provider = new ethers.BrowserProvider(window.ethereum);
```

With web3.js:

```typescript
const web3 = new Web3(window.ethereum);
```


## Wallets and Accounts

### Generate Private Key

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
### Create a wallet

In ethers.js:

```typescript
const wallet = new ethers.Wallet(
  // A private key that you might had generated with:
  // ethers.Wallet.createRandom().privateKey
  privateKey,
);

// outputs: 0x6f7D735dFB514AA1778E8D97EaCE72BfECE71865
console.log(wallet.address);
```

With web3.js:

```typescript
const web3 = new Web3();
const wallet = web3.eth.accounts.wallet.add(
  // you can generate a private key using web3.eth.accounts.create().privateKey
  privateKey,
);

// outputs: 0x6f7D735dFB514AA1778E8D97EaCE72BfECE71865
console.log(wallet[0].address);
```

:::info
  In  web3.js, if you want to use a private key to later sign and send transactions, you first need to add this private key to the accounts with, for example, one of the methods:
  `web3.eth.accounts.create()`, or `web3.eth.accounts.wallet.add(privateKey)`.
  
  And then whenever you provide the public address of that private key, web3.js will use that private key to sign. For example, you would pass the public key at `web3.eth.sendTransaction({from: publicAddress,...})` and web3.`eth.signTransaction({from: publicAddress,...})` then the privateKey of that publicAddress will be lookup and used to sign.

  However, it is not advised to use the privatekey directly. And you are advised to use a secret storage or a vault instead.
:::

### Get unlocked account

With ethers.js:

```typescript
const signer = await provider.getSigner();
```

With web3.js:

```typescript
const account = (await web3.eth.getAccounts())[0];
```


### Signing a string message

with ethers.js:

```typescript
const signer = new ethers.Wallet(privateKey);

const signature = await signer.signMessage('Some data');
// Outputs something like:
// 0xb475e02218d7d6a16f3575de789996d0a57f900f240d73ed792672256d63913840c1da0dd3e7fe2e79485b7a1d81e8cc163f405c3df22d496f28f1dd148faebf1b
console.log(signature);

```

With web3.js:

```typescript

// Sign with web3.js, using a private key:
const signature = web3.eth.accounts.sign('Some data', privateKey).signature;

// Outputs something like:
// 0xb475e02218d7d6a16f3575de789996d0a57f900f240d73ed792672256d63913840c1da0dd3e7fe2e79485b7a1d81e8cc163f405c3df22d496f28f1dd148faebf1b
console.log(signature);

// Sign using an account managed by the connected provider (for example the RPC client or a browser-injected provider)
const signature = await web3.eth.sign(
  web3.utils.utf8ToHex('Some data'), // data to be signed (4.x only supports Hex Strings)
  '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4', // the address that its private key would be used to sign
);

// Outputs something like:
// 0xb475e02218d7d6a16f3575de789996d0a57f900f240d73ed792672256d63913840c1da0dd3e7fe2e79485b7a1d81e8cc163f405c3df22d496f28f1dd148faebf1b
console.log(signature);
```

## Signing and Sending Transactions

### Sending Transactions

Sending a transaction with ethers.js:

```typescript
const signer = new ethers.Wallet(privateKey, provider);

const tx = await signer.sendTransaction({
  to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
  value: ethers.parseUnits('0.001', 'ether'),
});
console.log(tx);
```

With web3.js:

:::info
The method `web3.eth.sendTransaction` will use the account that you pass the public address at `from` to sign the transaction.

So, the `from` needs to be the public address of a private key that you added previously to the web3.eth.accounts. Or, else, it would pass it to the provider where an unlocked account would be used. 

And for the case when you did not add the private key early, and so the `from` was just passed to the provider. Then if the provider was a browser-injected provider like metamask, for example, it will ask the user to sign. And, if you are using a local dev node as a provider, it should be one of the accounts that were already unlocked at the node. However, note that it is highly risky and not recommended to unlock an account at a production or even a test node.
:::

```typescript
const web3 = new Web3(url);

// The method web3.eth.sendTransaction is helpful if you are using a browser-injected provider like metamask.
// Or, if you are using a local dev node like ganache; and you have some accounts already unlocked at the node.
// And this is how you would get the first unlocked account from a local node (not advised for production or even on test node to use unlock accounts on the node).
const account = (await web3.eth.getAccounts())[0];

// Alternative to the above, here is how to add wallet to be used as a signer later:
const wallet = web3.eth.accounts.wallet.add(privateKey);
const account = wallet[0].address;

const tx = await web3.eth.sendTransaction({
  from: account,
  to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
  value: web3.utils.toWei('0.00000000001', 'ether'),
});
console.log(tx);
```

### Sending a Signed Transactions

Posting a signed transaction to the node with ethers.js:

```typescript
// in v5
provider.sendTransaction(signedTx)

// in v6
provider.broadcastTransaction(signedTx);
```

With web3.js:

```typescript
const transaction: Transaction = {
  from: senderPublicAddress,
  to: receiverPublicAddress,
  value: 1,
  gas: 21000,
  type: 0,
};

// you might also use below `web3.eth.personal.signMessage`, depending on your use case.
const signedTransaction = await web3.eth.accounts.signTransaction(
  transaction,
  privateKey,
);

const tx = await web3.eth.sendSignedTransaction(
  signedTransaction.rawTransaction,
);

console.log(tx);
```



## Contracts

### Contracts Deployment

To deploy a contract in ethers.js you might have something like:

```typescript
const signer = provider.getSigner();
const factory = new ethers.ContractFactory(abi, bytecode, signer);
const contract = await factory.deploy("constructor param");
console.log('contract address', contract.address);

// wait for contract creation transaction to be mined
await contract.deployTransaction.wait();
```

In web3.js:

```typescript
const contractObject = new web3.eth.Contract(abi);
const deployedContract = await contractObject.deploy({
    data: bytecode,
    arguments: ["constructor param"]
}).send({
    from: "0x12598d2Fd88B420ED571beFDA8dD112624B5E730",
    gas: '1000000',
    // other transaction's params
});

console.log('contract address', deployedContract.options.address) 
```

:::tip
📝 To get the smart contract ABI, you are advised to check: [Compile the Solidity code using the Solidity Compiler and get its ABI and Bytecode](/guides/smart_contracts/deploying_and_interacting_with_smart_contracts#step-4-compile-the-solidity-code-using-the-solidity-compiler-and-get-its-abi-and-bytecode) and [Infer Contract Types from JSON Artifact](/guides/smart_contracts/infer_contract_types_guide/) 
:::


### Calling Contracts' Methods

To interact with contracts in ethers.js:

```typescript
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, providerOrSigner);
const result = await contract.someFunction();
```

In web3.js:

```typescript
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

// If the method was only to read form the Blockchain: 
const result = await contract.methods.someFunction().call();
// Or, if the method would need a transaction to be sent: 
const result = await contract.methods.someFunction().send();
```

#### Contracts Overloaded Methods

In ethers.js:

```typescript
// ethers
const abi = [
  "function getMessage(string) public view returns (string)",
  "function getMessage() public view returns (string)"
]
const contract = new ethers.Contract(address, abi, signer);

// for ambiguous functions (two functions with the same
// name), the signature must also be specified
message = await contract['getMessage(string)']('nice');
// and to call the overladed method without a parameter:
message = await contract['getMessage()']();

// in v6
contract.foo(Typed.string('nice'))
```

In web3.js:

```typescript
// in web3.js the overloaded method implementation is automatically picked based on the passed datatype 
message = await contract.methods.getMessage('nice').call();
// To call the overladed method without a parameter:
message = await contract.methods.getMessage().call();
```

### Gas Estimation

To interact with contracts in ethers.js:

```typescript
// Estimate the gas
contract.myMethod.estimateGas(123)
```

In web3.js:

```typescript
// Estimate the gas
const gasAmount = await myContract.methods.myMethod(123).estimateGas(
  { gas: 5000000, from: transactionSenderAddress } // optional 
);
```


### Handling Events

Handling events with ethers.js:

```typescript
contract.on('SomeEvent', (arg1, arg2, event) => {
  // event handling
});
```

With web3.js:

```typescript
const event = contract.events.SomeEvent({
  filter: {
    filter: { val: 100 },
  },
  fromBlock: 0,
});

event.on('data', resolve);
event.on('error', reject);
```


## Utility methods

### Hashing
Here is how to compute `keccak256` hash of a UTF-8 string with web3 and ethers.


With ethers.js:

```typescript
// hash of a string
ethers.utils.id('hello world')
// hash of binary data
ethers.utils.keccak256('0x4242')
```

With web3.js:

```typescript
// computes the Keccak-256 hash of the input and returns a hexstring:
// the `utils.sha3` accepts: string and Uint8Array 
web3.utils.sha3('hello world');
// the `utils.keccak256` accepts: string, Uint8Array, Numbers and ReadonlyArray<number>
web3.utils.keccak256('hello world');
```

### Ethers Conversion

Here is how to convert from and to ether units.

With ethers.js:

```typescript
const fromWieToEther = ethers.formatEther('1000000000000000000');
// outputs: 1.0
console.log(fromWieToEther);

const fromEtherToWie = ethers.parseEther('1.0');
// outputs: 1000000000000000000n
console.log(fromEtherToWie);
```

With web3.js:

```typescript
// the second parameter is "the unit to convert to"
const fromWieToEther = Web3.utils.fromWei('1000000000000000000', 'ether');
// outputs: 1
console.log(fromWieToEther);

// the second parameter is "the unit of the number passed"
const fromEtherToWie = Web3.utils.toWei('1.0', 'ether');
// outputs: 1000000000000000000
console.log(fromEtherToWie);
```

## Conclusion

This guide should provide a starting point for migrating from ethers.js to web3.js version 4.x. Remember to adapt the example code to your actual use case and verify the function arguments and setup as you migrate your application. And the official documentation of web3.js is your go-to resource for detailed information and updates.
