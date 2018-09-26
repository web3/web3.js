# web3.js - Ethereum && True-beta JavaScript API


This is the Ethereum [JavaScript API][docs]
which connects to the [Generic JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec.

You need to run a local or remote Ethereum node to use this library.

Please read the [documentation][docs] for more.

## Installation

### Node

```bash
npm install web3
```

### Yarn

```bash
yarn add web3
```

### In the Browser

Use the prebuild ``dist/web3.min.js``
Then include `dist/web3.js` in your html file.
This will expose `Web3` on the window object.

## Usage

```js
// in node.js
var Web3 = require('web3');

var web3 = new Web3('ws://localhost:8546');
console.log(web3);
> {
    eth: ... ,
    shh: ... ,
    utils: ...,
    ...
}

// ether account balance
web3.eth.getBalance(addr)
.then(function(res){
    console.log('ether balance', res);  // balance of ether
})

// True-beta
var true_web3 = new Web3.modules.ETrue('http://39.105.126.32:8544');

// var address = web3.eth.accounts.privateKeyToAccount('0x01');
//address: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf

true_web3.getBalance('0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf')
.then(function(res){
    console.log('true beta balance', res);  // balance of true-beta
})

```

Additionally you can set a provider using `web3.setProvider()` (e.g. WebsocketProvider)

```js
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```
## Documentation

Documentation can be found at [read the docs][docs]


### Testing (mocha)

```bash
npm test
```


[repo]: https://github.com/ethereum/web3.js
[docs]: http://web3js.readthedocs.io/en/1.0/
[npm-url]: https://npmjs.org/package/web3