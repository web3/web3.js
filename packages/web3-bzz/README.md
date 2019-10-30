# web3-bzz

This is a sub package of [web3.js][repo]

This is the swarm package.  
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-bzz
```


### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler.
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

This injected object is called `Web3Bzz`.

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
