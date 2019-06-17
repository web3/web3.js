# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- EXAMPLE

## [2.0.0-alpha]

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

## [2.0.0-alpha]

### Added

- Locally signed transaction as ``BatchRequest`` (#2708)
- Increasing of the nonce for locally signed transactions (#2796)

### Changed

- Pull request & issue templates updated
- Supported node versions changed (#2820)

### Fixed

- ``hexToNumberString`` prefix validation (#2184)
- Draft implementation of the EIP-1193 improved (#2856, #2862, #2854)
- Documentation typo (#2806)
- Contract method parameter handling fixed (#2815)
- ``isBigNumber`` export fixed (#2835)
- ``SyncingSubscription`` fixed (#2833)
- ``getBlock`` types fixed (#2819)
- Transaction confirmation workflow fixed for parity (#2847)
- ``WebsocketProvider`` event handling fixed (#2711)
- ``WebsocketProvider`` memory leak fixed (#2851)
