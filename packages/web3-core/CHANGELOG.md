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

## [Unreleased]

### Changed

-   Replaced Buffer for Uint8Array (#6004)
