# web3-shh

This is a sub package of [web3.js][repo]

This is the whisper v5 package.  
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-shh
```

### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler.
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

This injected object is called `Web3Shh`.

## Usage

```js
// in node.js
var Web3Shh = require('web3-shh');

var shh = new Web3Shh('ws://localhost:8546');
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
