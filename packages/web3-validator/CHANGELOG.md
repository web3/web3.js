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

### Removed

-   Removed direct function `toJSON()` in `Web3ValidatorError` class as its available via base class (#5435)

## [0.1.1-alpha.2]

### Changed

-   Updated Web3.js dependencies (#5664)

### Fixed

-   Fix `isHex`returning `false` for `-123`, fix `isHexStrict` returning `true` for `-0x`, and fix `isHex` returning `true` for empty strings `` (#5373).

## [0.1.1-alpha.3]

### Fixed

-   Fix issue when importing `web3-validator` package within browser environments (Webpack minified filename changed from `index.min.js` to `web3-validator.min.js`) (#5710)

## [0.1.1-alpha.4]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)

## [0.1.1-alpha.5]

### Removed

-   `build` entry from `package.json` (#5755)

## [1.0.0-rc.0]

### Removed

-   Moved `TypedArray` to `web3-types` (was also duplicated at `web3-utils`) (#5771)

### Added

-   Added support of `safe` and `finalized` block tags in `isBlockTag` method (#5823)

## [1.0.0-rc.1]

### Added

-   Added source files (#5956)
-   Added hybrid build (ESM and CJS) of library (#5904)
-   Added functions `isHexString`, `isHexPrefixed`, `validateNoLeadingZeroes` (#5963)

## [Unreleased]

### Changed

-   Replaced Buffer for Uint8Array (#6004)
