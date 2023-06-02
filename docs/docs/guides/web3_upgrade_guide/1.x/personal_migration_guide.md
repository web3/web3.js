---
sidebar_position: 8
sidebar_label: web3.eth.personal
---

# web3.eth.personal Migration Guide

## Breaking Changes

### extend

In 4.x the method `extend` is deprecated.

web3 4.x will not have:

```ts
// -> web3.extend
// -> web3.eth.extend
// -> web3.shh.extend
// -> web3.bzz.extend
```

### Defaults and Configs

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` default value is `undefined` instead of `null` (if web3 is instantiated without a provider)
