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

## [4.0.1-alpha.1]

### Added

-   `web3-rpc-methods` dependency (#5441)
-   Added chain and hardfork validation for transaction and transaction.common object in `validateTransactionForSigning`

### Changed

-   `Web3EthExecutionAPI` is now imported via `web3-types` instead of `web3_eth_execution_api.ts` (#5441)
-   Replace the imported methods from `rpc_methods.ts` with `ethRpcMethods` imports from `web3-rpc-methods` (#5441)
-   `Web3NetAPI` is now imported from `web3-types` instead of `web3-net` (#5441)
-   Moved `rpc_methods` tests to `web3-rpc-methods` (#5441)
-   Implemented the logic for `transactionBlockTimeout` (#5294)
-   Use subscription at `rejectIfBlockTimeout` when the provider supports subscription. Implement this as an experimental feature (if `useSubscriptionWhenCheckingBlockTimeout` at `enableExperimentalFeatures` is `true`). (#5481)
-   At some test cases, optimized some codes. (#5481)

### Removed

-   Moved the errors' classes from `web3-eth/src/errors.ts` to `web3-errors/src/errors/transaction_errors.ts` (#5462)

### Fixed

-   Fix `getBlock` returning empty transactions object on `hydrated` true (#5556)
-   [setimmediate](https://github.com/yuzujs/setImmediate) package to polyfill [setImmediate](https://nodejs.org/api/timers.html#setimmediatecallback-args) for browsers (#5450)

## [4.0.1-alpha.2]

### Changed

-   Updated Web3.js dependencies (#5664)

## [4.0.1-alpha.3]

### Changed

-   Updated dependencies (#5725)

## [4.0.1-alpha.4]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)

## [4.0.1-alpha.5]

### Changed

-   web3.js dependencies (#5757)

### Fixed

-   Enable transaction with local wallet index in the `to` field (#5731)

## [4.0.1-rc.0]

### Changed

-   Update imports statements for objects that was moved between web3 packages (#5771)
-   `sendTransaction` and `sendSignedTransaction` now errors with (and `error` event emits) the following possible errors: `TransactionRevertedWithoutReasonError`, `TransactionRevertInstructionError`, `TransactionRevertWithCustomError`, `InvalidResponseError`, or `ContractExecutionError` (#5854)

### Added

-   Added `createAccessList` functionality ( #5780 )
-   Added support of `safe` and `finalized` block tags (#5823)
-   `contractAbi` option to `SendTransactionOptions` and `SendSignedTransactionOptions` to added the ability to parse custom solidity errors (#5854)

### Removed

-   `getRevertReason` is no longer exported (#5844)

## [4.0.1-rc.1]

### Added

-   Added hybrid build (ESM and CJS) of library (#5904)
-   Added source files (#5956)

### Changed

-   `signTransaction` will now return `gas` instead of `gasLimit` for returned transaction object regardless of what property name the provider uses (#5915)
-   `formatTransaction` will now replace `data` transaction property with `input` (#5915)
-   `isTransactionCall` will now check if `value.input` `isHexStrict` if provided (#5915)
-   The functions `defaultTransactionBuilder` and `transactionBuilder` are now utilizing the type `Transaction` for the transaction object. (#5993)

### Removed

-   Removed dependencies @ethereumjs/tx, @ethereumjs/common (#5963)

## [4.0.1-rc.2]

### Fixed

-   Fixed `ignoreGasPricing` bug with wallet in context (#6071)

### Changed

-   `formatTransaction` no longer throws a `TransactionDataAndInputError` if it's passed a transaction object with both `data` and `input` properties set (as long as they are the same value) (#6064)
-   Refactored documentation for `rpc_method_wrappers` to point to the previously duplicated documentation found under the `Web3Eth` class documentation (#6054)
-   Replaced Buffer for Uint8Array (#6004)
-   Refactored `defaultTransactionTypeParser` to return correct EIP-2718 types, prior implementation was prioritizing `transaction.hardfork` and ignoring the use of `transaction.gasLimit`. `defaultTransactionTypeParser` will now throw `InvalidPropertiesForTransactionTypeError`s for properties are used that are incompatible with `transaction.type` (#6102)
-   `prepareTransactionForSigning` and `defaultTransactionBuilder` now accepts optional `fillGasPrice` flag and by default will not fill gas(#6071)

## [4.0.1]

Release Notes:

Detailed List of change logs are mentioned under previous 4.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [4.0.2]

### Changed

-   Dependencies updated

## [4.0.3]

### Changed

-   Dependencies updated

## [4.1.0]

### Fixed

-   sendTransaction will have gas filled by default using method `estimateGas` unless transaction builder `options.fillGas` is false. (#6249)
-   Missing `blockHeaderSchema` properties causing some properties to not appear in response of `newHeads` subscription (#6243)
-   Missing `blockHeaderSchema` properties causing some properties to not appear in response of `newHeads` subscription (#6243)

### Changed

-   `MissingGasError` error message changed for clarity (#6215)
-   `input` and `data` are no longer auto populated for transaction objects if they are not present. Instead, whichever property is provided by the user is formatted and sent to the RPC provider. Transaction objects returned from RPC responses are still formatted to contain both `input` and `data` properties (#6294)

### Added

-   A `rpc_method_wrapper` (`signTypedData`) for the rpc calls `eth_signTypedData` and `eth_signTypedData_v4` (#6286)
-   A `signTypedData` method to the `Web3Eth` class (#6286)

## [4.1.1]

### Fixed

-   Added return type for `formatSubscriptionResult` in class `NewHeadsSubscription` (#6368)

## [4.2.0]

### Added

-   Added to `Web3Config` property `contractDataInputFill` allowing users to have the choice using property `data`, `input` or `both` for contract methods to be sent to the RPC provider when creating contracts. (#6377) (#6400)

## [4.3.0]

### Changed

-   Transactions will now default to type 2 transactions instead of type 0, similar to 1.x version. (#6282)

### Fixed

-   Ensure provider.supportsSubscriptions exists before watching by subscription (#6440)
-   Fixed param sent to `checkRevertBeforeSending` in `sendSignedTransaction`
-   Fixed `defaultTransactionBuilder` for value issue (#6509)

### Added

-   Added `ALL_EVENTS` and `ALL_EVENTS_ABI` constants, `SendTransactionEventsBase` type, `decodeEventABI` method (#6410)

## [4.3.1]

### Changed

-   Dependencies updated

## [4.4.0]

### Added

-   Catch `TransactionPollingTimeoutError` was added to send transaction events (#6623)

## [4.5.0]

### Added

-   Added `eth.getMaxPriorityFeePerGas` method (#6748)

## [4.6.0]

### Added

-   method `getBlock` now includes properties of eip 4844, 4895, 4788 when returning block (#6933)
-   update type `withdrawalsSchema`, `blockSchema` and `blockHeaderSchema` schemas to include properties of eip 4844, 4895, 4788 (#6933)

## [4.7.0]

### Added

-   `defaultReturnFormat` was added to all methods that have `ReturnType` param. (#6947)
-   `getTransactionFromOrToAttr`, `waitForTransactionReceipt`, `trySendTransaction`, `SendTxHelper` was exported (#7000)

### Changed

-   Added parameter `customTransactionReceiptSchema` into methods `emitConfirmation`, `waitForTransactionReceipt`, `watchTransactionByPolling`, `watchTransactionBySubscription`, `watchTransactionForConfirmations` (#7000)
-   Changed functionality: For networks that returns `baseFeePerGas===0x0` fill `maxPriorityFeePerGas` and `maxFeePerGas` by `getGasPrice` method (#7050)

### Fixed

-   Fixed issue with simple transactions, Within `checkRevertBeforeSending` if there is no data set in transaction, set gas to be `21000` (#7043)

## [4.8.0]

### Added

-   `sendTransaction` in `rpc_method_wrappers` accepts optional param of `TransactionMiddleware` (#7088)
-   WebEth has `setTransactionMiddleware` and `getTransactionMiddleware` for automatically passing to `sentTransaction` (#7088)
- `TransactionMiddleware` and `TransactionMiddleware` data types are exported (#7088)

## [4.8.1]

### Fixed

-   Fixed geth issue when running a new instance, transactions will index when there are no blocks created (#7098)

## [4.8.2]

### Fixed

-   Adds transaction property to be an empty list rather than undefined when no transactions are included in the block (#7151)
-   Change method `getTransactionReceipt` to not be casted as `TransactionReceipt` to give proper return type (#7159)

## [Unreleased]