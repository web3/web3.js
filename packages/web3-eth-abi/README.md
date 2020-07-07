# web3-eth-abi

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

This is the abi package used in the `web3-eth` package.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-abi
```

## Usage

```js
const Web3EthAbi = require('web3-eth-abi');

Web3EthAbi.encodeFunctionSignature('myMethod(uint256,string)');
> '0x24ee0097'
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-eth-abi.svg
[npm-url]: https://npmjs.org/package/web3-eth-abi
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-eth-abi
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-eth-abi
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-eth-abi
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-eth-abi
