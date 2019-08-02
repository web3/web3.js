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

## [2.0.0-alpha]

### Added

- Sending of locally signed transactions as ``BatchRequest`` (#2708)
- Automatic increason of the nonce for locally signed transactions (#2796)

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

## [Unreleased]

## [2.0.0-alpha.1]

### Added

- Length check of the PK added to the ``fromPrivateKey`` method of the ``Account`` model (#2928)
- Changed event added to the ``Contract`` events (#2960)

### Changed

- fsevents bumbed to v1.2.9 (#2951)

### Fixed

- miner.startMining fixed (#2877)
- Subscription type definitions fixed (#2919)
- ``ContractOptions`` type definitions corrected (#2939)
- Scrypt compatibility with older and newer nodejs versions fixed (#2952)
- Encryption of the V3Keystore fixed (#2950)
- Provider timeout fixed and Maps are used now to handle subscriptions (#2955)
- stripHexPrefix fixed (#2989)
- BatchRequest error handling fixed for callbacks (#2993)
