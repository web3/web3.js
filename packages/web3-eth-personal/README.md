# web3-eth-personal

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub package of [web3.js][repo]

This is the personal package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-personal
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-personal.js` in your html file.
This will expose the `Web3EthPersonal` object on the window object.

## Usage

```js
// in node.js
var Web3EthPersonal = require('web3-eth-personal');

var personal = new Web3EthPersonal('ws://localhost:8546');
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/dm/web3-eth-personal.svg
[npm-url]: https://npmjs.org/package/web3-eth-personal
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-eth-personal
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-eth-personal
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-eth-personal
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-eth-personal
