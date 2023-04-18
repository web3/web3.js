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

## [4.0.1-alpha.1]

### Added

-   Decoding error data, using Error ABI if available, according to EIP-838. (#5434)
-   The class `Web3ContractError` is moved from this package to `web3-error`. (#5434)

### Fixed

-   According to the latest change in `web3-eth-abi`, the decoded values of the large numbers, returned from function calls or events, are now available as `BigInt`. (#5435)

## [4.0.1-alpha.2]

### Added

-   Decoding error data, using Error ABI if available, if error was returned from a smart contract function call (#5662).
-   `SpecialOutput` type was added as a generic type into the call function to support reassigning output types (#5631)
-   Overloaded functions types (`ContractOverloadedMethodInputs`, `ContractOverloadedMethodOutputs`) was added (#5631)

### Fixed

-   Emit past contract events based on `fromBlock` when passed to `contract.events.someEventName` (#5201)
-   Use different types for `ContractOptions` -> `jsonInterface` setter and getter (#5474)
-   An issue within the `Contract` constructor where `provider` wasn't being set when provided within the `optionsOrContextOrReturnFormat` argument (#5669)

## [4.0.1-alpha.3]

### Changed

-   Updated dependencies (#5725)

## [4.0.1-alpha.4]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)

## [4.0.1-alpha.5]

### Changed

-   web3.js dependencies (#5757)

## [4.0.1-rc.0]

### Fixed

-   Fix contract defaults (#5756)
-   Fixed getPastEventsError (#5819)

### Changed

-   Update imports statements for objects that was moved between web3 packages (#5771)

### Added

-   Added functionality of `createAccessList` for contracts ( #5780 )
-   An instance of `Contract` will `subscribeToContextEvents` upon instantiation if `syncWithContext` is set to `true` and the constructor is passed an instance of `Web3Context` (#5833)
-   Added support of `safe` and `finalized` block tags (#5823)

### Removed

-   `decodeErrorData` is no longer exported (method was moved to `web3-eth-abi` and renamed `decodeContractErrorData`) (#5844)

## [Unreleased]

### Added

-   `input` is now an acceptable property for `ContractInitOptions` in place of `data` (either can be used, but `input` is used withing the `Contract` class) (#5915)
-   Added source files (#5956)
-   Added hybrid build (ESM and CJS) of library (#5904)

### Changed

-   `getSendTxParams` will now return `input` instead of `data` in returned transaction parameters object (#5915)
-   `Contract` constructor will now thrown new `ContractTransactionDataAndInputError` if both `data` and `input` are passed in `ContractInitOptions` for `Contract` constructor (#5915)
-   The types `ContractInitOptions`, `NonPayableCallOptions` and `PayableCallOptions` are moved to `web3-types`. (#5993)

### Removed

-   `data` was removed as a property of `ContractOptions` type (#5915)
