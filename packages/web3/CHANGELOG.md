# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- EXAMPLE

## [1.0.0]

### Added

- I've added feature XY (#1000)

### Changed

- I've cleaned up XY (#1000)

### Deprecated

- I've deprecated XY (#1000)

### Removed

- I've removed XY (#1000)

### Fixed

- I've fixed XY (#1000)

### Security

- I've improved the security in XY (#1000)

-->

## [4.0.0-alpha.1]

### Breaking Changes

#### Connection close is not supported

In `1.x` user had access to raw connection object and can interact with it. e.g.

```ts
web3.currentProvider.connection.close();
```

But this internal behavior is not exposed any further. Though you can achieve same with this approach.

```ts
web3.currentProvider.disconnect();
```

## [4.0.1-alpha.2]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)

## [4.0.1-alpha.5]

### Removed

-   `build` entry from `package.json` (#5755)

## [4.0.1-rc.0]

### Added

-   `registeredSubscriptions` was added by default in web3 constructor (#5792)
-   Add named exports for all objects which are the default-exported-object in their packages (#5771)
-   Export all packages' objects organized by namespaces (#5771)
-   Add Additional flat exports for all types and constants from `web3-types`, `web3-errors` and `web3`. (#5771)
-   Fix few issues with `new Web3().eth.contract` (#5824)

### Changed

-   `require('web3')` will now return all web3 exported-objects organized in namespaces . (#5771)

### Removed

-   Private static `_contracts:Contract[]` and static `setProvider` function was removed (#5792)

## [4.0.1-rc.1]

### Added

-   Added source files (#5956)
-   Added hybrid build (ESM and CJS) of library (#5904)

### Changed

-   No need for polyfilling nodejs `net` and `fs` modules (#5978)
-   Removed IPC provider dependency, IPC path is no longer viable provider. If you wanna use IPC, please install `web3-providers-ipc` and instantiate provider yourself (#5978)

## [4.0.1-rc.2]

### Changed

-   Dependencies updated

## [4.0.1]

Release Notes:

Detailed List of change logs are mentioned under previous 4.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [4.0.2]

### Added

-   Exported `Web3Context`, `Web3PluginBase`, `Web3EthPluginBase` from `'web3-core'`, and `Web3Validator` from `'web3-validator'` (#6165)

### Fixed

-   Fixed bug #6185, now web3.js compiles on typescript v5 (#6195)
-   Fixed #6162 @types/ws issue (#6205)

## [4.0.3]

## Added

-   Web3 constructor accepts `Web3ContextInitOptions<EthExecutionAPI, CustomRegisteredSubscription>` as alternative to the still supported `undefined`, `string`, and `SupportedProviders<EthExecutionAPI>` (#6262).

### Fixed

-   Fixed bug #6236 by adding personal type in web3.eth (#6245)

## [4.1.0]

### Added

-   Added minimum support of web3.extend function

## [4.1.1]

### Added

-   To fix issue #6190, added the functionality to introduce different timeout value for Web3. (#6336)

## [4.1.2]

### Fixed

-   Fix of incorrect provider warning behavior

## [4.2.0]

### Changed

-   Dependencies updated

### Added

-   Various web3 sub packages has new functions details are in root changelog

## [4.2.1]

### Changed

-   Dependencies updated

## [4.2.2]

### Changed

-   Dependencies updated ( details are in root changelog )

## [4.3.0]

### Added

- Added methods (privateKeyToAddress, parseAndValidatePrivateKey, and privateKeyToPublicKey) to web3.eth.accounts (#6620)

### Changed

-   Dependencies updated

## [4.4.0]

-   Dependencies updated ( details are in root changelog )

## [4.5.0]

-   Dependencies updated ( details are in root changelog )

## [4.6.0]

### Added

-   Added EIP-6963 utility function `requestEIP6963Providers` for multi provider discovery ( other details are in root changelog )


## [4.7.0]

### added

#### web3-eth-contract

-   Types `ContractDeploySend`, `ContractMethodSend`, `Web3PromiEvent` was exported (#6883)

#### web3-eth-ens

- Added function getText and getName in ENS and resolver classes (#6914)

### fixed

#### web3-validator

- Multi-dimensional arrays(with a fix length) are now handled properly when parsing ABIs (#6798)

#### web3-utils

- fixed erroneous parsing of big numbers in the `toNumber(...)` function (#6880)

## [4.8.0]

### Changed

#### web3-eth-abi

-   Dependencies updated

#### web3-eth-accounts

-   Dependencies updated

### Fixed

#### web3-eth-contract

-	Fix an issue with smart contract function overloading (#6922)

#### web3-utils

- fixed toHex incorrectly hexing Uint8Arrays and Buffer (#6957)
- fixed isUint8Array not returning true for Buffer (#6957)


### Added

#### web3-eth-contract

-	Added a console warning in case of an ambiguous call to a solidity method with parameter overloading (#6942)
-	Added contract.deploy(...).decodeData(...) and contract.decodeMethodData(...) that decode data based on the ABI (#6950)

#### web3-eth

-   method `getBlock` now includes properties of eip 4844, 4895, 4788 when returning block (#6933) 
-   update type `withdrawalsSchema`, `blockSchema` and `blockHeaderSchema` schemas to include properties of eip 4844, 4895, 4788 (#6933)


#### web3-types

-   Added `signature` to type `AbiFunctionFragment` (#6922)
-   update type `Withdrawals`, `block` and `BlockHeaderOutput` to include properties of eip 4844, 4895, 4788 (#6933)

## [4.9.0]

### Added

#### web3

-   Updated type `Web3EthInterface.accounts` to includes `privateKeyToAccount`,`privateKeyToAddress`,and `privateKeyToPublicKey` (#6762)

#### web3-core

-   `defaultReturnFormat` was added to the configuration options. (#6947)

#### web3-errors

- Added `InvalidIntegerError` error for fromWei and toWei (#7052)

#### web3-eth

-   `defaultReturnFormat` was added to all methods that have `ReturnType` param. (#6947)
-   `getTransactionFromOrToAttr`, `waitForTransactionReceipt`, `trySendTransaction`, `SendTxHelper` was exported (#7000)

#### web3-eth-contract

-   `defaultReturnFormat` was added to all methods that have `ReturnType` param. (#6947)

#### web3-eth-ens

-   `defaultReturnFormat` was added to all methods that have `ReturnType` param. (#6947)

#### web3-net

-   `defaultReturnFormat` was added to all methods that have `ReturnType` param. (#6947)

#### web3-types

-   Added `signature` to type `AbiFunctionFragment` (#6922)
-   update type `Withdrawals`, `block` and `BlockHeaderOutput` to include properties of eip 4844, 4895, 4788 (#6933)

#### web3-utils

- `toWei` add warning when using large numbers or large decimals that may cause precision loss (#6908)
- `toWei` and `fromWei` now supports integers as a unit. (#7053)  

### Fixed

#### web3-eth

-   Fixed issue with simple transactions, Within `checkRevertBeforeSending` if there is no data set in transaction, set gas to be `21000` (#7043)

#### web3-utils

- `toWei` support numbers in scientific notation (#6908)
- `toWei` and `fromWei` trims according to ether unit successfuly (#7044)

#### web3-validator

- The JSON schema conversion process now correctly assigns an id when the `abi.name` is not available, for example, in the case of public mappings. (#6981)
-  `browser` entry point that was pointing to an non-existing bundle file was removed from `package.json` (#7015)

#### web3-core

-   Set a try catch block if processesingError fails (#7022)

### Changed

#### web3-core

-   Interface `RequestManagerMiddleware` was changed (#7003)

#### web3-eth

-   Added parameter `customTransactionReceiptSchema` into methods `emitConfirmation`, `waitForTransactionReceipt`, `watchTransactionByPolling`, `watchTransactionBySubscription`, `watchTransactionForConfirmations` (#7000)
-   Changed functionality: For networks that returns `baseFeePerGas===0x0` fill `maxPriorityFeePerGas` and `maxFeePerGas` by `getGasPrice` method (#7050)

#### web3-eth-abi

-   Dependencies updated

#### web3-rpc-methods

-   Change `estimateGas` method to add possibility pass Transaction type (#7000)

## [4.10.0]

### Added

#### web3

-   Now when existing packages are added in web3, will be avalible for plugins via context. (#7088)

#### web3-core

-   Now when existing packages are added in web3, will be avalible for plugins via context. (#7088)

#### web3-eth

-   `sendTransaction` in `rpc_method_wrappers` accepts optional param of `TransactionMiddleware` (#7088)
-   WebEth has `setTransactionMiddleware` and `getTransactionMiddleware` for automatically passing to `sentTransaction` (#7088)

#### web3-eth-ens

-   `getText` now supports first param Address
-   `getName` has optional second param checkInterfaceSupport

### web3-types

-   Added `result` as optional `never` and `error` as optional `never in type `JsonRpcNotification` (#7091)
-   Added `JsonRpcNotfication` as a union type in `JsonRpcResponse` (#7091)

### web3-rpc-providers

-   RC release 

### Fixed

#### web3-eth-ens

-   `getName` reverse resolution


## [4.11.0]

### Fixed

#### web3-eth-abi

-   fix encodedata in EIP-712 (#7095)

#### web3-utils

-   `_sendPendingRequests` will catch unhandled errors from `_sendToSocket` (#6968)

#### web3-eth

-   Fixed geth issue when running a new instance, transactions will index when there are no blocks created (#7098)

### Changed

#### web3-eth-accounts

- baseTransaction method updated (#7095)

#### web3-providers-ws

-   Update dependancies (#7109)

### Added

#### web3-eth-contract

-   `populateTransaction` was added to contract methods (#7124)
-   Contract has `setTransactionMiddleware` and `getTransactionMiddleware` for automatically passing to `sentTransaction` for `deploy` and `send` functions (#7138)

#### web3

-   `web3.eth.Contract` will get transaction middleware and use it, if `web3.eth` has transaction middleware. (#7138)

## [4.11.1]

### Fixed

#### web3-errors

- Fixed the undefined data in `Eip838ExecutionError` constructor (#6905)

#### web3-eth

-   Adds transaction property to be an empty list rather than undefined when no transactions are included in the block (#7151)
-   Change method `getTransactionReceipt` to not be casted as `TransactionReceipt` to give proper return type (#7159)

#### web3

-   Remove redundant constructor of contractBuilder (#7150)


## [4.12.0]

### Fixed

#### web3-core

-   `setConfig()` fix for `setMaxListenerWarningThreshold` fix (#5079)

#### web3-eth-accounts

-   Fix `TransactionFactory.registerTransactionType` not working, if there is a version mistatch between `web3-eth` and `web3-eth-accounts` by saving `extraTxTypes` at `globals`.  (#7197)

### Added

#### web3-eth-accounts

-   Added public function `signMessageWithPrivateKey` (#7174)

#### web3-eth-contract

-	Added `populateTransaction` to the `contract.deploy(...)` properties. (#7197)

#### web3-providers-http

- Added `statusCode` of response in ResponseError, `statusCode` is optional property in ResponseError.

#### web3-rpc-providers

-   Updated rate limit error of QuickNode provider for HTTP transport
-   Added optional `HttpProviderOptions | SocketOptions` in `Web3ExternalProvider` and `QuickNodeProvider` for provider configs

#### web3-errors

- Added optional `statusCode` property of response in ResponseError.

### Changed

#### web3-eth-contract

-   The returnred properties of `contract.deploy(...)` are structured with a newly created class named `DeployerMethodClass`. (#7197)
-	Add a missed accepted type for the `abi` parameter, at `dataInputEncodeMethodHelper` and `getSendTxParams`. (#7197)

## [4.12.1]

### Fixed

#### web3-eth-accounts

-   Revert `TransactionFactory.registerTransactionType` if there is a version mistatch between `web3-eth` and `web3-eth-accounts` and fix nextjs problem.  (#7216)

## [Unreleased]