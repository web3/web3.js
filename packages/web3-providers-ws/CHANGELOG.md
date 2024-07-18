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

## [4.0.1-alpha.2]

### Changed

-   Updated Web3.js dependencies (#5664)

## [4.0.1-alpha.3]

### Changed

-   Updated dependencies (#5725)

## [4.0.1-alpha.4]

### Changed

-   `main` and `files` entries in `package.json` changed to `lib/` directory from `dist/` (#5739)
-   Refactor to use common SocketProvider class (#5683)
-   Legacy Event `close` has been deprecated, superseded by `disconnect` (#5683)

## [4.0.1-alpha.5]

### Changed

-   web3.js dependencies (#5757)

## [4.0.1-rc.0]

### Added

-   Added named export for `WebSocketProvider` (#5771)
-   The getter of `SocketConnection` in `WebSocketProvider` (inherited from `SocketProvider`) returns isomorphic `WebSocket` (#5891)

## [4.0.1-rc.1]

### Added

-   Added source files (#5956)
-   Added hybrid build (ESM and CJS) of library (#5904)

## [4.0.1-rc.2]

### Changed

-   Dependencies updated

## [4.0.1]

Release Notes:

Detailed List of change logs are mentioned under previous 4.x alpha and RC releases.

Documentation:
[Web3.js documentation](https://docs.web3js.org/)
[Web3 API](https://docs.web3js.org/api)
[Migration Guide from 1.x](https://docs.web3js.org/guides/web3_upgrade_guide/x/)

## [4.0.2]

### Fixed

-   Fixed #6162 @types/ws issue (#6205)

## [4.0.3]

### Changed

-   Dependencies updated

## [4.0.4]

### Fixed

-   Ensure a fixed version for "@types/ws": "8.5.3" (#6309)

## [4.0.5]

### Changed

-   Dependencies updated

## [4.0.6]

### Changed

-   Dependencies updated

## [4.0.7]

### Fixed

-   Fixed bug in chunks processing logic (#6496)

## [4.0.8]

### Changed

-   Update dependancies (#7109)

## [Unreleased]