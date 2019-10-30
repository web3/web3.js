# web3-providers-ws

This is a sub package of [web3.js][repo]

This is a websocket provider for [web3.js][repo].  
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-ws
```

### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler.
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

This injected object is called `Web3WsProvider`.

## Usage

```js
// in node.js
var Web3WsProvider = require('web3-providers-ws');

var options = {
    timeout: 30000,
    headers: { authorization: 'Basic username:password' }
}; // set a custom timeout at 30 seconds, and credentials (you can also add the credentials to the URL: ws://username:password@localhost:8546)
var ws = new Web3WsProvider('ws://localhost:8546', options);
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
