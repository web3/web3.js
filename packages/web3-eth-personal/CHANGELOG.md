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

### Changed

-   Import `EthPersonalAPI` from `web3-types` instead of local import (#5441)
-   Replace the imported methods from `rcp_methods.ts` with `personalRpcMethods` imports from `web3-rpc-methods` (#5441)
-   Replace use of `EthPersonalAPIManager` with `Web3RequestManager<EthPersonalAPI>` (#5441)

### Removed

-   Exported type `EthPersonalAPIManager`, `EthPersonalAPI` is not exported via `web3-types` (#5441)

## [4.0.1-alpha.2]

### Changed

-   Updated Web3.js dependencies (#5664)

## [4.0.1-alpha.3]

### Changed

-   Updated dependencies (#5725)

## [Unreleased]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)
