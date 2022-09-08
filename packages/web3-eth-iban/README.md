# web3-eth-iban

[![NPM Package][npm-image]][npm-url] 

This is a sub package of [web3.js][repo]

This is the IBAN package to be used in the `web3-eth` package.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-iban
```

## Usage

```js
const Web3EthIban = require('web3-eth-iban');

const iban = new Web3EthIban('XE75JRZCTTLBSYEQBGAS7GID8DKR7QY0QA3');
iban.toAddress() > '0xa94f5374Fce5edBC8E2a8697C15331677e6EbF0B';
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-eth-iban.svg
[npm-url]: https://npmjs.org/package/web3-eth-iban
