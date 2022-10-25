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

## [Unreleased]

### Added

-   Add optional `innerError` property to the abstract class `Web3Error`. This `innerError` could be `Error`, `Error[]` or `undefined`. (#5435) (#5434)
-   The class `Web3ContractError` is moved to this package from `web3-eth-contract`. (#5434)
-   Added the error code `ERR_TX_SIGNING` and used it inside `TransactionSigningError` (#5462)
-   Added the error code `ERR_TX_GAS_MISMATCH` and used it inside `TransactionGasMismatchError` (#5462)
-   Added `SignatureError` to `web3-errors/src/errors/signature_errors.ts` (moved from `web3-eth/src/errors.ts`) (#5462)
-   Added the errors' classes to `web3-errors/src/errors/transaction_errors.ts` from `web3-eth/src/errors.ts` (#5462)
-   Added `TransactionBlockTimeoutError` class and its error code `ERR_TX_BLOCK_TIMEOUT` (#5294)
-   `ExistingPluginNamespaceError` class and it's error code `ERR_EXISTING_PLUGIN_NAMESPACE` (#5393)

### Changed

-   Corrected the error code for `JSONRPC_ERR_UNAUTHORIZED` to be `4100` (#5462)

### Fixed

-   Moved `SignerError` from `web3-errors/src/errors/signature_errors.ts` to `web3-errors/src/errors/transaction_errors.ts`, and renamed it to `TransactionSigningError` (#5462)
