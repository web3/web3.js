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

### Changed

-   `signTransaction` and `privateKeyToAccount` will throw `TransactionSigningError` instead of `SignerError` now (#5462)

## [4.0.1-alpha.2]

### Removed

-   These types were moved to `web3-types` package: Cipher, CipherOptions, ScryptParams, PBKDF2SHA256Params, KeyStore (#5581)

## [4.0.1-alpha.3]

### Changed

-   Updated dependencies (#5725)

## [4.0.1-alpha.4]

### Changed

-   `tsc` compiled files moved to `lib/` directory from `dist/` (#5739)

## [4.0.1-alpha.5]

### Changed

-   web3.js dependencies (#5757)

## [4.0.1-rc.0]

### Changed

-   Updated dependencies (#5912)

## [4.0.1-rc.1]

### Added

-   Added source files (#5956)
-   Added hybrid build (ESM and CJS) of library (#5904)

### Changed

-   Moved @ethereumjs/tx, @ethereumjs/common code to our source code (#5963)
-   The method `signTransaction` returned by `privateKeyToAccount` is now accepting the type `Transaction` for its argument. (#5993)

## [4.0.1-rc.2]

### Fixed

-   Fixed ESM import bugs reported in (#6032) and (#6034)

### Changed

-   Replaced `Buffer` for `Uint8Array` (#6004)
-   The methods `recover`, `encrypt`, `privateKeyToAddress` does not support type `Buffer` but supports type `Uint8Array` (#6004)
-   The method `parseAndValidatePrivateKey` returns a type `Uint8Array` instead of type `Buffer` (#6004)

## [4.0.1]

Release Notes:

Detailed List of change logs are mentioned under previous 4.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [4.0.2]

### Fixed

-   Fixed "The `r` and `s` returned by `signTransaction` to does not always consist of 64 characters #6207" (#6216)

## [4.0.3]

### Changed

-   Dependencies updated

## [4.0.4]

### Changed

-   Dependencies updated

## [4.0.5]

### Changed

-   Dependencies updated

## [4.0.6]

### Fixed

-   Fixed "The `r` and `s` returned by `sign` to does not always consist of 64 characters" (#6411)


## [4.1.0]

### Added

-   Added public function `privateKeyToPublicKey`
-   Added exporting `BaseTransaction` from the package (#6493)
-   Added exporting `txUtils` from the package (#6493)

### Fixed

-   Fixed `recover` function, `v` will be normalized to value 0,1 (#6344) 

## [4.1.1]

### Fixed

-   Send Transaction config used to be ignored if the passed `common` did not have a `copy()` and the `chainId` was not provided (#6663)
-   Fixed an issue with detecting Uint8Array (#6486)

## [4.1.2]

### Changed

-   Dependencies updated

## [4.1.3]

### Changed

- baseTransaction method updated (#7095)

## [4.2.0]

### Added

-   Added public function `signMessageWithPrivateKey` (#7174)

### Fixed
-   Fix `TransactionFactory.registerTransactionType` not working, if there is a version mistatch between `web3-eth` and `web3-eth-accounts` by saving `extraTxTypes` at `globals`.  (#7197)

## [4.2.1]

### Fixed
-   Revert `TransactionFactory.registerTransactionType` if there is a version mistatch between `web3-eth` and `web3-eth-accounts` and fix nextjs problem.  (#7216)

## [Unreleased]
