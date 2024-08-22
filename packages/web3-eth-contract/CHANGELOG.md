# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0-alpha.0]

### Breaking Changes

#### Receipt Status

The receiptInfo Status will now be be an unsigned integer instead of boolean value to comply with the specification.

[https://github.com/ethereum/execution-apis/blob/773ffd230ae5cd037e32415855cf8d4f1e729b2d/src/schemas/receipt.yaml#L94-L97](https://github.com/ethereum/execution-apis/blob/773ffd230ae5cd037e32415855cf8d4f1e729b2d/src/schemas/receipt.yaml#L94-L97)

<details>
<summary>
1.x
</summary>
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

<details><summary>
4.x
</summary>
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

<details><summary>
1.x
</summary>
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

<details><summary>
4.x
</summary>
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

<details><summary>
1.x
</summary>
<p>

```ts
myContract .send().on(‘confirmation’, (confirmations: number, receipt: object, latestBlockHash: string) => {})`
```

</p>
</details>

<details><summary>
4.x
</summary>
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

<details><summary>
1.x
</summary>
<p>

```ts
Please use the "new" keyword to instantiate a web3.eth.Contract() object!
```

</p>
</details>

<details><summary>
4.x
</summary>
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

<details><summary>
1.x
</summary>
<p>

```ts
const transactionHash = await myContract.method.MyMethod().send();
```

</p>
</details>

<details><summary>
4.x
</summary>
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

## [4.0.1-rc.1]

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

## [4.0.1-rc.2]

### Added

-   Added support for `getPastEvents` method to filter `allEvents` and specific event (#6010)
-   Added `maxPriorityFeePerGas` and `maxFeePerGas` in `ContractOptions` type and updated function using it in utils (#6118)
-   Added method's type autodetection by ABI param (#6137)

## [4.0.1]

Release Notes:

Detailed List of change logs are mentioned under previous 4.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [4.0.2]

### Fixed

-   Event filtering using non-indexed and indexed string event arguments (#6167)

## [4.0.3]

### Changed

-   Dependencies updated

## [4.0.4]

### Changed

-   Dependencies updated

## [4.0.5]

### Fixed

-   Fixed bug in `contract.events.allEvents`

### Added

-   In case of error events there will be inner error also available for details

## [4.1.0]

### Added

-   Added `dataInputFill` as a ContractInitOption, allowing users to have the choice using property `data`, `input` or `both` for contract methods to be sent to the RPC provider. (#6355)
-   Added to `Web3Config` property `contractDataInputFill` allowing users to have the choice using property `data`, `input` or `both` for contract methods to be sent to the RPC provider when creating contracts. (#6377)

## [4.1.1]

### Changed

-   The `events` property was added to the `receipt` object (#6410)

## [4.1.2]

### Changed

-   Dependencies updated

## [4.1.3]

### Fixed

-   Will populate `data` for transactions in contract for metamask provider instead of `input` (#6534)

## [4.1.4]

### Changed

-   By default, contracts will fill `data` instead of `input` within method calls (#6622)

## [4.2.0]

### Changed

-   Allow the `deploy` function to accept parameters, even when no ABI was provided to the `Contract`(#6635)

### Fixed

-   Fix and error that happen when trying to get past events by calling `contract.getPastEvents` or `contract.events.allEvents()`, if there is no matching events. (#6647)
-   Fixed: The Contract is not using the context wallet passed if context was passed at constructor. (#6661)

## [4.3.0]

### Added

-   Types `ContractDeploySend`, `ContractMethodSend`, `Web3PromiEvent` was exported (#6883)

## [4.4.0]

### Fixed

-   Fix an issue with smart contract function overloading (#6922)

### Added

-   Added a console warning in case of an ambiguous call to a solidity method with parameter overloading (#6942)
-   Added contract.deploy(...).decodeData(...) and contract.decodeMethodData(...) that decode data based on the ABI (#6950)

## [4.5.0]

### Added

-   `defaultReturnFormat` was added to all methods that have `ReturnType` param. (#6947)

## [4.6.0]

### Added

-   `populateTransaction` was added to contract methods (#7124)
-   Contract has `setTransactionMiddleware` and `getTransactionMiddleware` for automatically passing to `sentTransaction` for `deploy` and `send` functions (#7138)

## [4.7.0]

### Added

-	Added `populateTransaction` to the `contract.deploy(...)` properties. (#7197)

### Changed

-   The returnred properties of `contract.deploy(...)` are structured with a newly created class named `DeployerMethodClass`. (#7197)
-	Add a missed accepted type for the `abi` parameter, at `dataInputEncodeMethodHelper` and `getSendTxParams`. (#7197)

## [Unreleased]