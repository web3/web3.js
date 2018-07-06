# web3-providers-ws

This is a sub package of [web3.js][repo]

This is a websocket provider for [web3.js][repo].   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-ws
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-providers-ws.js` in your html file.
This will expose the `Web3WsProvider` object on the window object.


## Usage

```js
// in node.js
var Web3WsProvider = require('web3-providers-ws');

var options = { timeout: 30000, headers: {authorization: 'Basic username:password'} } // set a custom timeout at 30 seconds, and credentials (you can also add the credentials to the URL: ws://username:password@localhost:8546)
var ws = new Web3WsProvider('ws://localhost:8546', options);
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
