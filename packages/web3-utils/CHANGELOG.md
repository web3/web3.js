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

## [Unreleased]

### Removed

-   Moved `TypedArray` to `web3-types` (was also duplicated at `web3-validator`) (#5771)
-   Removed support of `genesis` tag in `compareBlockNumbers` function (#5823)

### Added

-   Added support of `safe` and `finalized` block tags (#5823)

