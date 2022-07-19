---
sidebar_position: 7
sidebar_label: Web3.eth.personal
---

# Web3.eth.personal Migration Guide

## Breaking Changes

Method `extend` is deprecated in 4.x

### Defaults and Configs

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` default value is `undefined` instead of `null` (if web3 is instantiated without a provider)
