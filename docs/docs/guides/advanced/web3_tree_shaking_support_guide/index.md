---
sidebar_position: 4
sidebar_label: Tree Shaking Guide
---

# Tree shaking Support Guide

1. Use the `production` mode configuration option to enable various optimizations including minification and tree shaking. Set your webpack.config:

```js
"mode":"production"
```

2. Add a `sideEffects` property to your project's `package.json` file:

```json
"sideEffects": false
```

:::note
For further information about `sideEffects` see [webpack docs](https://webpack.js.org/guides/tree-shaking/)

::: 3. Set your tsconfig module to `ES2015` or higher to support `imports`, because tree shaking does not work with `require`:

```json
"module": "ES2015"
```

4. Use the specific packages which you need,

    For example, if you need `web.eth`:

```ts
import Web3Eth from 'web3-eth';
```

If you only need a few functions from `web3-utils`:

```ts
import { numberToHex, hexToNumber } from 'web3-utils';
```

You can find an example app with tree shaking [here](https://github.com/ChainSafe/web3js-example-react-app).
