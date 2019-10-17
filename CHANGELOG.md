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

## [1.2.0]

Released with 1.0.0-beta.37 code base.

## [1.2.1]

### Fixed

- ``websocket`` dependency fixed (#2971, #2976)
- ``requestOptions`` added to ``WebsocketProvider`` (#2979) 
- Node >= v8.0.0 support (#2938)

## [Unreleased]

## [1.2.2]

### Added

- localStorage support detection added (#3031)
- getNetworkType method extended with Görli testnet (#3095)
- supportsSubscriptions method added to providers (#3116)
- Add `eth.getChainId` method (#3113)
- Minified file added to web3 package (#3131)
- The transaction confirmation workflow can now be configured (#3130)
- TypeScript type definitions added for all modules (#3132)

### Fixed

- Fix allow `0` as a valid `fromBlock` or `toBlock` filter param (#1100)
- Fix randomHex returning inconsistent string lengths (#1490)
- Fix make isBN minification safe (#1777)
- Fix incorrect references to BigNumber in utils.fromWei and utils.toWei error messages (#2468)
- Fix error incorrectly thrown when receipt.status is `null` (#2183)
- Fix incorrectly populating chainId param with `net_version` when signing txs (#2378)
- regeneratorRuntime error fixed (#3058)
- Fix accessing event.name where event is undefined (#3014)
- fixed Web3Utils toHex() for Buffer input (#3021)
- Fix bubbling up tx signing errors (#2063, #3105)
- HttpProvider: CORS issue with Firefox and Safari (#2978)
- Ensure the immutability of the `tx` object passed to function `signTransaction` (#2190)
- Gas check fixed (#2381)
- Signing issues #1998, #2033, and #1074 fixed (#3125)
- Fix hexToNumber and hexToNumberString prefix validation (#3086)
- The receipt will now returned on a EVM error (this got removed on beta.18) (#3129)
- Fixes transaction confirmations with the HttpProvider (#3140)
