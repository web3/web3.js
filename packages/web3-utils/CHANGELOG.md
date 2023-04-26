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

-   Added and exported three reusable utility functions: `pollTillDefined`, `rejectIfTimeout` and `rejectIfConditionAtInterval` which are useful when dealing with promises that involves polling, rejecting after timeout or rejecting if a condition was met when calling repeatably at every time intervals.

## [4.0.1-alpha.2]

### Added

-   Export a new function `uuidV4` that generates a random v4 Uuid (#5373).
-   Enable passing a starting number, to increment based on it, for the Json Rpc Request `id` (#5652).
-   Export a new function `isPromise` that checks if an object is a promise (#5652).

### Fixed

-   Use Uuid for the response id, to fix the issue "Responses get mixed up due to conflicting payload IDs" (#5373).

## [4.0.1-alpha.3]

### Changed

-   Updated dependencies (#5725)

## [4.0.1-alpha.4]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)
-   Add SocketProvider class and Eip1193Provider abstract class (#5683)

## [4.0.1-alpha.5]

### Changed

-   web3.js dependencies (#5757)

## [4.0.1-rc.0]

### Removed

-   Moved `TypedArray` to `web3-types` (was also duplicated at `web3-validator`) (#5771)
-   Removed support of `genesis` tag in `compareBlockNumbers` function (#5823)

### Added

-   Added support of `safe` and `finalized` block tags (#5823)

### Changed

-   `compareBlockNumbers` function now only supports comparison of both blocktags params ( except `earliest` vs number) or both block number params (#5842)
-   `SocketProvider` abstract class now resolves JSON RPC response errors instead of rejecting them (#5844)
-   Exposes the getter of `SocketConnection` in `SocketProvider` (#5891)

## [4.0.1-rc.1]

### Added

-   Added source files (#5956)
-   Added hybrid build (ESM and CJS) of library (#5904)

### Changed

-   The types `FMT_NUMBER`, `NumberTypes`, `FMT_BYTES`, `ByteTypes`, `DataFormat`, `DEFAULT_RETURN_FORMAT`, `ETH_DATA_FORMAT` and `FormatType` moved to `web3-types`. (#5993)

### Removed

-   Removed dependencies @ethereumjs/tx, @ethereumjs/common (#5963)

## [Unreleased]

### Added

-   Optional `hexstrict` parameter added to numberToHex (#6004)

### Changed

-   Replaced Buffer for Uint8Array (#6004)
-   The methods `hexToBytes`, `randomBytes` does not return type `Buffer` but type `Uint8Array` (#6004)
-   The methods `sha3` and `keccak256Wrapper` does not accept type `Buffer` but type `Uint8Array` (#6004)
-   The method `bytesToBuffer` has been removed for the usage of `bytesToUint8Array` (#6004)
