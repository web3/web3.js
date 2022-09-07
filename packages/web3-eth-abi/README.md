# web3-eth-abi

[![NPM Package][npm-image]][npm-url] 

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

