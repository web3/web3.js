---
sidebar_position: 11
sidebar_label: web3.utils
---

# web3 Utils Migration Guide

## Import

To make use you only import the utility functions which are needed by your app. We encourage the named import for `web3-utils` package. This change has no impact on the using the namespace `Web3.utils` or `web3.utils`. If you still want to import the full utils it can be done as following:

```ts
// 1.x
import web3Utils from 'web3-utils';

// 4.x
import * as web3Utils from 'web3-utils';
```

## Unit conversion functions

The `toWei` does not have an optional second parameter. You have to pass the source unit explicitly.

```ts
// 1.x
web3.utils.toWei('0.1');

// 4.x
web3.utils.toWei('0.1', 'ether');
```

## Validation functions

Validation functions has been moved to the new package `web3-validator`. Actually, you can still import them from `web3-util`. But they are marked as "deprecated" and you are encouraged to import them from `web3-validator`.

However, there are changes for the following:

### `isHex` and `isHexStrict` validation functions

There is a fix, and some edge-cases-changes for those 2 functions but the overall functionality stayed the same. And here is exactly whet changed:

#### `isHex` now returns `true` for all negative numbers

```ts
isHex('-123'); // in 1.x used to return `false`. But changed in 4.x to return `true`
// `true`
```

#### `isHex` now returns `false` for an empty string

```ts
isHex(''); // in 1.x used to return `true`. But changed in 4.x to return `false`
// `false`
```

#### `isHex` and `isHexStrict` now returns `false` for `'-0x'`

```ts
isHex('-0x'); // in 1.x used to return `true`. But changed in 4.x to return `false`
// `false`

isHexStrict('-0x'); // in 1.x used to return `true`. But changed in 4.x to return `false`
// `false`
```

## Other functions

`compareBlockNumbers` now accepts either both block tags or both block numbers for comparison as parameters. The only exception is comparison of block tag `earliest` with numbers.

```ts
compareBlockNumbers('earliest', 'safe'); // its valid comparison, and it will return `-1`

compareBlockNumbers(8692, 2); // its valid comparison, and it will return `1`

compareBlockNumbers('latest', 500); // in 1.x it used to return `1`, but now it will throw error InvalidBlockError
```
