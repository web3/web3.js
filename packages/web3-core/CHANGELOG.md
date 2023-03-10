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

## [Unreleased]
