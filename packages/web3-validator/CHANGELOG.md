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

## [1.0.0-rc.2]

### Changed

-   Replaced Buffer for Uint8Array (#6004)

### Removed

-   `Web3ValidationErrorObject` type is now exported from `web3-types` package (#6102)

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

## [2.0.0]

### Changed

-   Replace `is-my-json-valid` with `zod` dependency. Related code was changed (#6264)
-   Types `ValidationError` and `JsonSchema` were changed (#6264)

### Removed

-   Type `RawValidationError` was removed (#6264)

### Added

-   Added `json-schema` as a main json schema type (#6264)

## [2.0.1]

### Fixed

-   ESM import bug (#6359)

## [2.0.2]

### Changed

-   Dependencies updated

## [2.0.3]

### Fixed

-   Multi-dimensional arrays are now handled properly when parsing ABIs (#6435)
-   Fix issue with default config with babel (and React): "TypeError: Cannot convert a BigInt value to a number #6187" (#6506)
-   Validator will now properly handle all valid numeric type sizes: intN / uintN where 8 < = N < = 256 and N % 8 == 0 (#6434)
-   Will now throw SchemaFormatError when unsupported format is passed to `convertToZod` method (#6434)

## [Unreleased]