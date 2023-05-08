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

## [Unreleased]

### Changed

-   `formatTransaction` no longer throws a `TransactionDataAndInputError` if it's passed a transaction object with both `data` and `input` properties set (as long as they are the same value) (#6064)
-   Refactored documentation for `rpc_method_wrappers` to point to the previously duplicated documentation found under the `Web3Eth` class documentation (#6054)
-   Replaced Buffer for Uint8Array (#6004)
