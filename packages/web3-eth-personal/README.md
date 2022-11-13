# web3-eth-personal

[![NPM Package][npm-image]][npm-url]

This is a sub-package of [web3.js][repo].

This is the personal package used in the `web3-eth` package.

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-eth-personal) or using [Yarn](https://yarnpkg.com/package/web3-eth-personal)

### Using NPM

```bash
npm install web3-eth-personal
```

### Using Yarn

```bash
yarn add web3-eth-personal
```

## Usage

```js
const Web3EthPersonal = require('web3-eth-personal');

const personal = new Web3EthPersonal('ws://localhost:8546');
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-eth-personal.svg
[npm-url]: https://npmjs.org/package/web3-eth-personal
