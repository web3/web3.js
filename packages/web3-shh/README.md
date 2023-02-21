# web3-shh

[![NPM Package][npm-image]][npm-url]

This is a sub-package of [web3.js][repo]

This is the whisper v5 package.

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-shh) or using [Yarn](https://yarnpkg.com/package/web3-shh)

### Using NPM

```bash
npm install web3-shh
```

### Using Yarn

```bash
yarn add web3-shh
```

## Usage

```js
const Web3Personal = require('web3-shh');

const shh = new Web3Personal('ws://localhost:8546');
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-shh.svg
[npm-url]: https://npmjs.org/package/web3-shh
