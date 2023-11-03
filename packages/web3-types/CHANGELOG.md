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

## [1.0.0-rc.2]

### Added

-   Added `filters` param to the `Filter` type (#6010)
-   Added types `JsonRpcSubscriptionResultOld`, `Web3ProviderMessageEventCallback`. Added `.on('data')` type support for old providers (#6082)
-   Export for `HardforksOrdered` enum (#6102)
-   Export for `Web3ValidationErrorObject` type (#6102)

### Changed

-   Removed chainId, to, data & input properties from NonPayableCallOptions
-   Replaced Buffer for Uint8Array (#6004)
-   types `FMT_BYTES.BUFFER`, `Bytes` and `FormatType` and encryption option types for `salt` and `iv` has replaced support for `Buffer` for `Uint8Array` (#6004)
-   Added `internalType` property to the `AbiParameter` type.

## [1.0.0]

Release Notes:

Detailed List of change logs are mentioned under previous 1.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [1.0.1]

### Added

-   Added the `SimpleProvider` interface which has only `request(args)` method that is compatible with EIP-1193 (#6210)
-   Added the `Eip1193EventName` type that contains the possible events names according to EIP-1193 (#6210)

### Changed

-   The `EIP1193Provider` class has now all the events (for `on` and `removeListener`) according to EIP-1193 (#6210)

### Fixed

-   Fixed bug #6185, now web3.js compiles on typescript v5 (#6195)

## [1.0.2]

### Fixed

-   type `Filter` includes `blockHash` (#6206)

## [1.1.0]

### Changed

-   `input` and `data` are now optional properties on `PopulatedUnsignedBaseTransaction` (previously `input` was a required property, and `data` was not available) (#6294)

### Added

-   `eth_signTypedData` and `eth_signTypedData_v4` to `web3_eth_execution_api` (#6286)
-   `Eip712TypeDetails` and `Eip712TypedData` to `eth_types` (#6286)

## [1.1.1]

### Changed

-   Dependencies updated

## [1.2.0]

### Added

-   add `asEIP1193Provider` to `Web3BaseProvider` so every inherited class can have the returned value of `request` method, fully compatible with EIP-1193. (#6407)


## [1.3.0]

### Added

-   Interface `EventLog` was added. (#6410)

## [1.3.1]

### Added

-   Interface `MetaMaskProvider` added and is part of `SupportedProviders` (#6534)
-   `gasPrice` was added to `Transaction1559UnsignedAPI` type. (#6539)

## [Unreleased]