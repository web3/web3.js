# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0-alpha.0]

### Breaking Changes

#### Receipt Status

The receiptInfo Status will now be be an unsigned integer instead of boolean value to comply with the specification.

<https://github.com/ethereum/execution-apis/blob/773ffd230ae5cd037e32415855cf8d4f1e729b2d/src/schemas/receipt.yaml#L94-L97>

<details><summary>1.x</summary>
<p>

```ts
myContract.methods
	.MyMethod()
	.send()
	.on('receipt', receipt => {
		console.log(receipt.status); // true | false
	});
```

</p>
</details>

<details><summary>4.x</summary>
<p>

```ts
myContract.methods
	.MyMethod()
	.send()
	.on('receipt', receipt => {
		console.log(receipt.status); // BigInt(0) | BigInt(1)
	});
```

</p>
</details>

**NOTE:** The unsigned integer type is dependent on the data format you specified. Default type is `bigint`.

#### Deploy ’sending’ and `sent` event will fire only the params

In 1.x when following was executed `deploy().send().on(‘sending’, payload => {})`. The `payload` was the complete the JSON-RPC Payload. In 4.x it will just be the transaction which is about to be transmitted. Earlier it was accessible by from `payload.params[0]`, now will be available directly to event handler.

<details><summary>1.x</summary>
<p>

```ts
myContract
	.deploy()
	.send()
	.on('send', payload => {
		console.log(payload);
		// {id: <1>, jsonrpc: '2.0', method: 'eth_sendTransaction', params: [txObject] }
	});
```

</p>
</details>

<details><summary>4.x</summary>
<p>

```ts
myContract
	.deploy()
	.send()
	.on('send', txObject => {
		console.log(txObject);
		// {id: <>, gas: <>,...}
	});
```

</p>
</details>

#### Deploy ’confirmations’ handler will be invoked with object

In 1.x, the `confirmations` handler was invoked with multiple parameters. But in `4.x` there will be one parameter as object but with all the same properties.

<details><summary>1.x</summary>
<p>

```ts
myContract .send().on(‘confirmation’, (confirmations: number, receipt: object, latestBlockHash: string) => {})`
```

</p>
</details>

<details><summary>4.x</summary>
<p>

```ts
myContract .send().on(‘confirmation’, ({confirmations: bigint, receipt: object, latestBlockHash: string}) => {})`
```

</p>
</details>

#### Strict validation for `encodeABI`

`encodeABI` now have strict validation for the ABI types. It's not limited to mentioned use cases below , but applied in general. Some use cases are:

-   Earlier a `byte32` ABI type was successfully encoded even providing less bytes as input. Now it will throw error.
-   Earlier a `byte32` ABI type was successfully encoded even with an empty bytes. Now it will throw error.

#### Different error message for creating object without `new` keyword

The error message will be different if you try to create a contract object without a `new` keyword.

<details><summary>1.x</summary>
<p>

```ts
Please use the "new" keyword to instantiate a web3.eth.Contract() object!
```

</p>
</details>

<details><summary>4.x</summary>
<p>

```ts
Class constructor ContractBuilder cannot be invoked without 'new'
```

</p>
</details>

#### No warning message when `toBlock` passed to event subscription

In `1.x` if you pass the `toBlock` as event options you would get a warning message.

> Invalid option: toBlock. Use getPastEvents for specific range.

In `4.x` you will not get any warning. But `toBlock` still have no effect.

#### The contract `send` method will now resolve with the `receipt` object

In `1.x` the contract `.send` method was always resolved with `transactionHash`. That enforces user to make an extra call to get any further information. In `4.x` the `.send` function will resolve with `receipt` object.

<details><summary>1.x</summary>
<p>

```ts
const transactionHash = await myContract.method.MyMethod().send();
```

</p>
</details>

<details><summary>4.x</summary>
<p>

```ts
const receipt = await myContract.method.MyMethod().send();
const transactionHash = receipt.transactionHash;
```

</p>
</details>
