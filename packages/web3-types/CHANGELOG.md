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

## [0.1.1-alpha.1]

### Added

-   `Web3EthExecutionAPI` export (#5441)
-   `Web3NetAPI` export (#5441)
-   `EthPersonalAPI` export (#5441)

### Changed

-   `Web3APISpec`, `Web3APIMethod`, and `Web3APIParams` now supports `unknown` APIs (#5393)

## [0.1.1-alpha.2]

### Added

-   These types were moved from `web3-eth-accounts` to `web3-types` package: Cipher, CipherOptions, ScryptParams, PBKDF2SHA256Params, KeyStore (#5581 )

### Fixed

-   Make the `request` method of `EIP1193Provider` class, compatible with EIP 1193 (#5591)

## [0.1.1-alpha.3]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)
-   These types were added: ProviderRpcError, EthSubscription, ProviderMessage, ProviderConnectInfo (#5683)

## [Unreleased]

### Added

-   Add `TransactionWithFromLocalWalletIndex`, `TransactionWithToLocalWalletIndex` and `TransactionWithFromAndToLocalWalletIndex` types (#5731)
