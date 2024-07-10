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

## [4.0.1-rc.2]

### Added

-   Optional `hexstrict` parameter added to numberToHex (#6004)

### Changed

-   Replaced Buffer for Uint8Array (#6004)
-   The methods `hexToBytes`, `randomBytes` does not return type `Buffer` but type `Uint8Array` (#6004)
-   The methods `sha3` and `keccak256Wrapper` does not accept type `Buffer` but type `Uint8Array` (#6004)
-   The method `bytesToBuffer` has been removed for the usage of `bytesToUint8Array` (#6004)

## [4.0.1]

Release Notes:

Detailed List of change logs are mentioned under previous 4.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [4.0.2]

### Changed

-   Dependencies updated

## [4.0.3]

### Fixed

-   BigInts pass validation within the method `numberToHex` (#6206)

## [4.0.4]

### Changed

-   Dependencies updated

## [4.0.5]

### Changed

-   Dependencies updated

## [4.0.6]

### Fixed

-   `soliditySha3()` with BigInt support

## [4.0.7]

### Added

-   As a replacment of the node EventEmitter, a custom `EventEmitter` has been implemented and exported. (#6398)

### Fixed

-   Fix issue with default config with babel (and React): "TypeError: Cannot convert a BigInt value to a number #6187" (#6506)
-   Fixed bug in chunks processing logic (#6496)

## [4.1.0]

### Added

-   `SocketProvider` now contains public function `getPendingRequestQueueSize`, `getSentRequestsQueueSize` and `clearQueues` (#6479)
-   Added `safeDisconnect` as a `SocketProvider` method to disconnect only when request queue size and send request queue size is 0 (#6479)
-   Add `isContractInitOptions` method (#6555)

### Fixed

-   Fix unnecessary array copy when pack encoding (#6553)

## [4.1.1]

### Fixed

-   Fixed an issue with detecting Uint8Array (#6486)

## [4.2.0]

### Added

-   Adds missing exported type `AbiItem` from 1.x to v4 for compatabiltiy (#6678)

## [4.2.1]

### Fixed

-   replaced our eventEmitter to EventEmitter3 to support react native builds (#6253)

## [4.2.2]

### Fixed

-   fixed erroneous parsing of big numbers in the `toNumber(...)` function (#6880)

## [4.2.3]

### Changed

-   Method `format` was changed. Now it has default value `DEFAULT_RETURN_FORMAT` for `returnFormat` parameter (#6947)

### Fixed

-   fixed toHex incorrectly hexing Uint8Arrays and Buffer (#6957)
-   fixed isUint8Array not returning true for Buffer (#6957)

## [4.3.0]

### Added

-   `toWei` add warning when using large numbers or large decimals that may cause precision loss (#6908)
-   `toWei` and `fromWei` now supports integers as a unit. (#7053)

### Fixed

-   `toWei` support numbers in scientific notation (#6908)
-   `toWei` and `fromWei` trims according to ether unit successfuly (#7044)

## [4.3.1]

### Fixed

-   `_sendPendingRequests` will catch unhandled errors from `_sendToSocket` (#6968)

## [Unreleased]
