# web3-eth

This is a sub package of [web3.js][repo]

This is the Eth package to be used [web3.js][repo].
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth.js` in your html file.
This will expose the `Web3Eth` object on the window object.


## Usage

```js
// in node.js
var ProvidersPackage = require('web3-providers');
var Eth = require('web3-eth').Eth;

var eth = new Eth(
    ProvidersPackage.resolve('http://127.0.0.1:4546')
);
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


