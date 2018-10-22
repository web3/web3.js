# web3-eth-ens

This is a sub package of [web3.js][repo]

This is the Ens package and it will be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-ens
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-ens.js` and `dist/web3-eth.js` in your html file.
This will expose the `EthEns` object on the window object.

## Usage

```js
var ProvidersPackage = require('web3-providers');
var Network = require('web3-net').Network;
var Accounts = require('web3-eth-accounts').Accounts;
var Ens = require('web3-eth-ens').Ens;

var provider = ProvidersPackage.resolve('ws://localhost:8546');

var ens = new Ens(
    provider,
    new Network(provider),
    new Accounts(provider)
);
    
ens.getAddress('ethereum.eth').then(function (result) {
  console.log(result);
});
```



[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


