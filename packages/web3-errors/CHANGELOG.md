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
-   Moved `SignerError` from `web3-errors/src/errors/signature_errors.ts` to `web3-errors/src/errors/transaction_errors.ts`, and renamed it to `TransactionSigningError` (#5462)

## [0.1.1-alpha.2]

### Changed

-   Updated Web3.js dependencies (#5664)

## [0.1.1-alpha.3]

### Changed

-   `main` and `files` entries in `package.json` changed to `lib/` directory from `dist/` (#5739)

## [0.1.1-alpha.4]

### Changed

-   web3.js dependencies (#5757)

## [1.0.0-rc.0]

### Changed

-   The abstract class `Web3Error` is renamed to `BaseWeb3Error` (#5771)
-   Renamed TransactionRevertError to TransactionRevertInstructionError to remain consistent with 1.x
-   Using `MaxAttemptsReachedOnReconnectingError` with the same message for 1.x but also adding the `maxAttempts` (#5894)

### Added

-   Added error class `InvalidMethodParamsError` and error code `ERR_INVALID_METHOD_PARAMS = 207` (#5824)
-   `request` property to `ResponseError` (#5854)
-   `data` property to `TransactionRevertInstructionError` (#5854)
-   `TransactionRevertWithCustomError` was added to handle custom solidity errors (#5854)

## [1.0.0-rc.1]

### Added

-   Added hybrid build (ESM and CJS) of library (#5904)
-   Added source files (#5956)

### Changed

-   `gasLimit` is no longer accepted as a parameter for `MissingGasError` and `TransactionGasMismatchError, and is also no longer included in error message (#5915)

## [1.0.0-rc.2]

### Added

-   `InvalidPropertiesForTransactionTypeError` with error code `429` (#6102)

### Changed

-   Nested Smart Contract error data is extracted at `Eip838ExecutionError` constructor and the nested error is set at `innerError` (#6045)

## [1.0.0]

Release Notes:

Detailed List of change logs are mentioned under previous 1.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [1.0.1]

### Changed

-   Dependencies updated

## [1.0.2]

### Changed

-   Dependencies updated

## [1.1.0]

### Added

-   `RpcErrorMessages` that contains mapping for standard RPC Errors and their messages. (#6230)
-   created `TransactionGasMismatchInnerError` for clarity on the error in `TransactionGasMismatchError` (#6215)
-   created `MissingGasInnerError` for clarity on the error in `MissingGasError` (#6215)

### Fixed

-   Fixed: "'disconnect' in Eip1193 provider must emit ProviderRpcError #6003".(#6230)

## [1.1.1]

### Fixed

-   ESM import bug (#6359)

## [1.1.2]

### Changed

-   Dependencies updated

## [1.1.3]

### Fixed

-   Added new SchemaFormatError (#6434)

## [1.1.4]

### Fixed

-   Fixed grammar and spelling in `transactionTimeoutHint` (#6559)

## [1.2.0]

### Added

- Added `InvalidIntegerError` error for fromWei and toWei (#7052)

## [1.2.1]

### Fixed

- Fixed the undefined data in `Eip838ExecutionError` constructor (#6905)

## [1.3.0]

### Added

- Added optional `statusCode` property of response in ResponseError.

## [Unreleased]