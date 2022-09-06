---
sidebar_position: 10
sidebar_label: Web3.utils
---

# Web3 Utils Migration Guide

## Import

To make use you only import the utility functions which are needed by your app we encourage the named import for `web3-utils` package. This change has no impact on the using the namespace `Web3.utils` or `web3.utils`. If you still want to import the full utils it can be done as following :

```ts
//1.x
import web3Utils from 'web3-utils';

//4.x
import * as web3Utils from 'web3-utils';
```

## Unit conversion functions

The `toWei` does not have an optional second parameter. You have to pass the source unit explicitly.

```ts
//1.x
web3.utils.toWei('0.1');

//4.x
web3.utils.toWei('0.1', 'ether');
```
