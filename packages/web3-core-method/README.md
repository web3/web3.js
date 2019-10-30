# web3-core-method

This is a sub package of [web3.js][repo]

The Method package used within most [web3.js][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-core-method
```

### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler.
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

This injected object is called `Web3CoreMethod`.

## Usage

```js
// in node.js
var Web3Method = require('web3-core-method');

var method = new Web3Method({
    name: 'sendTransaction',
    call: 'eth_sendTransaction',
    params: 1,
    inputFormatter: [inputTransactionFormatter]
});
method.attachToObject(myCoolLib);

myCoolLib.sendTransaction({...}, function(){ ... });
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
