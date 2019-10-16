# web3-eth-personal

This is a sub package of [web3.js][repo]

This is the personal package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-personal
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-personal.js` in your html file.
This will expose the `Web3EthPersonal` object on the window object.

## Usage

```js
// in node.js
var Web3EthPersonal = require('web3-eth-personal');

var personal = new Web3EthPersonal('ws://localhost:8546');
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
