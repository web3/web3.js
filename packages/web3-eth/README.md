# web3-eth

[![NPM Package][npm-image]][npm-url]

This is a sub-package of [web3.js][repo].

This Eth package is used within some [web3.js][repo] packages.

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-eth) or using [Yarn](https://yarnpkg.com/package/web3-eth)

### Using NPM

```bash
npm install web3-eth
```

### Using Yarn

```bash
yarn add web3-eth
```

## Usage

```js
const Web3Eth = require('web3-eth');

const eth = new Web3Eth('ws://localhost:8546');
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3-eth.js
[npm-image]: https://img.shields.io/npm/v/web3-eth.svg
[npm-url]: https://npmjs.org/package/web3-eth
