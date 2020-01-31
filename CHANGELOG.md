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

## [1.2.2]

### Added

- localStorage support detection added (#3031)
- getNetworkType method extended with Görli testnet (#3095)
- supportsSubscriptions method added to providers (#3116)
- Add `eth.getChainId` method (#3113)
- Minified file added to web3 package (#3131)
- The transaction confirmation workflow can now be configured (#3130)
- Additional parameters for accounts.signTransaction added [(docs)](https://web3js.readthedocs.io/en/v1.2.2/web3-eth-accounts.html#signtransaction) (#3141)
- Emit `connected` event on subscription creation (#3028)
- TypeScript type definitions added for all modules (#3132)
- Bloom filters added to web3.utils (#3137)

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

## [1.2.3]

### Fixed

- Fix perfect gas usage causes tx to error (#3175)
- Fix regenerator runtime error in web3.min.js (#3155)
- Fix TS types for eth.subscribe syncing, newBlockHeaders, pendingTransactions (#3159)
- Improve web3-eth-abi decodeParameters error message (#3134)

## [1.2.4]

### Fixed

- Fix npm installation error for scrypt-shim and websocket (#3210)

## [1.2.5]

### Added

- ``eth_requestAccounts`` as ``requestAccounts`` added to web3-eth package (#3219)
- ``sha3Raw`` and ``soliditySha3Raw`` added to web3-utils package (#3226)
- ``eth_getProof`` as ``getProof`` added to web3-eth package (#3220)
- ``BN`` and ``BigNumber`` objects are now supported by the ``abi.encodeParameter(s)`` method (#3238)
- ``getPendingTransactions`` added to web3-eth package (#3239)
- Revert instruction handling added which can get activated with the ``handleRevert`` module property (#3248)
- The ``receipt`` does now exist as property on the error object for transaction related errors (#3259)
- ``internalType`` added to ``AbiInput`` TS interface in ``web3-utils`` (#3279)
- Agent option added to the ``HttpProvider`` options (#2980)

### Changed

- ``eth-lib`` dependency updated (0.2.7 => ^0.2.8) (#3242)

### Fixed

- Fix crash when decoding events with identical signatures, differently indexed args (#3272)
- Fix user supplied callback not fired in eth.accounts.signTransaction (#3283)
- Fix minified bundle (#3256)
- ``defaultBlock`` property handling fixed (#3247)
- ``clearSubscriptions`` does no longer throw an error if no running subscriptions do exist (#3246)
- callback type definition for ``Accounts.signTransaction`` fixed (#3280)
- fix: export bloom functions on the index.js
- Prefer receipt status to code availability on contract deployment (#3298)

## [1.2.6]

### Added

- Görli testnet ENS registry added to the known registries (#3338)

### Changed

- ENS registry addresses updated (#3353, https://medium.com/the-ethereum-name-service/ens-registry-migration-bug-fix-new-features-64379193a5a)

## [Unreleased]
