# web3-bzz

This is a sub package of [web3.js][repo]

This is the swarm package.  
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-bzz
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-bzz.js` in your html file.
This will expose the `Web3Personal` object on the window object.

## Usage

```js
// in node.js
var Web3Bzz = require('web3-bzz');

var bzz = new Web3Bzz('http://swarm-gateways.net');
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
