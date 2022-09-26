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

-   `web3-rpc-methods` dependency (#5441)

### Changed

-   `Web3NetAPI` is now imported from `web3-types` instead of `web3_net_api.ts` (#5441)
-   Replace the imported methods from `rpc_methods.ts` with `netRpcMethods` imports from `web3-rpc-methods` (#5441)

### Removed

-   `rpcMethods` export, these methods are now exported via `web3-rpc-methods` as `netRpcMethods` (#5441)
-   `Web3NetAPI` export, now exported via `web3-types` as `Web3NetAPI` (#5441)
