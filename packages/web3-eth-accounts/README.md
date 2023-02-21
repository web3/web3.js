# web3-eth-accounts

[![NPM Package][npm-image]][npm-url]

This is a sub-package of [web3.js][repo].

This is the accounts package used in the `web3-eth` package.

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-eth-accounts) or using [Yarn](https://yarnpkg.com/package/web3-eth-accounts)

### Using NPM

```bash
npm install web3-eth-accounts
```

### Using Yarn

```bash
yarn add web3-eth-accounts
```

## Usage

```js
const Web3EthAccounts = require('web3-eth-accounts');

const account = new Web3EthAccounts('ws://localhost:8546');
account.create();
> {
  address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
  privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
  signTransaction: function(tx){...},
  sign: function(data){...},
  encrypt: function(password){...}
}
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-eth-accounts.svg
[npm-url]: https://npmjs.org/package/web3-eth-accounts
