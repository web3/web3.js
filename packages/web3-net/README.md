# web3-net

This is a sub package of [web3.js][repo]

This is the net package to be used in other web3.js packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-net
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-net.js` in your html file.
This will expose the `Web3Net` object on the window object.

## Usage

```js
// in node.js
var Web3Net = require('web3-net');

var net = new Web3Net('ws://localhost:8546');
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
