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

## [0.1.1-alpha.4]

### Added

-   Add `TransactionWithFromLocalWalletIndex`, `TransactionWithToLocalWalletIndex` and `TransactionWithFromAndToLocalWalletIndex` types (#5731)

## [1.0.0-rc.0]

### Added

-   Added types from `web3-eth-abi` and `TypedArray` from (#5771)
-   Added `TypedArray` from `web3-utils` and `web3-validator` (it was defined twice) (#5771)
-   Added `safe` and `finalized` block tags in `BlockTags` and `BlockTag` types (#5823)

## [1.0.0-rc.1]

### Added

-   Added hybrid build (ESM and CJS) of library (#5904)
-   Added source files (#5956)

### Changed

-   `data` property in `TransactionOutput` was renamed to `input` (#5915)
-   The method `signTransaction` inside `Web3BaseWalletAccount` is now utilizing the type `Transaction` for its argument. (#5993)
-   The types `FMT_NUMBER`, `NumberTypes`, `FMT_BYTES`, `ByteTypes`, `DataFormat`, `DEFAULT_RETURN_FORMAT`, `ETH_DATA_FORMAT` and `FormatType` moved from `web3-utils`. (#5993)
-   The types `ContractInitOptions`, `NonPayableCallOptions` and `PayableCallOptions` are moved from `web3-eth-contract`. (#5993)

## [Unreleased]

### Changed

-   Removed chainId, to, data & input properties from NonPayableCallOptions

### Added

-   Added `filters` param to the `Filter` type (#6010)
### Changed

-   Replaced Buffer for Uint8Array (#6004)
-   types `FMT_BYTES.BUFFER`, `Bytes` and `FormatType` and encryption option types for `salt` and `iv` has replaced support for `Buffer` for `Uint8Array` (#6004)
-   Added `internalType` property to the `AbiParameter` type.