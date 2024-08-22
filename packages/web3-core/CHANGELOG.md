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

-   If the response error was `execution reverted`, raise `ContractExecutionError` and pass the response error to it in order to be set as `innerError` (this innerError will be decoded at web3-eth-contract if its ABI was provided according to EIP-838). (#5434)
-   `registerPlugin` method to `Web3Context` (#5393)
-   `Web3PluginBase` exported abstract class (#5393)
-   `Web3EthPluginBase` exported abstract class (#5393)

### Changed

-   Default value for `API` generic for `Web3ContextObject` from `any` to `unknown` (#5393)
-   Default value for `API` generic for `Web3ContextInitOptions` from `any` to `unknown` (#5393)
-   Added validation when `defaultHardfork` and `defaultCommon.hardfork` are different in web3config
-   Added validation when `defaultChain` and `defaultCommon.basechain` are different in web3config
-   Added a new configuration variable `enableExperimentalFeatures`. (#5481)

## [4.0.1-alpha.2]

### Fixed

-   Make the `request` method of `EIP1193Provider` class, compatible with EIP 1193 (#5591)

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

### Added

-   Added rpc exception codes following eip-1474 as an experimental feature (if `useRpcCallSpecification` at `enableExperimentalFeatures` is `true`) (#5525)
-   Added support of `safe` and `finalized` block tags (#5823)

## [4.0.1-rc.1]

### Added

-   Added hybrid build (ESM and CJS) of library (#5904)
-   Added source files (#5956)

### Changed

-   If a transaction object with a `data` property is passed to `txInputOptionsFormatter`, it will now be replaced with `input` (#5915)
-   The types `TransactionTypeParser` and `TransactionBuilder` are now utilizing the type `Transaction` for the transaction object. (#5993)
-   No need for polyfilling nodejs `net` and `fs` modules (#5978)
-   Removed IPC provider dependency, IPC path is no longer viable provider. If you wanna use IPC, please install `web3-providers-ipc` and instantiate provider yourself (#5978)

### Removed

-   `getConfig` method from `Web3Config` class, `config` is now public and accessible using `Web3Config.config` (#5950)
-   Error param in the `messageListener` in subscription was removed (triggered by `.on('data')` or `.on('message')`) to properly support all providers. (#6082)

## [4.0.1-rc.2]

### Changed

-   Replaced Buffer for Uint8Array (#6004)

## [4.0.1]

Release Notes:

Detailed List of change logs are mentioned under previous 4.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [4.0.2]

### Added

-   Web3Subscription constructor accept a Subscription Manager (as an alternative to accepting Request Manager that is now marked marked as deprecated) (#6210)

### Changed

-   Web3Subscription constructor overloading that accept a Request Manager is marked as deprecated (#6210)

### Fixed

-   Fixed Batch requests erroring out on one request (#6164)
-   Fixed the issue: Subscribing to multiple blockchain events causes every listener to be fired for every registered event (#6210)
-   Fixed the issue: Unsubscribe at a Web3Subscription class will still have the id of the subscription at the Web3SubscriptionManager (#6210)
-   Fixed the issue: A call to the provider is made for every subscription object (#6210)

## [4.0.3]

### Added

-   Expose `subscriptionManager` as a `protected get` at `Web3Subscription` to be able to use it inside custom subscriptions, if needed. (#6285)

### Changed

-   Dependencies updated

## [4.1.0]

### Changed

-   No need to pass `CommonSubscriptionEvents &` at every child class of `Web3Subscription` (#6262)
-   Implementation of `_processSubscriptionResult` and `_processSubscriptionError` has been written in the base class `Web3Subscription` and maid `public`. (#6262)
-   A new optional protected method `formatSubscriptionResult` could be used to customize data formatting instead of re-implementing `_processSubscriptionResult`. (#6262)
-   No more needed to pass `CommonSubscriptionEvents & ` for the first generic parameter of `Web3Subscription` when inheriting from it. (#6262)

### Fixed

-   Fixed the issue: "Version 4.x does not fire connected event for subscriptions. #6252". (#6262)

### Added

-   Added minimum support of web3.extend function

## [4.1.1]

### Fixed

-   Fixed rpc errors not being sent as an inner error when using the `send` method on request manager (#6300).

### Added

-   To fix issue #6190, added the functionality to introduce different timeout value for Web3. (#6336)

## [4.2.0]

### Added

-   Added to `Web3Config` property `contractDataInputFill` allowing users to have the choice using property `data`, `input` or `both` for contract methods to be sent to the RPC provider when creating contracts. (#6377) (#6400)

## [4.3.0]

### Changed

-   defaultTransactionType is now type 0x2 instead of 0x0 (#6282)
-   Allows formatter to parse large base fee (#6456)
-   The package now uses `EventEmitter` from `web3-utils` that works in node envrioment as well as in the browser. (#6398)

### Fixed

-   Fix the issue: "Uncaught TypeError: Class extends value undefined is not a constructor or null #6371". (#6398)

## [4.3.1]

### Fixed

-   Fix `Web3Config` to properly update within other web3 packages when `setConfig` is used  (#6555)

### Added

-   Added `isMetaMaskProvider` function to check if provider is metamask (#6534)

## [4.3.2]

### Changed

-	Web3config `contractDataInputFill` has been defaulted to `data`, istead of `input`. (#6622)

## [4.4.0]

### Added

-   `defaultReturnFormat` was added to the configuration options. (#6947)

### Changed

-   Interface `RequestManagerMiddleware` was changed (#7003)

### Fixed

-   Set a try catch block if processesingError fails (#7022)

## [4.5.0]

### Added

-   Now when existing packages are added in web3, will be avalible for plugins via context. (#7088)

## [4.5.1]

### Fixed

-   `setConfig()` fix for `setMaxListenerWarningThreshold` fix (#5079)

## [Unreleased]