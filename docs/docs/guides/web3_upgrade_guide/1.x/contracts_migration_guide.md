---
sidebar_position: 4
sidebar_label: web3.eth.Contract
---

# web3.eth.Contract Migration Guide

## Breaking Changes

### Receipt Status

The `receipt.status` will now be an `unsigned integer` instead of `boolean` value to comply with the specification.

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

:::note
The `unsigned integer` type is dependent on the data format you specified. Default type is `BigInt`.
:::

### Deploy `sending` and `sent` event will fire only the params

In 1.x, when following was executed `deploy().send().on(‘sending’, payload => {})`. The `payload` was the complete the JSON-RPC Payload. In 4.x, it will just be the transaction which is about to be transmitted. Earlier it was accessible by from `payload.params[0]`, now will be available directly to event handler.

```ts
// 1.x
myContract
	.deploy()
	.send()
	.on('send', payload => {
		console.log(payload);
		// {id: <1>, jsonrpc: '2.0', method: 'eth_sendTransaction', params: [txObject] }
	});

// 4.x
myContract
	.deploy()
	.send()
	.on('send', txObject => {
		console.log(txObject);
		// {id: <>, gas: <>,...}
	});
```

### Deploy ’confirmations’ handler will be invoked with object

In 1.x, the `confirmations` handler was invoked with multiple parameters. But in 4.x there will be one parameter as object but with all the same properties.

```ts
//1.x
myContract .send().on(‘confirmation’, (confirmations: number, receipt: object, latestBlockHash: string) => {})

//4.x
myContract .send().on(‘confirmation’, ({confirmations: bigint, receipt: object, latestBlockHash: string}) => {})
```

### Strict validation for `encodeABI`

`encodeABI` now has strict validation for the ABI types. It's not limited to the mentioned use cases below, but applied in general. Some use cases are:

-   Earlier a `byte32` ABI type was successfully encoded even providing less bytes as input. Now it will throw an error.
-   Earlier a `byte32` ABI type was successfully encoded even with an empty bytes. Now it will throw an error.

### Different error message for creating object without `new` keyword

The error message will be different if you try to create a contract object without a `new` keyword.

```ts
// 1.x
const contract = Contract(jsonInterface, address);
// Please use the "new" keyword to instantiate a web3.eth.Contract() object!

// 4.x
const contract = Contract(jsonInterface, address);
// Class constructor ContractBuilder cannot be invoked without 'new'
```

### No warning message when `toBlock` passed to event subscription

In 1.x, if you pass the `toBlock` as event options you would get a warning message:

> Invalid option: toBlock. Use getPastEvents for specific range.

In 4.x, you will not get any warning but `toBlock` will still have no effect.

### The contract `send` method will now resolve with the `receipt` object

In 1.x, the contract `.send` method was always resolved with `transactionHash`. That enforces the user to make an extra call to get any further information. In 4.x the `.send` function will resolve with `receipt` object.

```ts
// 1.x
const transactionHash = await myContract.method.MyMethod().send();

// 4.x
const receipt = await myContract.method.MyMethod().send();
const transactionHash = receipt.transactionHash;
```

### `BigInt` is used when decoding functions' and events' parameters

In 1.x, decoded functions' and events' parameters were of type `string`. In 4.x, the `BigInt` type is used instead.

```ts
// Events
// 1.x
instance.events.BasicEvent().on('data', function (event) {
	console.log(event);
});

await instance.methods.firesEvent(acc, 1).send();
/**
{	address: '0x607A075cB7710AA8544c4E0F929e344Bf91AB631',
 	blockHash: ..,
	blockNumber: 9, logIndex: 0, removed: false, transactionHash: ..., transactionIndex: 0,
	returnValues: {0: '0xd0731FAE14781104c42B8914b4cc6634b6038daC', 1: '1', addr: '0xd0731FAE14781104c42B8914b4cc6634b6038daC', val: '1'} // Note the value of val
	,event: 'BasicEvent', signature: ..., raw: ...}
*/

//4.x
instance.events
	.MultiValueIndexedEvent({
		filter: { val: 100 },
	})
	.on('data', console.log);
await instance.methods.firesMultiValueIndexedEvent('value', 100, true).send(sendOptions);
/**
 * {
        address: '0x0c1b54fb6fdf63dee15e65cadba8f2e028e26bd0',
        topics: [
          '0x553c4a49a36d26504ba0880f2f9bfe9ac7db4b81a893bde296546cd96ae0b33c',
          '0x0000000000000000000000000000000000000000000000000000000000000064',
          '0x0000000000000000000000000000000000000000000000000000000000000001'
        ],
        data: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000576616c7565000000000000000000000000000000000000000000000000000000',
        blockNumber: 23n,
        transactionHash: '0xf7e56f38b0f75c0926862ef4195df779003a0e960162a65b214c40232ba17925',
        transactionIndex: 0n,
        blockHash: '0x15a77129afdcec739924c58fb3aba456428d8c3f5d181af559d50458d468eb33',
        logIndex: 0n,
        removed: false,
        returnValues: {
          '0': 'value',
          '1': 100n,
          '2': true,
          __length__: 3,
          str: 'value',
          val: 100n, //Note that a BigInt is returned
          flag: true
        },
        event: 'MultiValueIndexedEvent',
        signature: '0x553c4a49a36d26504ba0880f2f9bfe9ac7db4b81a893bde296546cd96ae0b33c',
        raw: ...
	      }
*/

// Functions
//1.x
await instance.methods.setValue(1).send();
var value = await instance.methods.getValue().call();
console.log(value);
// > '1'

//4.x
await instance.methods.setValue(10).send();
var value = await instance.methods.getValue().call();
console.log(value);
// 10n // Note that a BigInt is returned
```
