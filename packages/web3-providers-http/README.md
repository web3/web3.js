# web3-providers-http

_This is a sub package of [web3.js][repo]_

This is a HTTP provider for [web3.js][repo].  
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-http
```

### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler.
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

This injected object is called `Web3HttpProvider`.

## Usage

```js
// in node.js
var Web3HttpProvider = require('web3-providers-http');

var options = {
    timeout: 20000, // milliseconds,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'},{...}]
};
var http = new Web3HttpProvider('http://localhost:8545', options);
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
