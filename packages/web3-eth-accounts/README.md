# web3-eth-accounts

This is a sub package of [web3.js][repo]

This is the accounts package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-accounts
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-accounts.js` in your html file.
This will expose the `Web3EthAccounts` object on the window object.


## Usage

```js
import {ProvidersModuleFactory} from 'web3-providers';
import {Accounts} from 'web3-eth-accounts';

const accounts = new Accounts(
    new ProvidersModuleFactory().createProviderAdapterResolver().resolve('http://127.0.0.1:4546'),
    options
);
accounts.create();
> {
  address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
  privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
  signTransaction: function(tx){...},
  sign: function(data){...},
  encrypt: function(password){...}
}
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


