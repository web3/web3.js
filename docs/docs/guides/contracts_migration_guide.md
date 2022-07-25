---
sidebar_position: 4
sidebar_label: Web3.eth.Contract
---

# Web3.eth.Contract Migration Guide

### Breaking Changes

#### Receipt Status

The receiptInfo Status will now be be an unsigned integer instead of boolean value to comply with the specification.

```ts
// in 1.x
myContract.methods
	.MyMethod()
	.send()
	.on('receipt', receipt => {
		console.log(receipt.status); // true | false
	});

// in 4.x
myContract.methods
	.MyMethod()
	.send()
	.on('receipt', receipt => {
		console.log(receipt.status); // BigInt(0) | BigInt(1)
	});
```

**NOTE:** The unsigned integer type is dependent on the data format you specified. Default type is `bigint`.

#### Deploy ’sending’ and `sent` event will fire only the params

In 1.x when following was executed `deploy().send().on(‘sending’, payload => {})`. The `payload` was the complete the JSON-RPC Payload. In 4.x it will just be the transaction which is about to be transmitted. Earlier it was accessible by from `payload.params[0]`, now will be available directly to event handler.

```ts
//1.x
myContract
	.deploy()
	.send()
	.on('send', payload => {
		console.log(payload);
		// {id: <1>, jsonrpc: '2.0', method: 'eth_sendTransaction', params: [txObject] }
	});

//4.x
myContract
	.deploy()
	.send()
	.on('send', txObject => {
		console.log(txObject);
		// {id: <>, gas: <>,...}
	});
```

#### Deploy ’confirmations’ handler will be invoked with object

In 1.x, the `confirmations` handler was invoked with multiple parameters. But in `4.x` there will be one parameter as object but with all the same properties.

```ts
//1.x
myContract .send().on(‘confirmation’, (confirmations: number, receipt: object, latestBlockHash: string) => {})

//4.x
myContract .send().on(‘confirmation’, ({confirmations: bigint, receipt: object, latestBlockHash: string}) => {})
```

#### Strict validation for `encodeABI`

`encodeABI` now have strict validation for the ABI types. It's not limited to mentioned use cases below , but applied in general. Some use cases are:

-   Earlier a `byte32` ABI type was successfully encoded even providing less bytes as input. Now it will throw error.
-   Earlier a `byte32` ABI type was successfully encoded even with an empty bytes. Now it will throw error.

#### Different error message for creating object without `new` keyword

The error message will be different if you try to create a contract object without a `new` keyword.

```ts
//1.x
Please use the "new" keyword to instantiate a web3.eth.Contract() object!

//4.x
Class constructor ContractBuilder cannot be invoked without 'new'
```

#### No warning message when `toBlock` passed to event subscription

In `1.x` if you pass the `toBlock` as event options you would get a warning message.

> Invalid option: toBlock. Use getPastEvents for specific range.

In `4.x` you will not get any warning. But `toBlock` still have no effect.

#### The contract `send` method will now resolve with the `receipt` object

In `1.x` the contract `.send` method was always resolved with `transactionHash`. That enforces user to make an extra call to get any further information. In `4.x` the `.send` function will resolve with `receipt` object.

```ts
//1.x
const transactionHash = await myContract.method.MyMethod().send();

//4.x
const receipt = await myContract.method.MyMethod().send();
const transactionHash = receipt.transactionHash;
```
