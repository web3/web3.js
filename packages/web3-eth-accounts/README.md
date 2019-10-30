# web3-eth-accounts

This is a sub package of [web3.js][repo]

This is the accounts package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-accounts
```

### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler.
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

This injected object is called `Web3EthAccounts`.

## Usage

```js
// in node.js
var Web3EthAccounts = require('web3-eth-accounts');

var account = new Web3EthAccounts('ws://localhost:8546');
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

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
