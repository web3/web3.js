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

## [4.0.0-alpha.1]

### Breaking Changes

#### Connection close is not supported

In `1.x` user had access to raw connection object and can interact with it. e.g.

```ts
web3.currentProvider.connection.close();
```

But this internal behavior is not exposed any further. Though you can achieve same with this approach.

```ts
web3.currentProvider.disconnect();
```
