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

-   If an error happens when decoding a value, preserve that exception at `innerError` inside the error class `AbiError`. (#5435)
-   Add basic functionality that is used, by `web3-eth-contract`, when decoding error data according to EIP-838. (#5434)

### Fixed

-   Return `BigInt` instead of `string` when decoding function parameters for large numbers, such as `uint256`. (#5435)

## [4.0.1-alpha.2]

### Changed

-   Updated Web3.js dependencies (#5664)

### Fixed

-   Fix `ContractMethodOutputParameters` type to support output object types by index and string key. Also, it returns void if ABI doesn't have outputs and returns exactly one type if the output array has only one element. (#5631)

## [4.0.1-alpha.3]

### Fixed

-   Parameters decoding error for nested components (#5714)

### Changed

-   Updated dependencies (#5725)

## [4.0.1-alpha.4]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)

## [4.0.1-alpha.5]

## [4.0.1-rc.0]

### Removed

-   Moved all types and interfaces to `web3-types` (#5771)

### Added

-   `decodeErrorData` from `web3-eth-contract` is now exported from this package and was renamed to `decodeContractErrorData` (#5844)

## [4.0.1-rc.1]

### Added

-   Added hybrid build (ESM and CJS) of library (#5904)
-   Added source files (#5956)

### Removed

-   Removed `formatDecodedObject` function (#5934)

## [Unreleased]

### Changed

-   Nested Smart Contract error data hex string is decoded when the error contains the data as object (when the data hex string is inside data.originalError.data or data.data) (#6045)
