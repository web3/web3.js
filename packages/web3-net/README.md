# web3-net

[![NPM Package][npm-image]][npm-url]

This is a sub-package of [web3.js][repo].

This is the net package used in other [web3.js][repo] packages.

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-net) or using [Yarn](https://yarnpkg.com/package/web3-net)

### Using NPM

```bash
npm install web3-net
```

### Using Yarn

```bash
yarn add web3-net
```

## Usage

```js
const Web3Net = require('web3-net');

const net = new Web3Net('ws://localhost:8546');
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-net.svg
[npm-url]: https://npmjs.org/package/web3-net
