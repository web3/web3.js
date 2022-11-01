---
sidebar_position: 2
sidebar_label: Web3.tree.shaking
---

# Web3 Tree shaking Support Guide

1. Use the `production` mode configuration option to enable various optimizations including minification and tree shaking. Set to your webpack.config:

```js
"mode":"production"
```

2. Add a `sideEffects` property to your project's package.json file:

```json
"sideEffects": false
```

**_NOTE:_** For further information about `sideEffects` see: https://webpack.js.org/guides/tree-shaking/

3. Set your tsconfig module to `ES2015` or higher to support `imports`, because tree shaking does not work with `require`:

```json
"module": "ES2015"
```

4. Use only packages which you need:
   For example, if you need `web.eth`:

```ts
import Web3Eth from 'web3-eth';
```

If you need only few functions from `web3-utils`:

```ts
import { numberToHex, hexToNumber } from 'web3-utils';
```

Example app with tree shaking you can find here https://github.com/ChainSafe/web3js-example-react-app
