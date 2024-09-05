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

## [1.0.0.rc.0]

### Added

-   RC release 

## [1.0.0.rc.1]

### Added

 - When error is returned with code 429, throw rate limit error (#7102)

### Changed

 - Change request return type `Promise<ResultType>` to `Promise<JsonRpcResponseWithResult<ResultType>>` (#7102)

## [1.0.0-rc.2]

### Added

-   Updated rate limit error of QuickNode provider for HTTP transport
-   Added optional `HttpProviderOptions | SocketOptions` in `Web3ExternalProvider` and `QuickNodeProvider` for provider configs

## [Unreleased]